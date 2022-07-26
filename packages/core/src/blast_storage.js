/**
 * @fileoverview Saving and loading block programs
 * to samples folder and local storage.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

import {dialog, hideChaff, Xml} from 'blockly';
import FileSaver from 'file-saver';
import {addWebBluetoothDevice} from './blast_things.js';
import {addWebHidDevice} from './blast_things.js';
import {implementedThings} from './blast_things.js';
import {getWorkspace} from './blast_interpreter.js';
import {optionalServices} from './blast_webBluetooth.js';
import {resetInterpreter} from './blast_interpreter.js';
import {resetThings} from './blast_things.js';
import {requestDevice} from './blast_webBluetooth.js';
import {throwError} from './blast_interpreter.js';

/**
 * Http-request error message.
 */
const HTTPREQUEST_ERROR = 'There was a problem with the request.\n';

/**
 * Save-success alert.
 */
const LINK_ALERT = 'Load your blocks with this link:\n\n%1';

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

/**
 * Stores the filename when loading programs for saving, default is 'BLAST.xml'.
 */
let filename = 'BLAST.xml';

/**
 * Save blocks to URI and return a link containing key to XML.
 * @param {boolean=} download optional, if true, save to file.
 */
export const link = function (download) {
  const workspace = getWorkspace();
  let xml = Xml.workspaceToDom(workspace, true);
  // Remove x/y coordinates from XML if there's only one block stack.
  if (workspace.getTopBlocks(false).length === 1 && xml.querySelector) {
    const block = xml.querySelector('block');
    if (block) {
      block.removeAttribute('x');
      block.removeAttribute('y');
    }
  }
  // prettify xml.
  xml = Xml.domToPrettyText(xml);

  // Save XML using filesaver.js.
  if (download === true) {
    const blob = new Blob([xml], {type: 'text/xml'});
    FileSaver.saveAs(blob, filename);
    return;
  }

  // Save to server.
  let path = document.getElementById('loadWorkspace-input').value;
  if (!path || path.length === 0) {
    path = 'storage/' + generatePath();
  }
  const data = Xml.domToText(xml);
  saveXML_(path, data);
};

/**
 * Save the current workspace to URL defined in input.
 * @param {string} path path to save workspace at.
 * @param {string} xml the xml to save.
 * @private
 */
const saveXML_ = function (path, xml) {
  hideChaff();

  // Send put request.
  fetch(path, {
    method: 'PUT',
    body: xml,
  }).then(response => {
    if (response.ok) {
      location.hash = path;
      dialog.alert(LINK_ALERT.replace('%1', window.location.href));
    } else {
      throwError(HTTPREQUEST_ERROR);
    }
  });
};

export const load = function () {
  const url = document.getElementById('loadWorkspace-input').value;

  // if input is empty show warning and return.
  if (url === '') {
    dialog.alert('Enter a URI first.');
    return;
  }

  // save filename to {@link filename}
  const fn = url.split('/').pop();
  if (fn.indexOf('.') > -1) {
    filename = fn;
  }

  retrieveXML_(url);
};

/**
 * Load XML from a file.
 * @param {Event} event A change event.
 * @return {Promise} A promise that will be resolved when the file is loaded.
 * @private
 */
export const loadXMLFromFile = function (event) {
  return new Promise((resolve, reject) => {
    resetThings();

    // Save filename to {@link filename}
    const fn = event.target.files[0].name;
    if (fn.indexOf('.') > -1) {
      filename = fn;
    }

    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      loadXML(e.target.result);
      resolve();
    };
    fileReader.onerror = function (evt) {
      reject(evt.target.error);
    };
    fileReader.readAsText(event.target.files[0]);
  });
};

/**
 * Resets the file selector.
 */
const resetFileInput = function () {
  const fileSelector = document.getElementById('file-selector');
  if (fileSelector) {
    fileSelector.value = '';
  }

  // reset filename
  filename = 'BLAST.xml';
};

/**
 * Load blocks from URI defined in {@link Blast.Ui.uriInput}.
 * @param {string} path path to the XML to load.
 * @private
 */
const retrieveXML_ = async function (path) {
  hideChaff();
  // stop execution
  resetInterpreter();

  resetThings();

  resetFileInput();

  // send GET request
  fetch(path)
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throwError(NOT_FOUND_ERROR.replace('%1', path));
      }
    })
    .then(loadXML);
};

/**
 * Loads the xml into the workspace.
 * @param {string} xmlString the xml to load.
 * @private
 */
