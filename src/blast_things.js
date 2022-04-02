/**
 * @fileoverview Utility functions for handling things.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {addBlock, reloadToolbox} from './blast_toolbox.js';
import {getWorkspace, throwError} from './blast_interpreter.js';

/**
 * Maps device names to BluetoothDevice.id.
 */
const webBluetoothDevices = new Map();

/**
 * Maps user defined names to webHID identifiers.
 */
const webHidNames = new Map();

/**
 * Maps webHID identifiers to webHID devices.
 */
const webHidDevices = new Map();

let webBluetoothButtonHandler = null;

/**
 * Lists all things implemented by BLAST.
 */
export const implementedThings = [];

/**
 * Lists all things connected to BLAST identified by their user defined name.
 */
export const connectedThings = new Map();

/**
 * Sets the 'pair via webBluetooth' button handler.
 * @param {function} handler The handler to set.
 */
export const setWebBluetoothButtonHandler = function (handler) {
  webBluetoothButtonHandler = handler;
};

let webHidButtonHandler = null;

let getRssiBlockadded = false;

/**
 * Sets the 'connect via webHid' button handler.
 * @param {function} handler The handler to set.
 */
export const setWebHidButtonHandler = function (handler) {
  webHidButtonHandler = handler;
};

/**
 * Default method for logging device interaction.
 * @param {string} message The message to log.
 * @param {string=} adapter The name of the adapter that generated the message.
 * @param {string=} device The name of the device that generated the message.
 */
let thingsLog = function (message, adapter, device) {
  console.log({adapter}, {device}, message);
};

/**
 * Getter for the thingsLog function.
 * @return {function} The thingsLog function.
 */
export const getThingsLog = function () {
  return thingsLog;
};

/**
 * Setter for the thingsLog function.
 * @param {Function} logFunc The function to use for logging.
 */
export const setThingsLog = function (logFunc) {
  thingsLog = logFunc;
};

/**
 * Resets all device maps.
 */
export const resetThings = function () {
  webBluetoothDevices.clear();
  webHidNames.clear();
  webHidDevices.clear();
};

/**
 * Gets the webHID device with the given uid.
 * @param {string} deviceId The uid of the webHID device.
 * @returns {HIDDevice} The webHID device with the given uid.
 */
export const getWebHidDevice = function (deviceId) {
  return webHidDevices.get(deviceId);
};

/**
 * Construct the elements (blocks and buttons) required by the flyout for the
 * things category.
 * @param {!Blockly.Workspace} workspace The workspace containing things.
 * @return {!Array.<!Element>} Array of XML elements.
 */
