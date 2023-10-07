/**
 * @fileoverview Utility functions for handling things.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {dialog, utils, Variables, WorkspaceSvg} from 'blockly';
import {
  addBlock,
  addCategoryAt,
  reloadToolbox,
  removeBlock,
  removeCategory,
} from '../../assets/js/toolbox';
import {getWorkspace} from '../../assets/js/interpreter';
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
} from '../../assets/js/automatedBlockGeneration';
import {DataSchema, ThingDescription} from 'wot-thing-description-types';

export type thingType =
  | 'audio'
  | 'bluetooth'
  | 'hid'
  | 'gamepad'
  | 'video'
  | 'consumedDevice';

interface GamepadFilter {
  index?: number;
  id?: string;
  connected?: boolean;
  mapping?: string;
  timestamp?: number;
  axes?: number[];
  buttons?: {length: number};
}

export interface implementedThing {
  id: string;
  name: string;
  type: thingType;
  blocks: {type: string; category: string; XML?: string}[];
  filters?: BluetoothLEScanFilter[] | HIDDeviceFilter[] | GamepadFilter[];
  optionalServices?: string[];
  infoUrl?: string;
  connected?: boolean;
}

/**
 * Maps device names to BluetoothDevice.id.
 */
export const webBluetoothDevices = new Map<string, string>();

/**
 * Maps user defined names to webHID identifiers.
 */
const webHidNames = new Map<string, string>();

/**
 * Maps webHID identifiers to webHID devices.
 */
const webHidDevices = new Map<string, HIDDevice>();

/**
 * Array of all connected Gamepads.
 */
export let gamepads: Array<Gamepad> = [];
/**
 * Adds all connected Gamepads to the {@link gamepads} array.
 */
export const addGamepads = function (): void {
  const gps = navigator.getGamepads ? navigator.getGamepads() : [];
  if (gps.length === 0 || !Array.from(gps).some(gp => !!gp)) {
    return;
  }
  for (const gp of gps) {
    if (gp) {
      gamepads[gp.index] = gp;
    }
  }
  window.addEventListener('gamepadconnected', e => {
    const gp = e.gamepad;
    gamepads[gp.index] = gp;
    console.log(
      'Gamepad connected at index %d: %s. %d buttons, %d axes.',
      gp.index,
      gp.id,
      gp.buttons.length,
      gp.axes.length
    );
  });
  window.addEventListener('gamepaddisconnected', e => {
    const gp = e.gamepad;
    gamepads = gamepads.filter(gamepad => gamepad.index !== gp.index);
  });
};

const connectedGamepads: Array<number> = [];

export const pollGamepads = function (): void {
  const gps = navigator.getGamepads();
  for (const gamepad of gps) {
    // Disregard empty slots.
    if (!gamepad) {
      continue;
    }
    // Update the gamepad state.
    gamepads[gamepad.index] = gamepad;
  }
  // Call yourself upon the next animation frame.
  // (Typically this happens every 60 times per second.)
  window.requestAnimationFrame(pollGamepads);
};

addGamepads();
pollGamepads();

/**
 * Maps user defined names to gamepad indices.
 */
const gamepadNames = new Map<string, number>();

/**
 * Maps audio device labels to audio device ids.
 */
const audioDevices = new Map<string, string>();

/**
 * Maps video device labels to video device ids.
 */
const videoDevices = new Map<string, string>();

/**
 * Maps consumed web device labels to video device ids.
 */
const consumedWebDevices = new Map<string, string>();

/**
 * Lists all things implemented by BLAST.
 */
export const implementedThings: Array<implementedThing> = [];

/**
 * Lists all things connected to BLAST identified by their user defined name.
 */
export const connectedThings = new Map<string, implementedThing>();

/**
 * Lists all blocks exclusively available in dev mode, as tuples of [blockName, category].
 */
export const devBlocks: [string, string][] = [];