export const loadXML = function (xmlString) {
  let xml;
  const workspace = getWorkspace();
  // clear blocks
  workspace.clear();
  try {
    xml = Xml.textToDom(xmlString);
  } catch (e) {
    throwError(XML_ERROR + '\nXML: ' + xml);
    return;
  }

  // prompt to WebBluetooth/webHID device connection
  const thingBlocks = xml.querySelectorAll('block[type^="things_"]');
  if (thingBlocks.length > 0) {
    generatePairButtons(thingBlocks, xml);
    // show reconnect modal
    if (document.getElementById('rcModal')) {
      document.getElementById('rcModal').style.display = 'block';
    }
    // return. will continue after reconnecting to devices
    return;
  }

  Xml.domToWorkspace(xml, workspace);
  monitorChanges_(workspace);
};

/**
 * Adds pair buttons for each web bluetooth block in xml to the reconnect modal.
 * @param {!NodeList} blocks thing blocks to generate pair buttons for.
 * @param {!Xml} xml xml of the program to load.
 * @private
 */
const generatePairButtons = function (blocks, xml) {
  if (window.location.href.includes('mobile')) {
    window.app.openReconnectDialog();
    generatePairButtonsMobile_(blocks, xml);
  } else {
    generatePairButtonsDesktop_(blocks, xml);
  }
};

/**
 * Adds pair buttons for each web bluetooth block in xml to the reconnect modal.
 * @param {!NodeList} blocks thing blocks to generate pair buttons for.
 * @param {!Xml} xml xml of the program to load.
 * @private
 */
const generatePairButtonsDesktop_ = function (blocks, xml) {
  const tbody = document.getElementById('rc-tbody');
  // delete all table rows from tbody
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  //Generates the type (e.g. things_ruuviTag) of all available things.
  for (const thing of implementedThings) {
    thing.block_name = `things_${thing.id}`;
  }
  const blocksAdded = [];

  // add pair button for each device block
  for (const block of blocks) {
    // get user defined name
    const name = block.firstElementChild.textContent;
    // skip if block was already added
    if (blocksAdded.includes(name)) {
      continue;
    }

    // get thing from implementedThings
    const type = block.getAttribute('type');
    const thing = implementedThings.find(t => t.block_name === type);

    // add new row
    const row = document.createElement('tr');
    // generate name cell html
    const nameCell = document.createElement('td');
    nameCell.appendChild(document.createTextNode(name));
    // pair cell html
    const pairCell = document.createElement('td');
    const pairButton = document.createElement('input');
    pairButton.setAttribute('type', 'button');
    pairButton.setAttribute('id', 'pairButton-' + name);
    pairButton.setAttribute('value', 'Pair');
    // pair status html
    const statusCell = document.createElement('td');
    const pairStatus = document.createElement('span');
    pairStatus.setAttribute('id', 'pairStatus-' + name);
    pairStatus.innerHTML = '&#x2718;';
    pairStatus.style.color = 'red';
    pairStatus.style.fontSize = '20px';
    pairStatus.style.fontWeight = 'bold';
    pairStatus.style.marginRight = '10px';
    // add pair status to status cell
    statusCell.appendChild(pairStatus);

    // pair button click listener
    pairButton.addEventListener('click', async () => {
      if (thing.type === 'bluetooth') {
        // set webbluetooth options
        const options = {};
        options.acceptAllDevices = true;
        options.optionalServices = optionalServices;

        const device = await requestDevice(thing);
        // change pair status to checkmark
        document.getElementById('pairStatus-' + name).innerHTML = '&#x2714;';
        document.getElementById('pairStatus-' + name).style.color = 'green';

        // In all blocks representing the same device, set the id to device id.
        for (const block1 of blocks) {
          if (block1.firstElementChild.textContent === name) {
            block1.lastElementChild.textContent = device.id;
          }
        }

        // if all devices have been paired, enable done button
        if (allConnectedDesktop_()) {
          document.getElementById('rc-done').disabled = false;
          // add done button click listener
          document
            .getElementById('rc-done')
            .addEventListener('click', () => reconnectDoneHandler_(xml));
        }
      } else if (thing.type === 'hid') {
        const filters = [];

        navigator.hid
          .requestDevice({filters})
          .then(device => {
            if (device.length === 0)
              throwError('Connection failed or cancelled by User.');
            // generate a unique id for the new device
            const uid =
              Date.now().toString(36) + Math.random().toString(36).substring(2);
            // add device to the device map with its uid
            addWebHidDevice(uid, name, device[0], thing);
            // change pair status to checkmark
            document.getElementById('pairStatus-' + name).innerHTML =
              '&#x2714;';
            document.getElementById('pairStatus-' + name).style.color = 'green';

            // set block id to device id in all blocks with same name
            for (const block1 of blocks) {
              if (block1.firstElementChild.textContent === name) {
                block1.lastElementChild.textContent = uid;
              }
            }

            // if all devices have been paired, enable done button
            if (allConnectedDesktop_()) {
              document.getElementById('rc-done').disabled = false;
              // add done button click listener
              document
                .getElementById('rc-done')
                .addEventListener('click', () => reconnectDoneHandler_(xml));
            }
          })
          .catch(error => {
            throwError('Connection failed or cancelled by User.');
            console.error(error);
          });
      }
    });

    pairCell.appendChild(pairButton);

    // add new cells to row and row to table
    row.appendChild(nameCell);
    row.appendChild(pairCell);
    row.appendChild(statusCell);
    tbody.appendChild(row);
    blocksAdded.push(name);

    // add cancel button click listener
    document
      .getElementById('rc-cancel')
      .addEventListener('click', () => reconnectCancelHandler_());
  }
};

