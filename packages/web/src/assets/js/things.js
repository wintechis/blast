/**
 * @fileoverview Utility functions for handling things.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
import {
  addBlock,
  addCategoryAt,
  reloadToolbox,
  removeBlock,
  removeCategory,
} from './toolbox.js';
import {getWorkspace} from './interpreter.ts';
import {
  generateThingBlock,
  generateThingCode,
  generateReadPropertyBlock,
  generateReadPropertyCode,
  generateWritePropertyBlock,
  generateWritePropertyCode,
  generateInvokeActionBlock,
  generateInvokeActionCode,
  generateSubscribeEventBlock,
  generateSubscribeEventCode,
  generateSecurityBlock,
  generateSecurityCode,
  crawl,
} from './automatedBlockGeneration.js';

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

/**
 * Maps audio device labels to audio device ids.
 */
const audioDevices = new Map();

/**
 * Maps video device labels to video device ids.
 */
const videoDevices = new Map();

/**
 * Maps consumed web device labels to video device ids.
 */
const consumedWebDevices = new Map();

/**
 * Map of consumed devices.
 */
export const consumedThingInstances = new Map();

/**
 * Lists all things implemented by BLAST.
 */
export const implementedThings = [];

/**
 * Lists all things connected to BLAST identified by their user defined name.
 */
export const connectedThings = new Map();

/**
 * Lists all blocks exclusively available in dev mode, as tuples of [blockName, category].
 * @type {!Array.<!Array<string>>}
 */
export const devBlocks = [];

/**
 * Lists all categories exclusively available in dev mode, as triples of [categoryName, colour, index].
 * @type {!Array.<!Array<string>>}
 */
export const devCategories = [];

/**
 * Wether development mode is turned on or off.
 */
let devMode = false;
export const setDevMode = function (value) {
  if (value === true) {
    // add all thing blocks to the toolbox
    for (const thing of implementedThings) {
      for (const block of thing.blocks) {
        addBlock(block.type, block.category);
      }
    }
    // add all dev block categories to the toolbox
    for (const category of devCategories) {
      addCategoryAt(category[0], category[1], category[2]);
    }
    // add all dev blocks to the toolbox
    for (const block of devBlocks) {
      addBlock(block[0], block[1]);
    }
  } else {
    // remove all thing blocks from the toolbox
    for (const thing of implementedThings) {
      for (const block of thing.blocks) {
        removeBlock(block.type, block.category);
      }
    }
    // remove all dev blocks from the toolbox
    for (const block of devBlocks) {
      removeBlock(block[0], block[1]);
    }
    // remove all dev block categories from the toolbox
    for (const category of devCategories) {
      removeCategory(category[0]);
    }

    // empty workspace
    getWorkspace().clear();

    resetThings();
  }
  devMode = value;
  reloadToolbox();
};
export const getDevMode = function () {
  return devMode;
};

let webBluetoothButtonHandler = null;
/**
 * Sets the 'pair via webBluetooth' button handler.
 * @param {function} handler The handler to set.
 */
export const setWebBluetoothButtonHandler = function (handler) {
  webBluetoothButtonHandler = handler;
};

let webHidButtonHandler = null;
/**
 * Sets the 'connect via webHid' button handler.
 * @param {function} handler The handler to set.
 */
export const setWebHidButtonHandler = function (handler) {
  webHidButtonHandler = handler;
};

let audioSelectButtonHandler = null;
/**
 * Sets the 'select audio output' button handler.
 * @param {function} handler The handler to set.
 */
export const setAudioSelectButtonHandler = function (handler) {
  audioSelectButtonHandler = handler;
};

let videoSelectButtonHandler = null;
/**
 * Sets the 'select video input' button handler.
 * @param {function} handler The handler to set.
 */
export const setVideoSelectButtonHandler = function (handler) {
  videoSelectButtonHandler = handler;
};

let consumeThingButtonHandler = null;
/**
 * Sets the 'select video input' button handler.
 * @param {function} handler The handler to set.
 */
export const setConsumeThingButtonHandler = function (handler) {
  consumeThingButtonHandler = handler;
};