/**
 * Lists all categories exclusively available in dev mode, as triples of [categoryName, colour, index].
 */
export const devCategories: [string, number, number][] = [];

/**
 * Wether development mode is turned on or off.
 */
let devMode = false;
export const setDevMode = function (value: boolean): void {
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
    getWorkspace()?.clear();

    resetThings();
  }
  devMode = value;
  reloadToolbox();
};

export const getDevMode = function (): boolean {
  return devMode;
};

let webBluetoothButtonHandler: Function | null = null;
/**
 * Sets the 'pair via webBluetooth' button handler.
 */
export const setWebBluetoothButtonHandler = function (handler: Function) {
  webBluetoothButtonHandler = handler;
};

let webHidButtonHandler: Function | null = null;
/**
 * Sets the 'connect via webHid' button handler.
 */
export const setWebHidButtonHandler = function (handler: Function) {
  webHidButtonHandler = handler;
};

let gamepadButtonHandler: Function | null = null;
/**
 * Sets the 'connect gamepad' button handler.
 */
export const setGamepadButtonHandler = function (handler: Function) {
  gamepadButtonHandler = handler;
};

let audioSelectButtonHandler: Function | null = null;
/**
 * Sets the 'select audio output' button handler.
 */
export const setAudioSelectButtonHandler = function (handler: Function) {
  audioSelectButtonHandler = handler;
};

let videoSelectButtonHandler: Function | null = null;
/**
 * Sets the 'select video input' button handler.
 */
export const setVideoSelectButtonHandler = function (handler: Function) {
  videoSelectButtonHandler = handler;
};

let consumeThingButtonHandler: Function | null = null;
/**
 * Sets the 'select video input' button handler.
 */
export const setConsumeThingButtonHandler = function (handler: Function) {
  consumeThingButtonHandler = handler;
};

let getRssiBlockadded = false;

/**
 * Default method for logging device interaction.
 */
let thingsLog: Function = function (
  message: string,
  adapter?: string,
  name?: string,
  deviceId?: string
) {
  console.log({adapter}, {name}, {deviceId}, message);
};

/**
 * Getter for the thingsLog function.
 */
export const getThingsLog = function (): Function {
  return thingsLog;
};

/**
 * Setter for the thingsLog function.
 */
export const setThingsLog = function (logFunc: Function): void {
  thingsLog = logFunc;
};

/**
 * Resets all device maps.
 */
export const resetThings = function (): void {
  webBluetoothDevices.clear();
  webHidNames.clear();
  webHidDevices.clear();
  connectedThings.clear();
};

/**
 * Gets the webHID device with the given uid.
 */
export const getWebHidDevice = function (deviceId: string): HIDDevice {
  const device = webHidDevices.get(deviceId);
  if (typeof device === 'undefined') {
    throw new Error('No device with id ' + deviceId + ' found.');
  }
  return device;
};

/**
 * Construct the elements (blocks and buttons) required by the flyout for the
 * things category.
 */
