import FileSaver from 'file-saver';
import {hideChaff, utils, Xml} from 'blockly';
import {importFromXml} from '../BlocklyWorkspace/useBlocklyWorkspace';

import {getWorkspace, resetInterpreter} from '../assets/js/interpreter';
import {
  implementedThing,
  implementedThings,
  resetThings,
} from '../assets/js/things.js';
import ReconnectDialog from './ReconnectDialog';
import React from 'react';

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

export const loadSample = async function (
  path: string,
  reconnectDialogRef: React.RefObject<ReconnectDialog>
) {
  let xml;
  const response = await fetch(path);
  if (response.ok) {
    xml = await response.text();
  } else {
    console.error(NOT_FOUND_ERROR.replace('%1', path));
    return;
  }
  await loadXml(xml, reconnectDialogRef);
};

const loadXml = async function (
  xmlString: string,
  reconnectDialogRef: React.RefObject<ReconnectDialog>
) {
  hideChaff();
  await resetInterpreter();
  resetThings();

  const workspace = getWorkspace();
  if (!workspace) {
    return;
  }
  let xml;
  try {
    xml = utils.xml.textToDom(xmlString);
  } catch (e) {
    console.error(XML_ERROR + '\nXML: ' + xml);
    return;
  }

  const thingBlocks = xml.querySelectorAll('block[type^="things_"]');
  if (thingBlocks.length > 0) {
    const things: Record<string, implementedThing | undefined> = {};
    for (const thingBlock of thingBlocks) {
      if (thingBlock.firstElementChild === null) {
        continue;
      }
      const name = thingBlock.firstElementChild.textContent;
      if (name) {
        const blockName = thingBlock.getAttribute('type');
        const type = blockName?.split('_')[1];
        const thing = implementedThings.find(thing => thing.id === type);
        if (thing) {
          thing.connected = false;
          things[name] = thing;
        }
      }
    }
    // open ReconnectDialog and wait for user to reconnect
    reconnectDialogRef.current?.open(things, xml);
  } else {
    importFromXml(xml, workspace, e => {
      throw new Error(e);
    });
  }
};

export const loadFromFile = function (
  event: React.ChangeEvent<HTMLInputElement>,
  reconnectDialogRef: React.RefObject<ReconnectDialog>
) {
  const fileReader = new FileReader();
  fileReader.onload = async function (event) {
    const xml = event.target?.result as string;
    await loadXml(xml, reconnectDialogRef);
  };
  if (event.target?.files) {
    fileReader.readAsText(event.target?.files[0]);
  } else {
    console.error('No file selected.');
  }
};

export const save = function () {
  const workspace = getWorkspace();
  if (!workspace) {
    return;
  }
  const xml = Xml.workspaceToDom(workspace, true);
  if (workspace.getTopBlocks(false).length === 1 && xml.querySelector) {
    const block = xml.querySelector('block');
    if (block) {
      block.removeAttribute('x');
      block.removeAttribute('y');
    }
  }
  // prettify xml.
  const xmlString = Xml.domToPrettyText(xml);

  const blob = new Blob([xmlString], {type: 'text/xml'});
  FileSaver.saveAs(blob, 'blast.xml');
};
