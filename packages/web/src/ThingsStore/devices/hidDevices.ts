import {dialog, Variables} from 'blockly';

import {addBlock, reloadToolbox} from '../../BlocklyWorkspace/toolbox';
import {connectedThingsSlice} from './../connectedThingsReducers';
import {thingsStore} from './../ThingsStore';
import {HIDAdapter, HIDAdapterDevice, implementedThing} from './../types';
import {getThingsLog} from '../../tabs/DeviceTab';
import {connectedThings} from '../things';

export const connectedHidDevices = new Map<string, HIDAdapterDevice>();

/**
 * Gets the webHID device with the given uid.
 * @param uid the uid of the device to get
 * @returns the device with the given uid
 */
export const getDeviceById = function (uid: string): HIDAdapterDevice {
  const thingsLog = getThingsLog();
  thingsLog(`Getting HID device <code>${uid}</code>`, 'HID');
  const device = connectedHidDevices.get(uid);
  if (typeof device === 'undefined') {
    throw new Error(`HID device ${uid} wasn't found in connected devices.`);
  }
  return device;
};

/**
 * Connects a WebHidDevice.
 * @param thing information about the device to pair.
 * @returns the connected device
 */
export const connectWebHidDevice = async function (
  thing: implementedThing
): Promise<HIDAdapterDevice | void> {
  const thingsLog = getThingsLog();
  let filters: HIDDeviceFilter[] = [];
  if (thing.filters) {
    filters = thing.filters as HIDDeviceFilter[];
  }
  thingsLog(`Requesting device <code>${thing.name}</code>`, 'HID');
  // requestDeviceAndAddId is added to navigator.hid in @blast:core
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const device: HIDAdapterDevice[] = await (
    navigator.hid as HIDAdapter
  ).requestDeviceAndAddId({
    filters: filters,
  });
  if (device.length === 0) {
    console.error('Connection failed or cancelled by User.');
    return;
  }
  // add device to the device map
  addWebHidDevice(device[0], thing);
  reloadToolbox();
  thingsLog(
    `HID Device <code>${thing.name}</code> connected`,
    'HID',
    device[0].id
  );
  return device[0];
};

/**
 * Creates user defined identifier to get devices from {@link webHidDevices}.
 * @param thing information about the device to pair.
 */
export const addWebHidDevice = function (
  device: HIDAdapterDevice,
  thing: implementedThing
): void {
  const deviceName = device.productName;
  const uid = device.id;
  // This function needs to be named so it can be called recursively.
  const promptAndCheckWithAlert = (name: string, id: string): void => {
    Variables.promptName(
      'Connection established! Now give your device a name.',
      name,
      newName => {
        if (newName) {
          const existing = thingsStore
            .getState()
            .connectedThings.some(thing => thing.id === newName);
          if (existing) {
            const msg = `Name ${newName} already exists.`;
            dialog.alert(msg, () => {
              promptAndCheckWithAlert(newName, id);
            });
          } else {
            // No conflict
            thingsStore.dispatch(
              connectedThingsSlice.actions.add({
                name: newName,
                thing,
              })
            );
            connectedHidDevices.set(newName, device);
            connectedThings.set(newName, thing);
            // add the devices blocks to the toolbox
            for (const block of thing.blocks) {
              addBlock(block.type, block.category, block.XML);
            }
            // Add thing to workspace
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
  return promptAndCheckWithAlert(deviceName, uid);
};