/**
 * Adds pair buttons for each web bluetooth block in xml to the mobile reconnect dialog.
 * @param {!NodeList} blocks thing blocks to generate pair buttons for.
 * @param {!Xml} xml xml of the program to load.
 * @param {!Element} xml XML to parse for devices.
 */
const generatePairButtonsMobile_ = function (blocks, xml) {
  // empty list
  const list = document.getElementById('rc-list');
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  //Generates the type (e.g. things_ruuviTag) of all available things.
  for (const thing of implementedThings) {
    thing.block_name = `things_${thing.id}`;
  }
  const blocksAdded = [];

  // add pair button for each device block
  for (const block of blocks) {
    // get user defined name
    const name = block.firstElementChild.textContent;
    // skip if block was already added
    if (blocksAdded.includes(name)) {
      continue;
    }

    // get thing from implementedThings
    const type = block.getAttribute('type');
    const thing = implementedThings.find(t => t.block_name === type);

    // add new list item
    const item = document.createElement('li');
    item.setAttribute('id', 'rc-item-' + name);
    item.setAttribute('class', 'mdc-list-item');
    // add icon to list item
    const icon = document.createElement('span');
    icon.setAttribute('id', 'rc-icon-' + name);
    icon.setAttribute('class', 'mdc-list-item__graphic material-icons');
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML =
      thing.type === 'bluetooth' ? 'bluetooth_disabled' : 'usb_off';
    item.appendChild(icon);
    // add name and status to list item
    const text = document.createElement('span');
    text.setAttribute('class', 'mdc-list-item__text');
    const primaryText = document.createElement('span');
    primaryText.setAttribute('class', 'mdc-list-item__primary-text');
    primaryText.innerHTML = name;
    text.appendChild(primaryText);
    const secondaryText = document.createElement('span');
    secondaryText.setAttribute('class', 'mdc-list-item__secondary-text');
    secondaryText.setAttribute('id', 'rc-status-' + name);
    secondaryText.innerHTML = 'disconnected';
    text.appendChild(secondaryText);
    item.appendChild(text);
    // add click listener to list item
    item.addEventListener('click', async () => {
      if (thing.type === 'bluetooth') {
        // set webbluetooth options
        const options = {};
        options.acceptAllDevices = true;
        options.optionalServices = optionalServices;

        const device = await requestDevice();
        addWebBluetoothDevice(device.id, name);
        // change pair status to connected
        document.getElementById('rc-status-' + name).innerHTML = 'connected';
        // change icon to bluetooth connected
        document.getElementById('rc-icon-' + name).innerHTML = 'bluetooth';
        // change icon color to blue
        document.getElementById('rc-icon-' + name).style.color = '#0d30b1';

        // In all blocks representing the same device, set the id to device id.
        for (const block1 of blocks) {
          if (block1.firstElementChild.textContent === name) {
            block1.lastElementChild.textContent = device.id;
          }
        }

        // if all devices have been paired, enable done button
        if (allConnectedMobile_()) {
          document.getElementById('rc-done').disabled = false;
          // add done button click listener
          document
            .getElementById('rc-done')
            .addEventListener('click', () => reconnectDoneHandler_(xml));
        }
      } else if (type === 'hid') {
        const filters = [];

        navigator.hid
          .requestDevice({filters})
          .then(device => {
            if (device.length === 0)
              throwError('Connection failed or cancelled by User.');
            // generate a unique id for the new device
            const uid =
              Date.now().toString(36) + Math.random().toString(36).substr(2);
            // add device to the device map with its uid
            addWebHidDevice(uid, name, device[0]);
            // change pair status to connected
            document.getElementById('rc-status-' + name).innerHTML =
              'connected';
            // change icon to usb connected
            document.getElementById('rc-icon-' + name).innerHTML = 'usb';
            // change icon color to blue
            document.getElementById('rc-icon-' + name).style.color = '#0d30b1';

            // set block id to device id in all blocks with same name
            for (const block1 of blocks) {
              if (block1.firstElementChild.textContent === name) {
                block1.lastElementChild.textContent = uid;
              }
            }

            // if all devices have been paired, enable done button
            if (allConnectedMobile_()) {
              document.getElementById('rc-done').disabled = false;
              // add done button click listener
              document
                .getElementById('rc-done')
                .addEventListener('click', () => reconnectDoneHandler_(xml));
            }
          })
          .catch(error => {
            throwError('Connection failed or cancelled by User.');
            console.error(error);
          });
      }
    });
    // add list item to list
    list.appendChild(item);
    blocksAdded.push(name);
  }
  // Init material ui list
  window.app.initLists();
};

