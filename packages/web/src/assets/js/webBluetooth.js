/**
 * @fileoverview implements Bluetooth-Operations using webBluetooth
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import 'buffer';
import {addCleanUpFunction, getWorkspace} from './interpreter.ts';
import {addWebBluetoothDevice, getThingsLog} from './things.js';

/**
 * Tracks blocks in the workspace requiring a LE Scan.
 * @type {!Array<!Blockly.Block.id>}
 */
export const blocksRequiringScan = [];

/**
 * Stores all navigator.blueooth event handlers for the LE Scan as tuples of event and handler.
 * @private
 */
const eventListeners = [];

/**
 * Pairs a Bluetooth device.
 * @param thing information about the device to pair.
 * @return {Promise<BluetoothDevice>} A Promise to a BluetoothDevice object.
 */
export const requestDevice = async function (thing) {
  const thingsLog = getThingsLog();
  thingsLog('Requesting device...', 'Bluetooth');
  if (navigator.bluetooth) {
    let options = {};
    // if no filters are given, accept all devices
    if (!thing || !thing.filters) {
      options = {};
      options.acceptAllDevices = true;
    } else {
      options.filters = thing.filters;
    }
    if (thing && thing.optionalServices) {
      options.optionalServices = thing.optionalServices;
    }

    try {
      const device = await navigator.bluetooth.requestDevice(options);
      thingsLog('Device paired', 'Bluetooth', device.id);
      const name = device.name;

      addWebBluetoothDevice(device.id, name, thing);
      getWorkspace().refreshToolboxSelection();
      return device;
    } catch (error) {
      console.error(error);
    }
  }
};

/**
 * Returns a paired bluetooth device by their id.
 * @param {BluetoothDevice.id} id identifier of the device to get.
 * @returns {BluetoothDevice} the bluetooth device with id.
 */
export const getDeviceById = async function (id) {
  const devices = await navigator.bluetooth.getDevices();
  for (const device of devices) {
    if (device.id === id) {
      return device;
    }
  }
  console.error(`Bluetooth device ${id} wasn't found in paired devices.`);
};

/**
 * Sends a disconnect command.
 * @param {BluetoothDevice.id} id identifier of the device to disconnect from.
 * @param {number} sleep time in ms to wait after command, defaults to 0.
 * @return {Promise<Object>} representation of the complete request with response.
 */
// eslint-disable-next-line no-unused-vars
const disconnect = async function (id) {
  try {
    const device = await getDeviceById(id);
    const thingsLog = getThingsLog();
    thingsLog('Disconnecting...', 'Bluetooth', id);
    const request = await device.gatt.disconnect();
    thingsLog(`Disconnected from <code>${id}</code>`, 'Bluetooth');
    return request;
  } catch (error) {
    console.error(`Error disconnecting from Bluetooth device ${id}`);
    console.error(error);
  }
};

/**
 * Removes a webBluetooth eventListener.
 * @param {string} event the event to remove the listener from.
 * @param {Function} listener the listener to remove.
 * @public
 */
const removeEventListener = function (event, listener) {
  const index = eventListeners.findIndex(element => {
    return element[0] === event && element[1] === listener;
  });
  if (index !== -1) {
    eventListeners.splice(index, 1);
  }
  navigator.bluetooth.removeEventListener(event, listener);
};

/**
 * Removes webBluetooth eventListeners and deletes cached advertisements.
 */
const tearDown = async function () {
  // disconnect all bt devices.
  // const devices = await navigator.bluetooth.getDevices();
  // for (const device of devices) {
  //   await disconnect(device.id);
  // }
  // Remove all event handlers.
  if (eventListeners) {
    for (const event of eventListeners) {
      removeEventListener(event[0], event[1]);
    }
    // Reset event listeners.
    eventListeners.length = 0;
  }
};
addCleanUpFunction(tearDown);