let getRssiBlockadded = false;

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
  connectedThings.clear();
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
  const xmlList = [];

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
  workspace.registerButtonCallback('CREATE_WEBBLUETOOTH', _button => {
    webBluetoothButtonHandler();
  });
  xmlList.push(webBluetoothButton);
  // Add connected blocks for connected blueooth devices
  if (connectedThingBlocks.bluetooth.length > 0) {
    xmlList.push(...connectedThingBlocks.bluetooth);
  }

  // Create WebBluetooth Label
  const webHIDLabel = document.createElement('label');
  webHIDLabel.setAttribute('text', 'WebHID Blocks');
  xmlList.push(webHIDLabel);

  // Create WebHID add device button
  const webHidbutton = document.createElement('button');
  webHidbutton.setAttribute('text', 'connect via webHID');
  webHidbutton.setAttribute('callbackKey', 'CREATE_WEBHID');
  workspace.registerButtonCallback('CREATE_WEBHID', _button => {
    webHidButtonHandler();
  });
  xmlList.push(webHidbutton);
  // Add connected blocks for connected webHID devices
  if (connectedThingBlocks.hid.length > 0) {
    xmlList.push(...connectedThingBlocks.hid);
  }

  // Create Audio Label
  const audioLabel = document.createElement('label');
  audioLabel.setAttribute('text', 'Audio Output Devices');
  xmlList.push(audioLabel);

  // Create Audio add device button
  const audioButton = document.createElement('button');
  audioButton.setAttribute('text', 'add audio output');
  audioButton.setAttribute('callbackKey', 'CREATE_AUDIO');
  workspace.registerButtonCallback('CREATE_AUDIO', _button => {
    audioSelectButtonHandler();
  });
  xmlList.push(audioButton);

  // Add connected blocks for connected audio devices
  if (connectedThingBlocks.audio.length > 0) {
    xmlList.push(...connectedThingBlocks.audio);
  }

  // Create Video Label
  const videoLabel = document.createElement('label');
  videoLabel.setAttribute('text', 'Video Input Devices');
  xmlList.push(videoLabel);

  // Create Video add device button
  const videoButton = document.createElement('button');
  videoButton.setAttribute('text', 'add video input');
  videoButton.setAttribute('callbackKey', 'CREATE_VIDEO');
  workspace.registerButtonCallback('CREATE_VIDEO', _button => {
    videoSelectButtonHandler();
  });
  xmlList.push(videoButton);

  // Add connected blocks for connected video devices
  if (connectedThingBlocks.video.length > 0) {
    console.log(...connectedThingBlocks.video);
    xmlList.push(...connectedThingBlocks.video);
  }

  // Create Consume Thing Label
  const consumeThingLabel = document.createElement('label');
  consumeThingLabel.setAttribute('text', 'Consume Thing Description');
  xmlList.push(consumeThingLabel);

  // Create Consume Thing button
  const consumeThingButton = document.createElement('button');
  consumeThingButton.setAttribute('text', 'consume Thing');
  consumeThingButton.setAttribute('callbackKey', 'CONSUME_THING');
  workspace.registerButtonCallback('CONSUME_THING', _button => {
    consumeThingButtonHandler();
  });
  xmlList.push(consumeThingButton);

  // Add connected blocks for connected consumed devices
  if (connectedThingBlocks.consumedDevice.length > 0) {
    console.log(...connectedThingBlocks.consumedDevice);
    xmlList.push(...connectedThingBlocks.consumedDevice);
  }

  return xmlList;
};

/**
 * Construct the webBluetooth blocks required by the flyout for the things category.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
const flyoutCategoryBlocks = function () {
  const xmlList = {
    bluetooth: [],
    hid: [],
    audio: [],
    video: [],
    consumedDevice: [],
  };
  // add connected things to xmlList
  if (connectedThings.size > 0) {
    for (const [key, thing] of connectedThings) {
      if (thing.type === 'bluetooth' && !getRssiBlockadded) {
        addBlock('bluetoothGeneric_get_signal_strength_wb', 'Properties');
        getRssiBlockadded = true;
        reloadToolbox();
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
      } else if (thing.type === 'audio') {
        idField.textContent = audioDevices.get(key);
      } else if (thing.type === 'video') {
        idField.textContent = videoDevices.get(key);
      } else if (thing.type === 'consumedDevice') {
        idField.textContent = consumedWebDevices.get(key);
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
  if (keysSorted.legnth === 0) {
    return [];
  }

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
  if (keysSorted.legnth === 0) {
    return [];
  }

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
    console.error('Connection failed or cancelled by User.');
    return;
  }
  // generate a unique id for the new device
  const uid = Date.now().toString(36) + Math.random().toString(36).substring(2);
  // add device to the device map with its uid
  addWebHidDevice(uid, device[0].productName, device[0], thing);
  workspace.refreshToolboxSelection();
  thingsLog('Connected', 'HID', device[0].productName);
  device.id = uid;
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

export const handleAddConsumedThing = async function (uri) {
  // TODO: Check if URI is valid

  // Crawl all referenced Thing Description links
  const foundTDs = await crawl(uri);

  for (const td of foundTDs) {
    // generate a unique id for the new device
    const uid =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    // TODO: Check if ID is already used ??

    // Set new ID
    td.id = uid;

    addDevice(
      td.title,
      td.id, // default ID
      'consumedDevice',
      td
    );
  }
};

/**
 * Adds a device to BLAST.
 * @param {string} deviceName Name of the device.
 * @param {string} deviceId Unique identifier of the device.
 */