export const thingsFlyoutCategory = function (
  workspace: WorkspaceSvg
): Element[] {
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
    if (webBluetoothButtonHandler) {
      webBluetoothButtonHandler();
    }
  });
  xmlList.push(webBluetoothButton);
  // Add connected blocks for connected blueooth devices
  if (connectedThingBlocks.bluetooth.length > 0) {
    xmlList.push(...connectedThingBlocks.bluetooth);
  }

  // Create WebHID Label
  const webHIDLabel = document.createElement('label');
  webHIDLabel.setAttribute('text', 'WebHID Blocks');
  xmlList.push(webHIDLabel);

  // Create WebHID add device button
  const webHidbutton = document.createElement('button');
  webHidbutton.setAttribute('text', 'connect via webHID');
  webHidbutton.setAttribute('callbackKey', 'CREATE_WEBHID');
  workspace.registerButtonCallback('CREATE_WEBHID', _button => {
    if (webHidButtonHandler) {
      webHidButtonHandler();
    }
  });
  xmlList.push(webHidbutton);
  // Add connected blocks for connected webHID devices
  if (connectedThingBlocks.hid.length > 0) {
    xmlList.push(...connectedThingBlocks.hid);
  }

  // Create Gamepad Label
  const gamepadLabel = document.createElement('label');
  gamepadLabel.setAttribute('text', 'Gamepad Blocks');
  xmlList.push(gamepadLabel);

  // Create Gamepad add device button
  const gamepadButton = document.createElement('button');
  gamepadButton.setAttribute('text', 'connect gamepad');
  gamepadButton.setAttribute('callbackKey', 'CREATE_GAMEPAD');
  workspace.registerButtonCallback('CREATE_GAMEPAD', _button => {
    if (gamepadButtonHandler) {
      gamepadButtonHandler();
    }
  });
  xmlList.push(gamepadButton);
  // Add connected blocks for connected gamepads
  if (connectedThingBlocks.gamepad.length > 0) {
    xmlList.push(...connectedThingBlocks.gamepad);
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
    if (audioSelectButtonHandler) {
      audioSelectButtonHandler();
    }
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
    if (videoSelectButtonHandler) {
      videoSelectButtonHandler();
    }
  });
  xmlList.push(videoButton);

  // Add connected blocks for connected video devices
  if (connectedThingBlocks.video.length > 0) {
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
    if (consumeThingButtonHandler) {
      consumeThingButtonHandler();
    }
  });
  xmlList.push(consumeThingButton);

  // Add connected blocks for connected consumed devices
  if (connectedThingBlocks.consumedDevice.length > 0) {
    xmlList.push(...connectedThingBlocks.consumedDevice);
  }

  return xmlList;
};

/**
 * Construct the webBluetooth blocks required by the flyout for the things category.
 */
const flyoutCategoryBlocks = function (): {[key: string]: Element[]} {
  const xmlList: {[key: string]: Element[]} = {
    bluetooth: [],
    hid: [],
    gamepad: [],
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
      const block = utils.xml.createElement('block');
      block.setAttribute('type', 'things_' + id);
      const fieldName = utils.xml.createElement('field');
      fieldName.setAttribute('name', 'name');
      fieldName.textContent = key;
      block.appendChild(fieldName);
      const idField = utils.xml.createElement('field');
      idField.setAttribute('name', 'id');
      if (thing.type === 'bluetooth') {
        idField.textContent = webBluetoothDevices.get(key) as string;
      } else if (thing.type === 'hid') {
        idField.textContent = webHidNames.get(key) as string;
      } else if (thing.type === 'gamepad') {
        idField.textContent = (gamepadNames.get(key) as number).toString();
      } else if (thing.type === 'audio') {
        idField.textContent = audioDevices.get(key) as string;
      } else if (thing.type === 'video') {
        idField.textContent = videoDevices.get(key) as string;
      } else if (thing.type === 'consumedDevice') {
        idField.textContent = consumedWebDevices.get(key) as string;
      }
      block.appendChild(idField);
      block.setAttribute('gap', '8');
      xmlList[thing.type].push(block);
    }
  }
  return xmlList;
};

/**
 * Returns an Array containing tuples of device names and their identifier.
 * @example [['beacon', 'm+JZZGVo+aDUb0a4NOpQWw==']]
 */
export const getWebBluetoothDevices = function (): string[][] {
  const keysArray = [...webBluetoothDevices.keys()];
  keysArray.sort();

  // if no devices connected, return empty array
  if (keysArray.length === 0) {
    return [];
  }

  // build options array
  const options: string[][] = [];
  for (const deviceName of keysArray) {
    const deviceId = webBluetoothDevices.get(deviceName) as string;
    options.push([deviceName, deviceId]);
  }

  return options;
};

/**
 * Returns an Array containing tuples of device names and their identifier.
 * @example [['beacon', 'm+JZZGVo+aDUb0a4NOpQWw==']]
 */
