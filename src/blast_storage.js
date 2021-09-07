/**
 * @fileoverview Saving and loading block programs
 * to samples folder and local storage.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

/**
 * Namespace for the block storage
 * @name Blast.Storage
 * @namespace
 * @public
 */
goog.provide('Blast.Storage');

/**
 * Http-request error message.
 */
Blast.Storage.HTTPREQUEST_ERROR = 'There was a problem with the request.\n';

/**
 * Save-success alert.
 */
Blast.Storage.LINK_ALERT = 'Load your blocks with this link:\n\n%1';

/**
 * Hash error message.
 */
Blast.Storage.NOT_FOUND_ERROR = 'Sorry, couldn\'t find "%1".';

/**
 * Faulty xml error message.
 */
Blast.Storage.XML_ERROR = 'Could not load your saved file.\n' +
    'Perhaps it was created with a different version of Blast?';
 
/**
  * Save blocks to database and return a link containing key to XML.
  */
Blast.Storage.link = function() {
  const workspace = Blast.workspace;
  let xml = Blockly.Xml.workspaceToDom(workspace, true);
  // Remove x/y coordinates from XML if there's only one block stack.
  if (workspace.getTopBlocks(false).length == 1 && xml.querySelector) {
    const block = xml.querySelector('block');
    if (block) {
      block.removeAttribute('x');
      block.removeAttribute('y');
    }
  }
  // Remove device id from xml.
  xml = Blast.Storage.removeDeviceId_(xml);

  let path = document.getElementById('loadWorkspace-input').value;
  if (!path || path.length == 0) {
    path = 'storage/' + Blast.Storage.generatePath();
  }
  const data = Blockly.Xml.domToText(xml);
  Blast.Storage.saveXML_(path, data);
};

/**
 * Removes device ID children from all blocks of type things_webBluetooth in the xml.
 * @param {!Element} xml XML to remove device ids from.
 * @return {!Element} XML with device ids removed.
 * @private
 */
Blast.Storage.removeDeviceId_ = function(xml) {
  const blocks = xml.querySelectorAll('block');

  for (const block of blocks) {
    if (block.getAttribute('type') == 'things_webBluetooth') {
      // first child is the device id
      const child = block.firstElementChild;
      if (child) {
        child.remove();
      }
    }
  }
  return xml;
};

/**
 * Save the current workspace to URL defined in input.
 * @param {string} path path to save workspace at.
 * @param {string} xml the xml to save.
 * @private
 */
Blast.Storage.saveXML_ = function(path, xml) {
  Blockly.hideChaff();
  
  // Send put request.
  fetch(path, {
    method: 'PUT',
    body: xml,
  }).then((response) => {
    if (response.ok) {
      location.hash = path;
      Blockly.alert(Blast.Storage.LINK_ALERT.replace('%1', window.location.href));
    } else {
      Blast.throwError(Blast.Storage.HTTPREQUEST_ERROR);
    }
  });
};

Blast.Storage.load = function() {
  const url = document.getElementById('loadWorkspace-input').value;
    
  // if input is empty show warning and return.
  if (url == '') {
    Blockly.alert('Enter a URI first.');
    return;
  }
  Blast.Storage.retrieveXML_(url);
};

/**
 * Load blocks from URI defined in {@link Blast.Ui.uriInput}.
 * @param {string} path path to the XML to load.
 * @private
 */
Blast.Storage.retrieveXML_ = async function(path) {
  Blockly.hideChaff();
  // stop execution
  Blast.resetInterpreter();
  Blast.resetUi(Blast.status.READY);

  
  // send GET request
  fetch(path)
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          Blast.throwError(Blast.Storage.NOT_FOUND_ERROR.replace('%1', path));
        }
      })
      .then((xml) => {
        // clear blocks
        Blast.workspace.clear();
        try {
          xml = Blockly.Xml.textToDom(xml);
        } catch (e) {
          Blast.throwError(Blast.Storage.XML_ERROR + '\nXML: ' + xml);
          return;
        }
        Blockly.Xml.domToWorkspace(xml, Blast.workspace);
        Blast.Storage.monitorChanges_(Blast.workspace);
      });
};
 
/**
  * Start monitoring the workspace. If a change is made that changes the XML,
  * clear the key from the URL. Stop monitoring the workspace once such a
  * change is detected.
  * @param {!Blockly.WorkspaceSvg} workspace Workspace.
  * @private
  */
Blast.Storage.monitorChanges_ = function(workspace) {
  const startXmlDom = Blockly.Xml.workspaceToDom(workspace);
  const startXmlText = Blockly.Xml.domToText(startXmlDom);
  /**
   * Monitors the workspace for changes to the xml
   */
  function change() {
    const xmlDom = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToText(xmlDom);
    if (startXmlText != xmlText) {
      window.location.hash = '';
      workspace.removeChangeListener(change);
    }
  }
  workspace.addChangeListener(change);
};

/**
 * Generates a random filename and returns its path.
 * @returns {string} path to the random filename
 * @public
 * */
Blast.Storage.generatePath = function() {
  const result = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < 12; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() *
 charactersLength)));
  }
  return result.join('');
};
 
window.addEventListener('load', function() {
  // get anchor
  const anchor = window.location.hash;
  if (anchor) {
    // remove the #.
    const path = anchor.substring(1);
    // try loading.
    try {
      Blast.Storage.retrieveXML_(path);
    } catch (e) {
      console.log(e);
    }
  }
});
