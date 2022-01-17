/**
 * @fileoverview implements Bluetooth-Operations using webBluetooth
 * (https://webbluetoothcg.github.io/web-bluetooth/).
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

/**
   * Bluetooth API namespace.
   * @name Blast.Bluetooth
   * @namespace
   * @public
   */
goog.module('Blast.Bluetooth');
goog.module.declareLegacyNamespace();

const {addCleanUpFunction} = goog.require('Blast.Interpreter');
const {addWebBluetoothDevice} = goog.require('Blast.Things');
const {getThingsLog} = goog.require('Blast.Things');
const {getWorkspace} = goog.require('Blast.Interpreter');
const {setWebBluetoothButtonHandler} = goog.require('Blast.Things');
const {throwError} = goog.require('Blast.Interpreter');
 
/**
  * Optional serviceUUIDs to scan for.
  * @type {Array<String>}
  * @public
  */
const optionalServices = [];
exports.optionalServices = optionalServices;
 
/**
  * Contains block types that require a LE Scan.
  * On runtine, if any of these blocks is in the workspace,
  * the LE Scan will be requested and results cached in {@link Blast.Bluetooth.LEScanResults}.
  * @type {Array<string>}
  * @public
  */
const scanBlocks = [];
exports.scanBlocks = scanBlocks;
 
/**
  * Contains the results of a LE Scan.
  */
