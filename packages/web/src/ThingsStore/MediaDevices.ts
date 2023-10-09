import {Variables, dialog} from 'blockly';
import {addBlock, reloadToolbox} from '../BlocklyWorkspace/toolbox';
import {implementedThing} from './types';
import {thingsStore} from './ThingsStore';
import {connectedThingsSlice} from './connectedThingsReducers';
import {connectedThings, getThingsLog} from './things';

export const connectedMediaDevices: Map<string, MediaDeviceInfo> = new Map();

export const addMediaDevice = function (
  device: MediaDeviceInfo,
  thing: implementedThing
) {
  const thingsLog = getThingsLog();
  // This function needs to be named so it can be called recursively.
  const promptAndCheckWithAlert = function (name: string, id: string): void {
    Variables.promptName(
      'Pair successful! Now give your device a name.',
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
            connectedMediaDevices.set(text, device);
            connectedThings.set(text, thing);
            // add the devices blocks to the toolbox
            for (const block of thing.blocks) {
              addBlock(block.type, block.category, block.XML);
            }
            thingsLog(
              `Device <code>${thing.name}</code> Connected`,
              thing.type,
              device.deviceId
            );
          }
        } else {
          const msg = 'Name cannot be empty';
          dialog.alert(msg, () => {
            promptAndCheckWithAlert(name, id); // Recuse
          });
        }
      }
    );
  };
  promptAndCheckWithAlert(device.label, device.deviceId);
  reloadToolbox();
};
