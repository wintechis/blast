/**
 * @fileoverview Utility functions for handling things.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/**
 * Namespace for things Utility functions.
 * @name Blast.Things
 * @namespace
 * @public
 */
goog.provide('Blast.Things');

/**
 * Maps device names to BluetoothDevice.id.
 */
Blast.Things.webBluetoothDevices = new Map();

/**
 * Maps user defined names to webHID identifiers.
 */
Blast.Things.webHidNames = new Map();

/**
 * Maps webHID identifiers to webHID devices.
 */
Blast.Things.webHidDevices = new Map();

/**
 * Construct the elements (blocks and buttons) required by the flyout for the
 * variable category.
 * @param {!Blockly.Workspace} workspace The workspace containing things.
 * @return {!Array.<!Element>} Array of XML elements.
 */
Blast.Things.flyoutCategory = function(workspace) {
  let xmlList = [];

  // Create WebBluetooth Label
  const webBluetoothLabel = document.createElement('label');
  webBluetoothLabel.setAttribute('text', 'WebBluetooth Blocks');
  xmlList.push(webBluetoothLabel);

  // Create WebBluetooth add device button
  const webBluetoothButton = document.createElement('button');
  webBluetoothButton.setAttribute('text', 'connect via webBluetooth');
  webBluetoothButton.setAttribute('callbackKey', 'CREATE_WEBBLUETOOTH');
  workspace.registerButtonCallback('CREATE_WEBBLUETOOTH', function(_button) {
    Blast.Things.createWebBluetoothButtonHandler();
  });
  xmlList.push(webBluetoothButton);

  
  // add webBluetooth blocks to xmlList
  const wbBlockList = Blast.Things.flyoutCategoryBlocksWB(workspace);
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
    Blast.Things.createWebHidButtonHandler();
  });
  xmlList.push(webHidbutton);

  // add webHID blocks to xmlList
  const wHidBlockList = Blast.Things.flyoutCategoryBlocksWHid(workspace);
  xmlList = xmlList.concat(wHidBlockList);
  
  return xmlList;
};


/**
 * Construct the webBluetooth blocks required by the flyout for the things category.
 * @param {!Blockly.Workspace} workspace The workspace containing things.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blast.Things.flyoutCategoryBlocksWHid = function() {
  const xmlList = [];

  // add webHID devices to xmlList
  if (Blast.Things.webHidDevices.size > 0) {
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
 * @param {!Blockly.Workspace} workspace The workspace containing things.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blast.Things.flyoutCategoryBlocksWB = function() {
  const xmlList = [];

  // add webBluetooth devices to xmlList
  if (Blast.Things.webBluetoothDevices.size > 0) {
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
Blast.Things.getWebBluetoothDevices = function() {
  const keysArray = [...Blast.Things.webBluetoothDevices.keys()];
  const keysSorted = keysArray.sort();

  // if no devices connected, return empty array
  if (keysSorted.legnth === 0) return [];

  // build options array
  const options = [];
  for (const deviceName of keysSorted) {
    const deviceId = Blast.Things.webBluetoothDevices.get(deviceName);
    options.push([deviceName, deviceId]);
  }

  return options;
};

/**
 * Returns an Array containing tuples of device names and their identifier.
 * @returns {Array.<string, string>} Array containing tuples of device names and their identifier.
 * @example [['beacon', 'm+JZZGVo+aDUb0a4NOpQWw==']]
 */
Blast.Things.getWebHIDDevices = function() {
  const keysArray = [...Blast.Things.webHidNames.keys()];
  const keysSorted = keysArray.sort();

  // if no devices connected, return empty array
  if (keysSorted.legnth === 0) return [];

  // build options array
  const options = [];
  for (const deviceName of keysSorted) {
    const deviceId = Blast.Things.webHidNames.get(deviceName);
    options.push([deviceName, deviceId]);
  }

  return options;
};

/**
 * Handles "connect via webBluetooth" button in the things toolbox category.
 * It will open the webBluetooth connect prompt, and upon successfull connection,
 * prompt the user for a name, including re-prompts if a name
 * is already in use among the workspace's things.
 *
 * @param {!Blockly.Workspace} workspace The workspace on which to create the variable.
 */
Blast.Things.createWebBluetoothButtonHandler = function() {
  // open the webBluetooth modal
  wbModal.style.display = 'block';
};

/**
 * Adds a WebBluetooth device to the {@link Blast.Things.webBluetoothDevices} map.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {string} deviceName User defined name for the device.
 */
Blast.Things.addWebBluetoothDevice = function(webBluetoothId, deviceName) {
  // This function needs to be named so it can be called recursively.
  const promptAndCheckWithAlert = function(name, id) {
    Blockly.Variables.promptName('Pair successful! Now give your device a name.', name,
        function(text) {
          if (text) {
            const existing =
                  Blast.Things.webBluetoothDevices.has(text);
            if (existing) {
              const msg = 'Name %1 already exists'.replace(
                  '%1', existing.name);
              Blockly.alert(msg,
                  function() {
                    promptAndCheckWithAlert(text);  // Recurse
                  });
            } else {
              // No conflict
              Blast.Things.webBluetoothDevices.set(text, id);
            }
          } else {
            const msg = 'Name cannot be empty';
            Blockly.alert(msg, function() {
              promptAndCheckWithAlert(text, id); // Recuse
            });
          }
        });
  };
  promptAndCheckWithAlert(deviceName, webBluetoothId);
};


/**
 * Handles "connect via webHID" button in the things toolbox category.
 * It will open the webHID connect prompt, and upon successfull connection,
 * prompt the user for a name, including re-prompts if a name
 * is already in use among the workspace's things.
 *
 * @param {!Blockly.Workspace} workspace The workspace on which to create the variable.
 */
Blast.Things.createWebHidButtonHandler = function() {
  // open the webBluetooth modal
  wHidModal.style.display = 'block';
};

/**
 * Creates user defined identifier to get devices from {@link Blast.Things.webHidDevices}.
 * @param {strubg} id identifier of the device in {@link Blast.Things.webHidDevices}.
 * @param {string} deviceName default name for the device.
 */
Blast.Things.addWebHidDevice = function(id, deviceName) {
  // This function needs to be named so it can be called recursively.
  const promptAndCheckWithAlert = function(name, id) {
    Blockly.Variables.promptName('Connection established! Now give your device a name.', name,
        function(text) {
          if (text) {
            const existing =
                  Blast.Things.webHidNames.has(text);
            if (existing) {
              const msg = 'Name %1 already exists'.replace(
                  '%1', existing.name);
              Blockly.alert(msg,
                  function() {
                    promptAndCheckWithAlert(text);  // Recurse
                  });
            } else {
              // No conflict
              Blast.Things.webHidNames.set(text, id);
            }
          } else {
            const msg = 'Name cannot be empty';
            Blockly.alert(msg, function() {
              promptAndCheckWithAlert(text, id); // Recuse
            });
          }
        });
  };
  promptAndCheckWithAlert(deviceName, id);
};
