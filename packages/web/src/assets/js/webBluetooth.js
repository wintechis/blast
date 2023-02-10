/**LEScanResults
 * @fileoverview implements Bluetooth-Operations using webBluetooth
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import 'buffer';
import {dialog} from 'blockly';
import {addCleanUpFunction, getWorkspace} from './interpreter.ts';
import {addWebBluetoothDevice, getThingsLog} from './things.js';

/**
 * Tracks blocks in the workspace requiring a LE Scan.
 * @type {!Array<!Blockly.Block.id>}
 */
export const blocksRequiringScan = [];

/**
 * Contains the results of a LE Scan.
 */
export let LEScanResults = {};

/**
 * Indicates whether the LE Scan is running.
 */
let isLEScanRunning = false;

/**
 * Stores all navigator.blueooth event handlers for the LE Scan as tuples of event and handler.
 * @private
 */
const eventListeners = [];

/**
 * Stores all characteristic event listeners, so they can be removed later.
 * Events are stores in an object with the characteristic UUID as key,
 * and a triple of characteristic, event and handler as value.
 * @private
 */
let charEventListeners = {};

/**
 * Convert a hex string to an ArrayBuffer.
 *
 * @param {string} hexString - hex representation of bytes
 * @return {ArrayBuffer} - The bytes in an ArrayBuffer.
 */
const hexStringToArrayBuffer = function (hexString) {
  // remove the leading 0x
  hexString = hexString.replace(/^0x/, '');

  // ensure even number of characters
  if (hexString.length % 2 !== 0) {
    hexString = '0' + hexString;
  }

  // check for some non-hex characters
  const bad = hexString.match(/[G-Z\s]/i);
  if (bad) {
    console.log('WARNING: found non-hex characters', bad);
  }

  // split the string into pairs of octets
  const pairs = hexString.match(/[\dA-F]{2}/gi);

  // convert the octets to integers
  const integers = pairs.map(s => {
    return parseInt(s, 16);
  });

  const array = new Uint8Array(integers);

  return array.buffer;
};

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
 * Sends a connect command.
 * @param {BluetoothDevice.id} id identifier of the device to connect to.
 * @return {Promise<Object>} representation of the complete request with response.
 */
const connect = async function (id) {
  try {
    const device = await getDeviceById(id);
    if (!device) {
      return;
    }
    const thingsLog = getThingsLog();
    thingsLog(`Connecting to <code>${id}</code>`, 'Bluetooth');
    const request = await device.gatt.connect();
    thingsLog('Connected', 'Bluetooth', id);
    return request;
  } catch (error) {
    console.error(`Error connecting to Bluetooth device ${id}`);
    console.error(error);
  }
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
 * Starts an LE Scan for 30 seconds.
 */
export const startLEScan = async function () {
  // If the LE Scan is already running, do nothing.
  if (isLEScanRunning) {
    return;
  }
  // If the LE Scan is not running, register the cache handler and start it.
  cacheLEScanResults();
  isLEScanRunning = true;
  const thingsLog = getThingsLog();
  thingsLog('Requesting LE Scan', 'Bluetooth');
  dialog.alert(
    'Please click allow on the LE Scan prompt now, then close this dialog.',
    navigator.bluetooth.requestLEScan({
      acceptAllAdvertisements: true,
      keepRepeatedDevices: true,
    })
  );
  // Stop scan after 30 seconds.
  setTimeout(stopLEScan, 30000);
};

/**
 * Stops the BLE Scan.
 * @public
 */
export const stopLEScan = function () {
  if (isLEScanRunning) {
    const thingsLog = getThingsLog();
    thingsLog('Stopping LE Scan', 'Bluetooth');
    navigator.bluetooth.stopLEScan();
    isLEScanRunning = false;
  }
};

/**
 * Caches the results of a LE Scan.
 */
const cacheLEScanResults = function () {
  // Cache the results of the scan.
  const handler = function (event) {
    const device = event.device;
    const deviceId = device.id;
    if (!LEScanResults[deviceId]) {
      LEScanResults[deviceId] = [];
    }
    LEScanResults[deviceId].unshift(event);
  };
  // Register the event handler.
  addEventListener('advertisementreceived', handler);
};

/**
 * Adds a webBluetooth eventListener.
 * @param {string} event the event to add the listener to.
 * @param {Function} listener the listener to add.
 */
const addEventListener = function (event, listener) {
  eventListeners.push([event, listener]);
  navigator.bluetooth.addEventListener(event, listener);
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
  const devices = await navigator.bluetooth.getDevices();
  for (const device of devices) {
    await disconnect(device.id);
  }

  // Reset running scan flag
  if (isLEScanRunning) {
    isLEScanRunning = false;
  }
  // Remove all event handlers.
  if (eventListeners) {
    for (const event of eventListeners) {
      removeEventListener(event[0], event[1]);
    }
    // Reset event listeners.
    eventListeners.length = 0;
  }
  if (charEventListeners) {
    for (const characteristicUUID of Object.keys(charEventListeners)) {
      const triple = charEventListeners[characteristicUUID];
      const characteristic = triple[0];
      const event = triple[1];
      const handler = triple[2];
      characteristic.stopNotifications();
      characteristic.removeEventListener(event, handler);
    }
    // Reset event listeners.
    charEventListeners = {};
  }
  // Clear cached advertisements.
  LEScanResults = {};
};
addCleanUpFunction(tearDown);
