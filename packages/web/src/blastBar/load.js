import FileSaver from 'file-saver';
import Blockly from 'blockly';
import {importFromXml} from '../BlocklyWorkspace/useBlocklyWorkspace.js';

import {
  getWorkspace,
  resetInterpreter,
  throwError,
} from '../assets/js/interpreter.js';
import {implementedThings, resetThings} from '../assets/js/things.js';

const {hideChaff, Xml} = Blockly;

/**
 * Hash error message.
 */
const NOT_FOUND_ERROR = 'Sorry, couldn\'t find "%1".';

/**
 * Faulty xml error message.
 */
const XML_ERROR =
  'Could not load your saved file.\n' +
  'Perhaps it was created with a different version of Blast?';

export const loadSample = async function (path, reconnectDialogRef) {
  let xml;
  const response = await fetch(path);
  if (response.ok) {
    xml = await response.text();
  } else {
    throwError(NOT_FOUND_ERROR.replace('%1', path));
    return;
  }
  loadXml(xml, reconnectDialogRef);
};

const loadXml = function (xml, reconnectDialogRef) {
  hideChaff();
  resetInterpreter();
  resetThings();

  const workspace = getWorkspace();
  workspace.clear();
  try {
    xml = Xml.textToDom(xml);
  } catch (e) {
    throwError(XML_ERROR + '\nXML: ' + xml);
    return;
  }

  const thingBlocks = xml.querySelectorAll('block[type^="things_"]');
  if (thingBlocks.length > 0) {
    const things = {};
    for (const thingBlock of thingBlocks) {
      const name = thingBlock.firstElementChild.textContent;
      if (name) {
        things[name] = {};
        const blockName = thingBlock.getAttribute('type');
        const type = blockName.split('_')[1];
        const thing = implementedThings.find(thing => thing.id === type);
        things[name] = thing;
        things[name]['connected'] = false;
      }
    }
    // open ReconnectDialog and wait for user to reconnect
    reconnectDialogRef.current.open(things, xml);
  } else {
    importFromXml(xml, workspace, false);
  }
};

export const loadFromFile = function asnyc(event, reconnectDialogRef) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const xml = event.target.result;
    loadXml(xml, reconnectDialogRef);
  };
  fileReader.readAsText(event.target.files[0]);
};

export const save = function () {
  const workspace = getWorkspace();
  let xml = Xml.workspaceToDom(workspace, true);
  if (workspace.getTopBlocks(false).length === 1 && xml.querySelector) {
    const block = xml.querySelector('block');
    if (block) {
      block.removeAttribute('x');
      block.removeAttribute('y');
    }
  }
  // prettify xml.
  xml = Xml.domToPrettyText(xml);

  const blob = new Blob([xml], {type: 'text/xml'});
  FileSaver.saveAs(blob, 'blast.xml');
};