/**
 * Checks if all devices from the reconnect modal have been paired.
 * @return {boolean} true if all devices have been paired.
 * @private
 */
const allConnectedDesktop_ = function () {
  const blocks = document.getElementById('rc-tbody').querySelectorAll('tr');
  for (const block of blocks) {
    const pairStatus = document.getElementById(
      'pairStatus-' + block.firstElementChild.textContent
    );
    if (pairStatus.innerHTML === '✘') {
      return false;
    }
  }
  return true;
};

/**
 * Checks if all devices from the reconnect modal have been paired.
 * @returns {boolean} true if all devices have been paired.
 */
const allConnectedMobile_ = function () {
  const blocks = document
    .getElementById('rc-list')
    .querySelectorAll('[id=rc-status-]');
  for (const block of blocks) {
    const pairStatus = document.getElementById(
      'rc-status-' + block.textContent
    );
    if (pairStatus.innerHTML === 'disconnected') {
      return false;
    }
  }
  return true;
};

/**
 * Continues loading blocks after reconnecting to web bluetooth devices.
 * @param {!Element} xml XML to load into the workspace.
 * @private
 */
const reconnectDoneHandler_ = function (xml) {
  const workspace = getWorkspace();
  if (window.location.href.includes('mobile')) {
    // hide reconnect dialog
    document.getElementById('rc-dialog').style.display = 'none';
  } else {
    // hide reconnect modal
    document.getElementById('rcModal').style.display = 'none';
  }
  // Clone rc-done button to remove click listener
  const doneButton = document.getElementById('rc-done');
  const doneButtonClone = doneButton.cloneNode(true);
  doneButtonClone.disabled = true;
  doneButton.parentNode.replaceChild(doneButtonClone, doneButton);

  // rebuild workspace from xml
  Xml.domToWorkspace(xml, workspace);
  monitorChanges_(workspace);
};

/**
 * Cancels the reconnect modal.
 */
const reconnectCancelHandler_ = function () {
  // hide reconnect modal
  document.getElementById('rcModal').style.display = 'none';
};

/**
 * Start monitoring the workspace. If a change is made that changes the XML,
 * clear the key from the URL. Stop monitoring the workspace once such a
 * change is detected.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
const monitorChanges_ = function (workspace) {
  const startXmlDom = Xml.workspaceToDom(workspace);
  const startXmlText = Xml.domToText(startXmlDom);
  /**
   * Monitors the workspace for changes to the xml
   */
  function change() {
    const xmlDom = Xml.workspaceToDom(workspace);
    const xmlText = Xml.domToText(xmlDom);
    if (startXmlText !== xmlText) {
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
const generatePath = function () {
  const result = [];
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 12; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join('');
};

window.addEventListener('load', () => {
  // get anchor
  const anchor = window.location.hash;
  if (anchor) {
    // remove the #.
    const path = anchor.substring(1);
    // try loading.
    try {
      retrieveXML_(path);
    } catch (e) {
      throwError('Could not load file.');
      console.error(e);
    }
  }
});