export const thingsFlyoutCategory = function (workspace) {
  let xmlList = [];
  // get connected things
  const connectedThingBlocks = flyoutCategoryBlocks();

  // Create WebBluetooth Label
  const webBluetoothLabel = document.createElement('label');
  webBluetoothLabel.setAttribute('text', 'WebBluetooth Blocks');
  xmlList.push(webBluetoothLabel);

  // Create WebBluetooth add device button
  const webBluetoothButton = document.createElement('button');
  webBluetoothButton.setAttribute('text', 'pair via webBluetooth');
  webBluetoothButton.setAttribute('callbackKey', 'CREATE_WEBBLUETOOTH');
  // eslint-disable-next-line no-unused-vars
  workspace.registerButtonCallback('CREATE_WEBBLUETOOTH', _button => {
    webBluetoothButtonHandler();
  });
  xmlList.push(webBluetoothButton);
  // Add connected blocks for connected blueooth devices
  if (connectedThingBlocks.bluetooth.length > 0) {
    xmlList = xmlList.concat(connectedThingBlocks.bluetooth);
  }

  // Create WebBluetooth Label
  const webHIDLabel = document.createElement('label');
  webHIDLabel.setAttribute('text', 'WebHID Blocks');
  xmlList.push(webHIDLabel);

  // Create WebHID add device button
  const webHidbutton = document.createElement('button');
  webHidbutton.setAttribute('text', 'connect via webHID');
  webHidbutton.setAttribute('callbackKey', 'CREATE_WEBHID');
  // eslint-disable-next-line no-unused-vars
  workspace.registerButtonCallback('CREATE_WEBHID', _button => {
    webHidButtonHandler();
  });
  xmlList.push(webHidbutton);
  // Add connected blocks for connected webHID devices
  if (connectedThingBlocks.hid.length > 0) {
    xmlList = xmlList.concat(connectedThingBlocks.hid);
  }

  // Create identifiers label
  const identifiersLabel = document.createElement('label');
  identifiersLabel.setAttribute('text', 'additional identifiers');
  xmlList.push(identifiersLabel);

  // add uri block to xmlList
  let block = Blockly.utils.xml.createElement('block');
  block.setAttribute('type', 'uri');
  xmlList.push(block);

  // add uri_from_string block to xmlList
  block = Blockly.utils.xml.createElement('block');
  block.setAttribute('type', 'uri_from_string');
  xmlList.push(block);

  // create audio uris label
  const audioLabel = document.createElement('label');
  audioLabel.setAttribute('text', 'example audio URIs');
  xmlList.push(audioLabel);

  // add audio uri blocks to xmlList
  const audioURIs = [
    'https://studio.code.org/blockly/media/skins/dance/win.mp3',
    'https://studio.code.org/blockly/media/click.mp3',
    'https://upload.wikimedia.org/wikipedia/commons/2/25/243020_plasterbrain_game-start.ogg',
    'https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.ogg',
  ];
  for (const audioURI of audioURIs) {
    const block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'uri');
    const field = Blockly.utils.xml.createElement('field');
    field.setAttribute('name', 'URI');
    field.textContent = audioURI;
    block.appendChild(field);
    xmlList.push(block);
  }

  return xmlList;
};

/**
 * Construct the webBluetooth blocks required by the flyout for the things category.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
const flyoutCategoryBlocks = function () {
  const xmlList = {bluetooth: [], hid: []};

  // add webHID devices to xmlList
  if (connectedThings.size > 0) {
    for (const [key, thing] of connectedThings) {
      if (thing.type === 'bluetooth' && !getRssiBlockadded) {
        addBlock('get_signal_strength_wb', 'Properties');
        getRssiBlockadded = true;
      }
      const id = thing.id;
      const block = Blockly.utils.xml.createElement('block');
      block.setAttribute('type', 'things_' + id);
      const fieldName = Blockly.utils.xml.createElement('field');
      fieldName.setAttribute('name', 'name');
      fieldName.textContent = key;
      block.appendChild(fieldName);
      const idField = Blockly.utils.xml.createElement('field');
      idField.setAttribute('name', 'id');
      if (thing.type === 'bluetooth') {
        idField.textContent = webBluetoothDevices.get(key);
      } else if (thing.type === 'hid') {
        idField.textContent = webHidNames.get(key);
      }
      block.appendChild(idField);
      block.setAttribute('gap', 8);
      xmlList[thing.type].push(block);
    }
  }
  return xmlList;
};

/**
 * Returns an Array containing tuples of device names and their identifier.
 * @returns {Array.<string, string>} Array containing tuples of device names and their identifier.
 * @example [['beacon', 'm+JZZGVo+aDUb0a4NOpQWw==']]
 */
export const getWebBluetoothDevices = function () {
  const keysArray = [...webBluetoothDevices.keys()];
  const keysSorted = keysArray.sort();

  // if no devices connected, return empty array
  if (keysSorted.legnth === 0) return [];

  // build options array
  const options = [];
  for (const deviceName of keysSorted) {
    const deviceId = webBluetoothDevices.get(deviceName);
    options.push([deviceName, deviceId]);
  }

  return options;
};

/**
 * Returns an Array containing tuples of device names and their identifier.
 * @returns {Array.<string, string>} Array containing tuples of device names and their identifier.
 * @example [['beacon', 'm+JZZGVo+aDUb0a4NOpQWw==']]
 */