export const getWebHIDDevices = function (): string[][] {
  const keysArray = [...webHidNames.keys()];
  keysArray.sort();

  // if no devices connected, return empty array
  if (keysArray.length === 0) {
    return [];
  }

  // build options array
  const options: string[][] = [];
  for (const deviceName of keysArray) {
    const deviceId = webHidNames.get(deviceName) as string;
    options.push([deviceName, deviceId]);
  }

  return options;
};

/**
 * Connects a WebHidDevice.
 */
export const connectWebHidDevice = async function (
  thing: implementedThing
): Promise<HIDDevice | void> {
  const workspace = getWorkspace();
  thingsLog('Requesting webHID device...', 'HID');
  let filters: HIDDeviceFilter[] = [];
  if (thing.filters) {
    filters = thing.filters as HIDDeviceFilter[];
  }
  // requestDeviceAndAddId is added to navigator.hid in @blast:core
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const device = await (navigator.hid as any).requestDeviceAndAddId({
    filters: filters,
  });
  if (device.length === 0) {
    console.error('Connection failed or cancelled by User.');
    return;
  }
  // add device to the device map
  addWebHidDevice(device[0].id, device[0].productName, device[0], thing);
  workspace?.refreshToolboxSelection();
  thingsLog('Connected', 'HID', device[0].productName);
  return device[0];
};

/**
 * Creates user defined identifier to get devices from {@link webHidDevices}.
 * @param thing information about the device to pair.
 */