export const addDevice = function (deviceName, deviceId, type, td) {
  let thing;
  if (type === 'consumedDevice') {
    // generate a unique id for the new device

    // Object to store property names and allowed ops
    const propertiesObj = {};
    // Object to store action names and allowed ops
    const actionsObj = {};
    // Store all inputs of actions
    const inputObj = {};
    // Store all outputs of actions
    const outputObj = {};
    // Object to store event names and allowed ops
    const eventObj = {};
    // Store "data" of events
    const dataObj = {};

    // List of all created Blocks
    const implementedThingsBlockList = [];

    // Generate Thing Block
    if (typeof td.description === 'undefined') {
      generateThingBlock(deviceName, deviceName, td);
    } else {
      generateThingBlock(deviceName, td.description, td);
    }
    generateThingCode(deviceName);

    // Supported is only none_sc and basic_sc
    if (td.security === 'basic_sc') {
      generateSecurityBlock();
      generateSecurityCode(td);

      // Add to implementedThingsBlockList
      implementedThingsBlockList.push({
        type: `${deviceName}_SecurityBlock`,
        category: 'Security',
      });
    }
    // get property names and allowed operations
    for (const [propertyName, property] of Object.entries(
      td.properties ?? {}
    )) {
      propertiesObj[propertyName] = property.forms.map(form => form.op);
    }

    // Generate Property Blocks
    for (const [propertyName, operations] of Object.entries(propertiesObj)) {
      const op = new Set(operations.flat());

      if (op.has('readproperty')) {
        generateReadPropertyBlock(propertyName, deviceName, td);
        generateReadPropertyCode(propertyName, deviceName);

        // Add to implementedThingsBlockList
        implementedThingsBlockList.push({
          type: `${deviceName}_readPropertyBlock_${propertyName}`,
          category: 'Properties',
        });
      }
      if (op.has('writeproperty')) {
        generateWritePropertyBlock(propertyName, deviceName, td);
        generateWritePropertyCode(propertyName, deviceName, td);

        // Add to implementedThingsBlockList
        implementedThingsBlockList.push({
          type: `${deviceName}_writePropertyBlock_${propertyName}`,
          category: 'Properties',
        });
      }
    }

    for (const [actionName, action] of Object.entries(td.actions ?? {})) {
      actionsObj[actionName] = action.forms.map(form => form.op);
      inputObj[actionName] = action.input;
      outputObj[actionName] = action.output;
    }

    // Generate Action Blocks
    for (const [actionName, operations] of Object.entries(actionsObj)) {
      const op = new Set(operations.flat());
      if (op.has('invokeaction')) {
        generateInvokeActionBlock(
          actionName,
          deviceName,
          inputObj[actionName],
          outputObj[actionName]
        );
        generateInvokeActionCode(
          actionName,
          deviceName,
          inputObj[actionName],
          outputObj[actionName]
        );

        // Add to implementedThingsBlockList
        implementedThingsBlockList.push({
          type: `${deviceName}_invokeActionBlock_${actionName}`,
          category: 'Actions',
        });
      }
    }

    for (const [eventName, event] of Object.entries(td.events ?? {})) {
      eventObj[eventName] = event.forms.map(form => form.op);
      dataObj[eventName] = event.data;
    }

    // Generate Event Blocks
    for (const [eventName, operations] of Object.entries(eventObj)) {
      const op = new Set(operations.flat());
      if (op.has('subscribeevent')) {
        generateSubscribeEventBlock(eventName, deviceName, dataObj[eventName]);
        generateSubscribeEventCode(eventName, deviceName, dataObj[eventName]);

        // Add to implementedThingsBlockList
        implementedThingsBlockList.push({
          type: `${deviceName}_subscribeEventBlock_${eventName}`,
          category: 'Events',
        });
      }
    }

    // Push thing and all created blocks to implemented Things
    implementedThings.push({
      id: deviceName,
      name: deviceName,
      type: type,
      blocks: implementedThingsBlockList,
    });

    for (const implThing of implementedThings) {
      if (implThing.id === deviceName) {
        thing = implThing;
        break;
      }
    }
  } else {
    // for video and audio devices
    for (const implThing of implementedThings) {
      if (implThing.id === type) {
        thing = implThing;
        break;
      }
    }
  }
  if (typeof thing === 'undefined') {
    return;
  }

  // add the devices blocks to the toolbox
  for (const block of thing.blocks) {
    if (block.XML) {
      addBlock(block.type, block.category, block.XML);
    } else {
      addBlock(block.type, block.category);
    }
  }
  if (type === 'audioOutput') {
    audioDevices.set(deviceName, deviceId);
    connectedThings.set(deviceName, thing);
  } else if (type === 'videoInput') {
    videoDevices.set(deviceName, deviceId);
    connectedThings.set(deviceName, thing);
  } else if (type === 'consumedDevice') {
    {
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
                consumedWebDevices.set(deviceName, deviceId);
                connectedThings.set(text, thing);
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
      promptAndCheckWithAlert(deviceName, td.id);
    }
  }
  reloadToolbox();
};
