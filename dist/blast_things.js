/**
 * @fileoverview Utility functions for handling things.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {throwError} from './blast_interpreter.js';
import {getWorkspace} from './blast_interpreter.js';


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
export const setWebBluetoothButtonHandler = function(handler) {
  webBluetoothButtonHandler = handler;
};

/**
 * Default method for logging device interaction.
 * @param {string} message The message to log.
 * @param {string=} adapter The name of the adapter that generated the message.
 * @param {string=} device The name of the device that generated the message.
 */
let thingsLog = function(message, adapter, device) {
  console.log({adapter}, {device}, message);
};
/**
 * Getter for the thingsLog function.
 * @return {Function} The thingsLog function.
 */
export const getThingsLog = function() {
  return thingsLog;
};
/**
 * Setter for the thingsLog function.
 * @param {Function} logFunc The function to use for logging.
 */
export const setThingsLog = function(logFunc) {
  thingsLog = logFunc;
};


/**
 * Resets all device maps.
 */
export const resetThings = function() {
  webBluetoothDevices.clear();
  webHidNames.clear();
  webHidDevices.clear();
};

export const getWebHidDevice = function(deviceId) {
  return webHidDevices.get(deviceId);
};

/**
 * Construct the elements (blocks and buttons) required by the flyout for the
 * things category.
 * @param {!Blockly.Workspace} workspace The workspace containing things.
 * @return {!Array.<!Element>} Array of XML elements.
 */
export const thingsFlyoutCategory = function(workspace) {
  let xmlList = [];

  // Create WebBluetooth Label
  const webBluetoothLabel = document.createElement('label');
  webBluetoothLabel.setAttribute('text', 'WebBluetooth Blocks');
  xmlList.push(webBluetoothLabel);

  // Create WebBluetooth add device button
  const webBluetoothButton = document.createElement('button');
  webBluetoothButton.setAttribute('text', 'pair via webBluetooth');
  webBluetoothButton.setAttribute('callbackKey', 'CREATE_WEBBLUETOOTH');
  workspace.registerButtonCallback('CREATE_WEBBLUETOOTH', function(_button) {
    webBluetoothButtonHandler();
  });
  xmlList.push(webBluetoothButton);

  
  // add webBluetooth blocks to xmlList
  const wbBlockList = flyoutCategoryBlocksWB(workspace);
  xmlList = xmlList.concat(wbBlockList);
  
  // Create WebBluetooth Label
  const webHIDLabel = document.createElement('label');
  webHIDLabel.setAttribute('text', 'WebHID Blocks');
  xmlList.push(webHIDLabel);

  // Create WebBluetooth add device button
  const webHidbutton = document.createElement('button');
  webHidbutton.setAttribute('text', 'connect via webHID');
  webHidbutton.setAttribute('callbackKey', 'CREATE_WEBHID');
  workspace.registerButtonCallback('CREATE_WEBHID', function(_button) {
    createWebHidButtonHandler();
  });
  xmlList.push(webHidbutton);

  // add webHID blocks to xmlList
  const wHidBlockList = flyoutCategoryBlocksWHid(workspace);
  xmlList = xmlList.concat(wHidBlockList);

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

  // temporarily comment out unused mac block, see #69
  // block = Blockly.utils.xml.createElement('block');
  // block.setAttribute('type', 'mac');
  // xmlList.push(block);

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
const flyoutCategoryBlocksWHid = function() {
  const xmlList = [];

  // add webHID devices to xmlList
  if (webHidDevices.size > 0) {
    if (Blockly.Blocks['things_webHID']) {
      const block = Blockly.utils.xml.createElement('block');
      block.setAttribute('type', 'things_webHID');
      block.setAttribute('gap', 8);
      xmlList.push(block);
    }
  }

  return xmlList;
};

/**
 * Construct the webHIDh blocks required by the flyout for the things category.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
const flyoutCategoryBlocksWB = function() {
  const xmlList = [];

  // add webBluetooth devices to xmlList
  if (webBluetoothDevices.size > 0) {
    if (Blockly.Blocks['things_webBluetooth']) {
      const block = Blockly.utils.xml.createElement('block');
      block.setAttribute('type', 'things_webBluetooth');
      block.setAttribute('gap', 8);
      xmlList.push(block);
    }
  }

  return xmlList;
};

/**
 * Returns an Array containing tuples of device names and their identifier.
 * @returns {Array.<string, string>} Array containing tuples of device names and their identifier.
 * @example [['beacon', 'm+JZZGVo+aDUb0a4NOpQWw==']]
 */
export const getWebBluetoothDevices = function() {
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
export const getWebHIDDevices = function() {
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
 */
export const addWebBluetoothDevice = function(webBluetoothId, deviceName) {
  // This function needs to be named so it can be called recursively.
  const promptAndCheckWithAlert = function(name, id) {
    Blockly.Variables.promptName('Pair successful! Now give your device a name.', name,
        function(text) {
          if (text) {
            const existing =
                  webBluetoothDevices.has(text);
            if (existing) {
              const msg = 'Name %1 already exists'.replace(
                  '%1', text);
              Blockly.dialog.alert(msg,
                  function() {
                    promptAndCheckWithAlert(text, id);  // Recurse
                  });
            } else {
              // No conflict
              webBluetoothDevices.set(text, id);
            }
          } else {
            const msg = 'Name cannot be empty';
            Blockly.dialog.alert(msg, function() {
              promptAndCheckWithAlert(text, id); // Recuse
            });
          }
        });
  };
  promptAndCheckWithAlert(deviceName, webBluetoothId);
};


/**
 * Handles "connect via webHID" button in the things toolbox category.
 */
const createWebHidButtonHandler = function() {
  const workspace = getWorkspace();
  thingsLog('Requesting webHID device...', 'HID');
  navigator.hid.requestDevice({filters: []})
      .then((device) => {
        if (device.length === 0) {
          throwError('Connection failed or cancelled by User.');
          return;
        }
        // generate a unique id for the new device
        const uid = Date.now().toString(36) + Math.random().toString(36).substring(2);
        // add device to the device map with its uid
        addWebHidDevice(uid, device[0].productName, device[0]);
        workspace.refreshToolboxSelection();
        thingsLog('Connected', 'HID', device[0].productName);
      })
      .catch((error) => {
        throwError(error);
      });
};

/**
 * Creates user defined identifier to get devices from {@link webHidDevices}.
 * @param {strubg} uid identifier of the device in {@link webHidDevices}.
 * @param {string} deviceName default name for the device.
 * @param {HIDDevice} device the device to add.
 */
export const addWebHidDevice = function(uid, deviceName, device) {
  // This function needs to be named so it can be called recursively.
  const promptAndCheckWithAlert = function(name, id) {
    Blockly.Variables.promptName('Connection established! Now give your device a name.', name,
        function(text) {
          if (text) {
            const existing =
                  webHidNames.has(text);
            if (existing) {
              const msg = 'Name %1 already exists'.replace(
                  '%1', text);
              Blockly.dialog.alert(msg,
                  function() {
                    promptAndCheckWithAlert(text, id);  // Recurse
                  });
            } else {
              // No conflict
              webHidDevices.set(id, device);
              webHidNames.set(text, id);
            }
          } else {
            const msg = 'Name cannot be empty';
            Blockly.dialog.alert(msg, function() {
              promptAndCheckWithAlert(text, id); // Recuse
            });
          }
        });
  };
  promptAndCheckWithAlert(deviceName, uid);
};
