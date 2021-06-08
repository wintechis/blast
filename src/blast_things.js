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
 * Construct the elements (blocks and buttons) required by the flyout for the
 * variable category.
 * @param {!Blockly.Workspace} workspace The workspace containing things.
 * @return {!Array.<!Element>} Array of XML elements.
 */
Blast.Things.flyoutCategory = function(workspace) {
  let xmlList = [];

  const webBluetoothLabel = document.createElement('label');
  webBluetoothLabel.setAttribute('text', 'WebBluetooth');
  xmlList.push(webBluetoothLabel);

  const button = document.createElement('button');
  button.setAttribute('text', 'connect via webBluetooth');
  button.setAttribute('callbackKey', 'CREATE_WEBBLUETOOTH');
  workspace.registerButtonCallback('CREATE_WEBBLUETOOTH', function(_button) {
    Blast.Things.createWebBluetoothButtonHandler();
  });
  xmlList.push(button);
  
  const blockList = Blast.Things.flyoutCategoryBlocks(workspace);
  xmlList = xmlList.concat(blockList);
  return xmlList;
};


/**
 * Construct the blocks required by the flyout for the things category.
 * @param {!Blockly.Workspace} workspace The workspace containing things.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blast.Things.flyoutCategoryBlocks = function() {
  console.log(Blast.Things.webBluetoothDevices.size);
  
  const xmlList = [];
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
  if (keysSorted.legnth === 0) return [];
  const options = [];

  for (const deviceName of keysSorted) {
    const deviceId = Blast.Things.webBluetoothDevices.get(deviceName);
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
 * @param {BluetoothDevice.name} deviceName User defined name for the device.
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
          }
        });
  };
  promptAndCheckWithAlert(deviceName, webBluetoothId);
};