export const addWebHidDevice = function (
  uid: string,
  deviceName: string,
  device: HIDDevice,
  thing: implementedThing
): void {
  // This function needs to be named so it can be called recursively.
  const promptAndCheckWithAlert = function (name: string, id: string): void {
    Variables.promptName(
      'Connection established! Now give your device a name.',
      name,
      text => {
        if (text) {
          const existing = webHidNames.has(text);
          if (existing) {
            const msg = 'Name %1 already exists'.replace('%1', text);
            dialog.alert(msg, () => {
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
          dialog.alert(msg, () => {
            promptAndCheckWithAlert(text ?? '', id); // Recurse
          });
        }
      }
    );
  };
  return promptAndCheckWithAlert(deviceName, uid);
};

/**
 * Connects all GamePads matching the filter criteria in thing.
 */
export const connectGamepad = async function (
  thing: implementedThing
): Promise<Gamepad | void> {
  const workspace = getWorkspace();
  let devices = gamepads;

  devices = devices.filter(device => {
    if (device !== null) {
      if (thing.filters) {
        for (const filter of thing.filters) {
          // apply each filter
          Object.keys(filter).forEach(key => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((device as any)[key] !== (filter as any)[key]) {
              return false;
            }
          });
        }
      }
      return true;
    }
    return false;
  });

  if (devices.length === 0) {
    console.error(
      'No gamepads connected. Try waking them up, by pressing a button.'
    );
    return;
  }

  // get first device not already connected
  const device = devices.find(device => {
    if (device !== null) {
      return !connectedGamepads.includes(device.index);
    }
    return false;
  });
  if (typeof device === 'undefined') {
    console.error('No unconnected gamepads found.');
    return;
  }
  connectedGamepads.push(device.index);

  addGamepad(device.index, device.id, device, thing);
  thingsLog('Connected', 'Gamepad', device.id);
  workspace?.refreshToolboxSelection();
  return device;
};

export const addGamepad = function (
  index: number,
  deviceName: string,
  device: Gamepad,
  thing: implementedThing
): void {
  // This function needs to be named so it can be called recursively.
  const promptAndCheckWithAlert = function (name: string, id: number): void {
    Variables.promptName(
      'Connection established! Now give your device a name.',
      name,
      text => {
        if (text) {
          const existing = gamepadNames.has(text);
          if (existing) {
            const msg = 'Name %1 already exists'.replace('%1', text);
            dialog.alert(msg, () => {
              promptAndCheckWithAlert(text, id); // Recurse
            });
          } else {
            // No conflict
            gamepadNames.set(text, id);
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
          dialog.alert(msg, () => {
            promptAndCheckWithAlert(text ?? '', id); // Recuse
          });
        }
      }
    );
  };
  promptAndCheckWithAlert(deviceName, index);
};

export const handleAddConsumedThing = async function (uri: string) {
  // TODO: Check if URI is valid

  // Crawl all referenced Thing Description links
  const foundTDs = await crawl(uri, 3);

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
 */
export const addDevice = function (
  deviceName: string,
  deviceId: string,
  type: thingType,
  td: ThingDescription
) {
  let thing: implementedThing | undefined;
  if (type === 'consumedDevice') {
    // generate a unique id for the new device

    // Object to store property names and allowed ops
    const propertiesObj: {
      [key: string]: (string | string[] | undefined)[];
    } = {};
    // Object to store action names and allowed ops
    const actionsObj: {
      [key: string]: (string | string[] | undefined)[];
    } = {};
    // Store all inputs of actions
    const inputObj: {[key: string]: DataSchema} = {};
    // Store all outputs of actions
    const outputObj: {[key: string]: DataSchema} = {};
    // Object to store event names and allowed ops
    const eventObj: {
      [key: string]: (string | string[] | undefined)[];
    } = {};
    // Store "data" of events
    const dataObj: {[key: string]: DataSchema} = {};

    // List of all created Blocks
    const implementedThingsBlockList = [];

    // Generate Thing Block
    if (typeof td.description === 'undefined') {
      generateThingBlock(deviceName, deviceName, td);
    } else {
      generateThingBlock(deviceName, td.description, td);
    }
    generateThingCode(deviceName, td);

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
      inputObj[actionName] = action.input as DataSchema;
      outputObj[actionName] = action.output as DataSchema;
    }

    // Generate Action Blocks
    for (const [actionName, operations] of Object.entries(actionsObj)) {
      const op = new Set(operations.flat());
      if (op.has('invokeaction')) {
        generateInvokeActionBlock(
          actionName,
          deviceName,
          inputObj[actionName],
          outputObj[actionName],
          td
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
      dataObj[eventName] = event.data as DataSchema;
    }

    // Generate Event Blocks
    for (const [eventName, operations] of Object.entries(eventObj)) {
      const op = new Set(operations.flat());
      if (op.has('subscribeevent')) {
        generateSubscribeEventBlock(eventName, deviceName);
        generateSubscribeEventCode(eventName, deviceName);

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
  if (type === 'audio') {
    audioDevices.set(deviceName, deviceId);
    connectedThings.set(deviceName, thing);
  } else if (type === 'video') {
    videoDevices.set(deviceName, deviceId);
    connectedThings.set(deviceName, thing);
  } else if (type === 'consumedDevice') {
    {
      // This function needs to be named so it can be called recursively.
      const promptAndCheckWithAlert = function (
        name: string,
        id: string
      ): void {
        Variables.promptName(
          'Pair successful! Now give your device a name.',
          name,
          text => {
            if (text) {
              const existing = webBluetoothDevices.has(text);
              if (existing) {
                const msg = 'Name %1 already exists'.replace('%1', text);
                dialog.alert(msg, () => {
                  promptAndCheckWithAlert(text, id); // Recurse
                });
              } else {
                // No conflict
                consumedWebDevices.set(deviceName, deviceId);
                connectedThings.set(text, thing as implementedThing);
              }
            } else {
              const msg = 'Name cannot be empty';
              dialog.alert(msg, () => {
                promptAndCheckWithAlert(text ?? '', id); // Recuse
              });
            }
          }
        );
      };
      promptAndCheckWithAlert(deviceName, td.id ?? '');
    }
  }
  reloadToolbox();
};