export const getWebHIDDevices = function () {
  const keysArray = [...webHidNames.keys()];
  const keysSorted = keysArray.sort();

  // if no devices connected, return empty array
  if (keysSorted.legnth === 0) return [];

  // build options array
  const options = [];
  for (const deviceName of keysSorted) {
    const deviceId = webHidNames.get(deviceName);
    options.push([deviceName, deviceId]);
  }

  return options;
};

/**
 * Adds a WebBluetooth device to the {@link webBluetoothDevices} map.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {string} deviceName User defined name for the device.
 * @param thing information about the device to pair.
 * @return {string} The device name.
 */
export const addWebBluetoothDevice = function (
  webBluetoothId,
  deviceName,
  thing
) {
  // This function needs to be named so it can be called recursively.
  const promptAndCheckWithAlert = function (name, id) {
    Blockly.Variables.promptName(
      'Pair successful! Now give your device a name.',
      name,
      text => {
        if (text) {
          const existing = webBluetoothDevices.has(text);
          if (existing) {
            const msg = 'Name %1 already exists'.replace('%1', text);
            Blockly.dialog.alert(msg, () => {
              promptAndCheckWithAlert(text, id); // Recurse
            });
          } else {
            // No conflict
            webBluetoothDevices.set(text, id);
            connectedThings.set(text, thing);
            // add the devices blocks to the toolbox
            for (const block of thing.blocks) {
              if (block.XML) {
                addBlock(block.type, block.category, block.XML);
              } else {
                addBlock(block.type, block.category);
              }
            }
            reloadToolbox();
          }
        } else {
          const msg = 'Name cannot be empty';
          Blockly.dialog.alert(msg, () => {
            promptAndCheckWithAlert(text, id); // Recuse
          });
        }
      }
    );
  };
  return promptAndCheckWithAlert(deviceName, webBluetoothId);
};

/**
 * Connects a WebHidDevice.
 * @param thing information about the device to pair.
 * @returns {Promise<HIDDevice>} A promise that resolves to the connected WebHidDevice.
 */
export const connectWebHidDevice = async function (thing) {
  const workspace = getWorkspace();
  thingsLog('Requesting webHID device...', 'HID');
  let filters = [];
  if (thing.filters) {
    filters = thing.filters;
  }
  const device = await navigator.hid.requestDevice({filters: filters});
  if (device.length === 0) {
    throwError('Connection failed or cancelled by User.');
    return;
  }
  // generate a unique id for the new device
  const uid = Date.now().toString(36) + Math.random().toString(36).substring(2);
  // add device to the device map with its uid
  addWebHidDevice(uid, device[0].productName, device[0], thing);
  workspace.refreshToolboxSelection();
  thingsLog('Connected', 'HID', device[0].productName);
  return device;
};

/**
 * Creates user defined identifier to get devices from {@link webHidDevices}.
 * @param {string} uid identifier of the device in {@link webHidDevices}.
 * @param {string} deviceName default name for the device.
 * @param {HIDDevice} device the device to add.
 * @param thing information about the device to pair.
 */
export const addWebHidDevice = function (uid, deviceName, device, thing) {
  // This function needs to be named so it can be called recursively.
  const promptAndCheckWithAlert = function (name, id) {
    Blockly.Variables.promptName(
      'Connection established! Now give your device a name.',
      name,
      text => {
        if (text) {
          const existing = webHidNames.has(text);
          if (existing) {
            const msg = 'Name %1 already exists'.replace('%1', text);
            Blockly.dialog.alert(msg, () => {
              promptAndCheckWithAlert(text, id); // Recurse
            });
          } else {
            // No conflict
            webHidDevices.set(id, device);
            webHidNames.set(text, id);
            connectedThings.set(text, thing);
            // add the devices blocks to the toolbox
            for (const block of thing.blocks) {
              if (block.XML) {
                addBlock(block.type, block.category, block.XML);
              } else {
                addBlock(block.type, block.category);
              }
            }
            reloadToolbox();
          }
        } else {
          const msg = 'Name cannot be empty';
          Blockly.dialog.alert(msg, () => {
            promptAndCheckWithAlert(text, id); // Recuse
          });
        }
      }
    );
  };
  promptAndCheckWithAlert(deviceName, uid);
};