let LEScanResults = {};
exports.LEScanResults = LEScanResults;
 
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
const hexStringToArrayBuffer = function(hexString) {
  // remove the leading 0x
  hexString = hexString.replace(/^0x/, '');
   
  // ensure even number of characters
  if (hexString.length % 2 != 0) {
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
  const integers = pairs.map(function(s) {
    return parseInt(s, 16);
  });
   
  const array = new Uint8Array(integers);
   
  return array.buffer;
};
 
/**
  * Pairs a Bluetooth device.
  * @param {Object} options An object that sets options for the device request.
  * @param {Array<BluetoothScanFilters>} options.filters An array of BluetoothScanFilters.
  * @param {boolean} options.optionalServices An array of BluetoothServiceUUIDs.
  * @param {boolean} [options.acceptAllDevices=false] whether script accepts all Bluetooth devices.
  * @param {string=} deviceName optional, name of the device to pair.
  * @return {Promise<BluetoothDevice>} A Promise to a BluetoothDevice object.
  */
const requestDevice = async function(options, deviceName) {
  const thingsLog = getThingsLog();
  thingsLog('Requesting device...', 'Bluetooth');
  if (navigator.bluetooth) {
    // if no options are given, use default ones
    if (!options) {
      options = {};
      options.acceptAllDevices = true;
      options.optionalServices = optionalServices;
    }
 
    try {
      const device = await navigator.bluetooth.requestDevice(options);
      thingsLog('Device paired', 'Bluetooth', device.id);
      // if no device name is given, use default one
      const name = deviceName || device.name;
           
      addWebBluetoothDevice(device.id, name);
      getWorkspace().refreshToolboxSelection();
      return (device);
    } catch (error) {
      throwError(error);
    }
  }
};
exports.requestDevice = requestDevice;
setWebBluetoothButtonHandler(requestDevice);

/**
  * Returns a paired bluetooth device by their id.
  * @param {string} id identifier of the device to get.
  * @returns {BluetoothDevice} the bluetooth device with id.
  */
const getDeviceById = async function(id) {
  const devices = await navigator.bluetooth.getDevices();
  for (const device of devices) {
    if (device.id == id) {
      return device;
    }
  }
  throwError(`Bluetooth device ${id} wasn't found in paired devices.`);
};
 
/**
   * Sends a connect command.
   * @param {string} id identifier of the device to connect to.
   * @return {Object} representation of the complete request with response.
   */
const connect = async function(id) {
  try {
    const device = await getDeviceById(id);
    const thingsLog = getThingsLog();
    thingsLog(`Connecting to <code>${id}</code>`, 'Bluetooth');
    const request = await device.gatt.connect();
    thingsLog('Connected', 'Bluetooth', id);
    return request;
  } catch (error) {
    throwError(`Error connecting to Bluetooth device ${id}`);
    console.error(error);
  }
};
 
/**
   * Sends a disconnect command.
   * @param {string} id identifier of the device to disconnect from.
   * @param {number} sleep time in ms to wait after command, defaults to 0.
   * @return {Object} representation of the complete request with response.
   */
const disconnect = async function(id) {
  try {
    const device = await getDeviceById(id);
    const thingsLog = getThingsLog();
    thingsLog('Disconnecting...', 'Bluetooth', id);
    const request = await device.gatt.disconnect();
    thingsLog(`Disconnected from <code>${id}</code>`, 'Bluetooth');
    return request;
  } catch (error) {
    throwError(`Error disconnecting from Bluetooth device ${id}`);
    console.error(error);
  }
};
  
/**
   * Writes data to Bluetooth device using the gatt protocol.
   * @param {string} id identifier of the device to write to.
   * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
   * @param {BluetoothCharacteristicUUID} characteristicUUID identifier of the characteristic.
   * @param {string} value hex value to write.
   */
const gatt_writeWithoutResponse = async function(
    id, serviceUUID, characteristicUUID, value) {
  const characteristic = await getCharacteristic(
      id, serviceUUID, characteristicUUID);
  if (!characteristic) {
    return;
  }
   
  // If value is a string, convert it to an ArrayBuffer.
  if (typeof value === 'string') {
    value = hexStringToArrayBuffer(value);
  }

  try {
    const thingsLog = getThingsLog();
    thingsLog(
        'Invoke <code>WriteValueWithoutResponse</code> on characteristic ' +
        `<code>${characteristicUUID}</code> with value <code>${value.toString()}</code>`, 'Bluetooth', id);
    await characteristic.writeValueWithoutResponse(value);
    thingsLog(
        'Finished <code>WriteValueWithoutResponse</code> on characteristic ' +
        `<code>${characteristicUUID}</code> with value <code>${value.toString()}</code>`, 'Bluetooth', id);
  } catch (error) {
    const errorMsg = 'Error writing to Bluetooth device.\nMake sure the device is compatible with the connected block.';
    console.error(error);
    throwError(errorMsg);
  }
};
exports.gatt_writeWithoutResponse = gatt_writeWithoutResponse;
 
  
/**
   * Writes data to Bluetooth device using the gatt protocol.
   * @param {string} id identifier of the device to write to.
   * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
   * @param {BluetoothCharacteristicUUID} characteristicUUID identifier of the characteristic.
   * @param {string} value hex value to write.
   * @return {Object} representation of the complete request with response.
   */
const gatt_writeWithResponse = async function(
    id, serviceUUID, characteristicUUID, value) {
  const characteristic = await getCharacteristic(
      id, serviceUUID, characteristicUUID,
  );
  if (!characteristic) {
    return;
  }
     
  // If value is a string, convert it to an ArrayBuffer.
  if (typeof value === 'string') {
    value = hexStringToArrayBuffer(value);
  }
 
  try {
    const thingsLog = getThingsLog();
    thingsLog(
        'Invoke <code>WriteValueWithResponse</code> on characteristic ' +
        `<code>${characteristicUUID}</code> with value <code>${value.toString()}</code>`, 'Bluetooth', id);
    await characteristic.writeValueWithResponse(value);
    thingsLog(
        'Finished <code>WriteValueWithResponse</code> on characteristic ' +
        `<code>${characteristicUUID}</code> with value <code>${value.toString()}</code>`, 'Bluetooth', id);
  } catch (error) {
    const errorMsg = 'Error writing to Bluetooth device.\nMake sure the device is compatible with the connected block.';
    console.error(error);
    throwError(errorMsg);
  }
};
exports.gatt_writeWithResponse = gatt_writeWithResponse;
 
/**
  * Returns a promise to the primary BluetoothRemoteGATTService offered by
  * the bluetooth device for a specified BluetoothServiceUUID.
  * @param {string} id identifier of the device to get the service from.
  * @param {ServiceUUID} serviceUUID identifier of the service.
  * @returns {Promise<BluetoothRemoteGATT>} A BluetoothRemoteGATTService object.
  */
const getPrimaryService = async function(id, serviceUUID) {
  const server = await connect(id);
  let service;
  try {
    const thingsLog = getThingsLog();
    thingsLog(`Getting primary service <code>${serviceUUID}</code>`, 'Bluetooth', id);
    service = await server.getPrimaryService(serviceUUID);
    thingsLog(`Got primary service <code>${serviceUUID}</code>`, 'Bluetooth', id);
  } catch (error) {
    console.error(error);
    throwError('The device is not compatible with the connected block.');
  }
  return service;
};
exports.getPrimaryService = getPrimaryService;
 
/**
 * Returns a promise to the BluetoothRemoteGATTCharacteristic offered by
 * the bluetooth device for a specified BluetoothServiceUUID and
 * BluetoothCharacteristicUUID.
 * @param {string} id identifier of the device to get the characteristic from.
 * @param {ServiceUUID} serviceUUID identifier of the service.
 * @param {CharacteristicUUID} characteristicUUID identifier of the characteristic.
 * @returns {Promise<BluetoothRemoteGATTCharacteristic>} A BluetoothRemoteGATTCharacteristic object.
 */
const getCharacteristic = async function(id, serviceUUID, characteristicUUID) {
  const service = await getPrimaryService(id, serviceUUID);
  if (!service) {
    return;
  }
  let characteristic;
  try {
    const thingsLog = getThingsLog();
    thingsLog(
        `Getting characteristic <code>${characteristicUUID}</code> from service <code>${serviceUUID}</code>`, 'Bluetooth', id);
    characteristic = await service.getCharacteristic(characteristicUUID);
    thingsLog(
        `Got characteristic <code>${characteristicUUID}</code> from service <code>${serviceUUID}</code>`, 'Bluetooth', id);
  } catch (error) {
    console.error(error);
    throwError('The device is not compatible with the connected block.');
  }
  return characteristic;
};
exports.getCharacteristic = getCharacteristic;
 
/**
  * Reads data from Bluetooth device using the gatt protocol.
  * @param {string} id identifier of the device to read from.
  * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
  * @param {BluetoothCharacteristicUUID} characteristicUUID identifier of the characteristic.
  * @return {Object} representation of the complete request with response.
  * @public
  */
const gatt_read = async function(id, serviceUUID, characteristicUUID) {
  const characteristic = await getCharacteristic(
      id,
      serviceUUID,
      characteristicUUID,
  );
  try {
    const thingsLog = getThingsLog();
    thingsLog(
        `Invoke <code>ReadValue</code> on characteristic <code>${characteristicUUID}</code>` +
         ` from service <code>${serviceUUID}</code>`, 'Bluetooth', id);
    const value = await characteristic.readValue();
    thingsLog(
        `Finished <code>ReadValue</code> on characteristic <code>${characteristicUUID}</code>` +
         ` from service <code>${serviceUUID}</code> - value: <code>${value.toString()}</code>`, 'Bluetooth', id);
    return value;
  } catch (error) {
    console.error(error);
    throwError(`Error reading from Bluetooth device ${id}`);
  }
};
exports.gatt_read = gatt_read;
 
/**
  * Reads a text (UTF-8) characteristic value from a Bluetooth device.
  * @param {string} id identifier of the device to read from.
  * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
  * @param {BluetoothCharacteristicUUID} characteristicUUID identifier of the characteristic.
  * @return {string} the value of the characteristic.
  * @public
  */
const gatt_read_text = async function(id, serviceUUID, characteristicUUID) {
  const value = await gatt_read(id, serviceUUID, characteristicUUID);
  const stringValue = new TextDecoder().decode(value);
  return stringValue;
};
exports.gatt_read_text = gatt_read_text;
 
/**
  * Reads a nummerical characteristic value from a Bluetooth device.
  * @param {string} id identifier of the device to read from.
  * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
  * @param {BluetoothCharacteristicUUID} characteristicUUID identifier of the characteristic.
  * @returns {number} the value of the characteristic.
  * @public
  */
const gatt_read_number = async function(id, serviceUUID, characteristicUUID) {
  let dataView = await gatt_read(id, serviceUUID, characteristicUUID);
  // If value is not a DataView already, convert it.
  if (!(dataView instanceof DataView)) {
    dataView = new DataView(value);
  }
  const arr = new Uint8Array(dataView.buffer);
  const length = arr.length;
  const arrayBuffer = buffer.Buffer.from(arr);
  const result = arrayBuffer.readUIntBE(0, length);
 
  return result;
};
exports.gatt_read_number = gatt_read_number;
 
/** Reads a hexadecimal characteristic value from a Bluetooth device.
  * @param {string} id identifier of the device to read from.
  * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
  * @param {BluetoothCharacteristicUUID} characteristicUUID identifier of the characteristic.
  * @returns {string} the value of the characteristic.
  * @public
  */
const gatt_read_hex = async function(id, serviceUUID, characteristicUUID) {
  const value = await gatt_read(id, serviceUUID, characteristicUUID);
  const hexValue = new Uint8Array(value.buffer).reduce((acc, byte) => {
    return acc + ('0' + byte.toString(16)).slice(-2);
  }, '');
  return hexValue;
};
exports.gatt_read_hex = gatt_read_hex;
 
/**
  * Subscribes to a Bluetooth characteristic and adds an event listener.
  * @param {string} id identifier of the device to read from.
  * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
  * @param {BluetoothCharacteristicUUID} charUUID identifier of the characteristic.
  * @param {Function} handler handler to register for notifications.
  */
const gatt_subscribe = async function(id, serviceUUID, charUUID, handler) {
  const characteristic = await getCharacteristic(
      id, serviceUUID, charUUID,
  );
  const thingsLog = getThingsLog();
  thingsLog(
      `Add 'characteristicvaluechanged' listener to characteristic ${charUUID}` +
       ` of service <code>${serviceUUID}</code>`, 'Bluetooth', id);
  characteristic.addEventListener('characteristicvaluechanged', handler);
  // add the event to the list of events.
  charEventListeners[charUUID] = [characteristic, 'characteristicvaluechanged', handler];
  try {
    thingsLog(
        `Invoke <code>startNotifications</code> on characteristic ${charUUID}` +
         ` from service <code>${serviceUUID}</code>`, 'Bluetooth', id);
    await characteristic.startNotifications();
    thingsLog(
        `Finished <code>startNotifications</code> on characteristic ${charUUID}` +
         ` from service <code>${serviceUUID}</code>`, 'Bluetooth', id);
  } catch (error) {
    console.error(error);
    throwError(`Error subscribing to Bluetooth device ${id}`);
  }
};
exports.gatt_subscribe = gatt_subscribe;
 
/** Start the LE Scan.
  * public
  */
const startLEScan = async function() {
  // If the LE Scan is already running, do nothing.
  if (isLEScanRunning) {
    return;
  }
  // If the LE Scan is not running, register the cache handler and start it.
  cacheLEScanResults();
  isLEScanRunning = true;
  const thingsLog = getThingsLog();
  thingsLog('Requesting LE Scan', 'Bluetooth');
  Blockly.alert('Please click allow on the LE Scan prompt now, then close this dialog.',
      navigator.bluetooth.requestLEScan(
          {acceptAllAdvertisements: true, keepRepeatedDevices: true},
      ),
  );
  // Stop scan after 30 seconds.
  setTimeout(stopLEScan, 30000);
};
exports.startLEScan = startLEScan;
 
/**
  * Stops the BLE Scan.
  * @public
  */
const stopLEScan = function() {
  if (isLEScanRunning) {
    const thingsLog = getThingsLog();
    thingsLog('Stopping LE Scan', 'Bluetooth');
    navigator.bluetooth.stopLEScan();
    isLEScanRunning = false;
  }
};
exports.stopLEScan = stopLEScan;
 
/**
  * Caches the results of a LE Scan.
  */
const cacheLEScanResults = function() {
  // Cache the results of the scan.
  const handler = function(event) {
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
  * @param {function} listener the listener to add.
  */
const addEventListener = function(event, listener) {
  eventListeners.push([event, listener]);
  navigator.bluetooth.addEventListener(event, listener);
};
 
/**
  * Removes a webBluetooth eventListener.
  * @param {string} event the event to remove the listener from.
  * @param {function} listener the listener to remove.
  * @public
  */
const removeEventListener = function(event, listener) {
  const index = eventListeners.findIndex(function(element) {
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
const tearDown = function() {
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
