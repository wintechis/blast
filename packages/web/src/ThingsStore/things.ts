/**
 * @fileoverview Utility functions for handling things.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {utils, WorkspaceSvg} from 'blockly';
import {
  addBlock,
  addCategoryAt,
  reloadToolbox,
  removeBlock,
  removeCategory,
} from '../BlocklyWorkspace/toolbox';
import {getWorkspace} from '../assets/js/interpreter';
import {thingsStore} from './ThingsStore';
import {connectedThingsSlice} from './connectedThingsReducers';
import {connectDevice} from './devices';
import {implementedThing} from './types';
import {connectedBluetoothDevices} from './devices/webBluetoothDevices';
import {connectedHidDevices} from './devices/hidDevices';
import {connectedGamepads} from './devices/gamepadDevices';
import {connectedMediaDevices} from './devices/MediaDevices';
import {connectedConsumedDevices} from './devices/consumedDevices';

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

export let audioSelectButtonHandler: Function | null = null;
/**
 * Sets the 'select audio output' button handler.
 */
export const setAudioSelectButtonHandler = function (handler: Function) {
  audioSelectButtonHandler = handler;
};

export let videoSelectButtonHandler: Function | null = null;
/**
 * Sets the 'select video input' button handler.
 */
export const setVideoSelectButtonHandler = function (handler: Function) {
  videoSelectButtonHandler = handler;
};

let consumeThingButtonHandler: Function | null = null;
/**
 * Sets the 'consume device' button handler.
 */
export const setConsumeThingButtonHandler = function (handler: Function) {
  consumeThingButtonHandler = handler;
};

let getRssiBlockadded = false;

/**
 * Resets all device maps.
 */
export const resetThings = function (): void {
  connectedThings.clear();
  thingsStore.dispatch(connectedThingsSlice.actions.clear());
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
  if (connectedThingBlocks.audiooutput.length > 0) {
    xmlList.push(...connectedThingBlocks.audiooutput);
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
  if (connectedThingBlocks.videoinput.length > 0) {
    xmlList.push(...connectedThingBlocks.videoinput);
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
    audiooutput: [],
    videoinput: [],
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
        idField.textContent = connectedBluetoothDevices.get(key)?.id || '';
      } else if (thing.type === 'hid') {
        idField.textContent = connectedHidDevices.get(key)?.id || '';
      } else if (thing.type === 'gamepad') {
        idField.textContent = connectedGamepads.get(key)?.id || '';
      } else if (thing.type === 'audiooutput' || thing.type === 'videoinput') {
        idField.textContent = connectedMediaDevices.get(key)?.deviceId || '';
      } else if (thing.type === 'consumedDevice') {
        idField.textContent = connectedConsumedDevices.get(key) as string;
      }
      block.appendChild(idField);
      block.setAttribute('gap', '8');
      xmlList[thing.type].push(block);
    }
  }
  return xmlList;
};
