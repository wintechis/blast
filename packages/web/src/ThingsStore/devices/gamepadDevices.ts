import {dialog, Variables} from 'blockly';

import {addBlock, reloadToolbox} from '../../BlocklyWorkspace/toolbox';
import {connectedThingsSlice} from './../connectedThingsReducers';
import {thingsStore} from './../ThingsStore';
import {implementedThing} from './../types';
import {connectedThings} from './../things';
import {getThingsLog} from '../../tabs/DeviceTab';

/**
 * Array of all connected Gamepads, populated by the {@link pollGamepads} function.
 */
export let gamepads: Array<Gamepad> = [];
export const connectedGamepads: Map<string, Gamepad> = new Map();
const gamepadIndices: Array<number> = [];

/**
 * Connects all GamePads matching the filter criteria in thing.
 */
export const connectGamepad = async function (
  thing: implementedThing
): Promise<Gamepad | void> {
  const thingsLog = getThingsLog();
  let devices = gamepads;

  thingsLog(`Requesting device <code>${thing.name}</code>`, 'Gamepad');
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
      return !gamepadIndices.includes(device.index);
    }
    return false;
  });
  if (typeof device === 'undefined') {
    console.error('No unconnected gamepads found.');
    return;
  }
  gamepadIndices.push(device.index);

  addGamepad(device, thing);
  thingsLog(
    `Gamepad <code>${device.id}</code> Connected`,
    'Gamepad',
    device.id
  );
  reloadToolbox();
  return device;
};

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

export const addGamepad = function (
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
          const existing = thingsStore
            .getState()
            .connectedThings.some(thing => thing.id === text);
          if (existing) {
            const msg = `Name ${text} already exists.`;
            dialog.alert(msg, () => {
              promptAndCheckWithAlert(text, id); // Recurse
            });
          } else {
            // No conflict
            thingsStore.dispatch(
              connectedThingsSlice.actions.add({
                name: text,
                thing,
              })
            );
            connectedGamepads.set(text, device);
            connectedThings.set(text, thing);
            // add the devices blocks to the toolbox
            for (const block of thing.blocks) {
              addBlock(block.type, block.category, block.XML);
            }
            reloadToolbox();
          }
        } else {
          const msg = 'Name cannot be empty';
          dialog.alert(msg, () => {
            promptAndCheckWithAlert(name, id);
          });
        }
      }
    );
  };
  promptAndCheckWithAlert(device.id, device.index);
};
