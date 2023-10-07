/**
 * @fileoverview implements Bluetooth-Operations using webBluetooth
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import 'buffer';
import {addCleanUpFunction} from './interpreter.ts';
import {getThingsLog} from '../../tabs/Devices/things.ts';

/**
 * Stores all navigator.blueooth event handlers for the LE Scan as tuples of event and handler.
 * @private
 */
const eventListeners = [];

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
