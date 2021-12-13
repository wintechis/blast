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
goog.provide('Blast.Bluetooth');
 
/**
  * Optional serviceUUIDs to scan for.
  * @type {Array<String>}
  * @public
  */
Blast.Bluetooth.optionalServices = [];
 
/**
  * Contains block types that require a LE Scan.
  * On runtine, if any of these blocks is in the workspace,
  * the LE Scan will be requested and results cached in {@link Blast.Bluetooth.LEScanResults}.
  * @type {Array<string>}
  * @public
  */
Blast.Bluetooth.scanBlocks = [];
 
/**
  * Contains the results of a LE Scan.
  */
Blast.Bluetooth.LEScanResults = {};
 
/**
  * Indicates whether the LE Scan is running.
  */
Blast.Bluetooth.isLEScanRunning = false;
 
/**
  * Stores all navigator.blueooth event handlers for the LE Scan as tuples of event and handler.
  * @private
  */
Blast.Bluetooth.eventListeners = [];
 
/**
  * Stores all characteristic event listeners, so they can be removed later.
  * Events are stores in an object with the characteristic UUID as key,
  * and a triple of characteristic, event and handler as value.
  * @private
  */
Blast.Bluetooth.charEventListeners = {};
 
 
/**
 * Convert a hex string to an ArrayBuffer.
 *
 * @param {string} hexString - hex representation of bytes
 * @return {ArrayBuffer} - The bytes in an ArrayBuffer.
 */
function hexStringToArrayBuffer(hexString) {
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
}
 
/**
  * Pairs a Bluetooth device.
  * @param {Object} options An object that sets options for the device request.
  * @param {Array<BluetoothScanFilters>} options.filters An array of BluetoothScanFilters.
  * @param {boolean} options.optionalServices An array of BluetoothServiceUUIDs.
  * @param {boolean} [options.acceptAllDevices=false] whether script accepts all Bluetooth devices.
  * @param {string=} deviceName optional, name of the device to pair.
  * @return {Promise<BluetoothDevice>} A Promise to a BluetoothDevice object.
  */
Blast.Bluetooth.requestDevice = async function(options, deviceName) {
  Blast.Ui.addToLog('Requesting Bluetooth device...');
  if (navigator.bluetooth) {
    // if no options are given, use default ones
    if (!options) {
      options = {};
      options.acceptAllDevices = true;
      options.optionalServices = Blast.Bluetooth.optionalServices;
    }
 
    try {
      const device = await navigator.bluetooth.requestDevice(options);
      Blast.Ui.addToLog('Bluetooth device found: ' + device.name);
      // if no device name is given, use default one
      const name = deviceName || device.name;
           
      Blast.Things.addWebBluetoothDevice(device.id, name);
      Blast.workspace.refreshToolboxSelection();
      return (device);
    } catch (error) {
      Blast.throwError(error);
    }
  }
};
 
/**
  * Returns a paired bluetooth device by their id.
  * @param {string} id identifier of the device to get.
  * @returns {BluetoothDevice} the bluetooth device with id.
  */
Blast.Bluetooth.getDeviceById = async function(id) {
  Blast.Ui.addToLog('Getting previously paired device with id ' + id);
  const devices = await navigator.bluetooth.getDevices();
  for (const device of devices) {
    if (device.id == id) {
      Blast.Ui.addToLog('Found previously paired device with id ' + id);
      return device;
    }
  }
  Blast.throwError(`Bluetooth device ${id} wasn't found in paired devices.`);
};
 
/**
   * Sends a connect command.
   * @param {string} id identifier of the device to connect to.
   * @return {Object} representation of the complete request with response.
   */
Blast.Bluetooth.connect = async function(id) {
  try {
    const device = await Blast.Bluetooth.getDeviceById(id);
    Blast.Ui.addToLog('Connecting to Bluetooth device with id ' + id);
    const request = await device.gatt.connect();
    Blast.Ui.addToLog('Connected to Bluetooth device with id ' + id);
    return request;
  } catch (error) {
    Blast.throwError(`Error connecting to Bluetooth device ${id}`);
    console.error(error);
  }
};
 
/**
   * Sends a disconnect command.
   * @param {string} id identifier of the device to disconnect from.
   * @param {number} sleep time in ms to wait after command, defaults to 0.
   * @return {Object} representation of the complete request with response.
   */
Blast.Bluetooth.disconnect = async function(id) {
  try {
    const device = await Blast.Bluetooth.getDeviceById(id);
    Blast.Ui.addToLog('Disconnecting from Bluetooth device with id ' + id);
    const request = await device.gatt.disconnect();
    Blast.Ui.addToLog('Disconnected from Bluetooth device with id ' + id);
    return request;
  } catch (error) {
    Blast.throwError(`Error disconnecting from Bluetooth device ${id}`);
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
Blast.Bluetooth.gatt_writeWithoutResponse = async function(
    id, serviceUUID, characteristicUUID, value) {
  const characteristic = await Blast.Bluetooth.getCharacteristic(
      id, serviceUUID, characteristicUUID);
  if (!characteristic) {
    return;
  }
   
  // If value is a string, convert it to an ArrayBuffer.
  if (typeof value === 'string') {
    Blast.Ui.addToLog(`Converting string ${value} to ArrayBuffer`);
    value = hexStringToArrayBuffer(value);
    Blast.Ui.addToLog(`Converted to ArrayBuffer ${value}`);
  }
   
  try {
    Blast.Ui.addToLog(
        `Invoke WriteValueWithoutResponse on characteristic ${characteristic}` +
         ` of device ${id} with value ${value}`);
    await characteristic.writeValueWithoutResponse(value);
    Blast.Ui.addToLog(
        `Finished WriteValueWithoutResponse on characteristic ${characteristic}` +
         ` of device ${id} with value ${value}`);
  } catch (error) {
    const errorMsg = 'Error writing to Bluetooth device.\nMake sure the device is compatible with the connected block.';
    console.error(error);
    Blast.throwError(errorMsg);
  }
};
 
  
/**
   * Writes data to Bluetooth device using the gatt protocol.
   * @param {string} id identifier of the device to write to.
   * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
   * @param {BluetoothCharacteristicUUID} characteristicUUID identifier of the characteristic.
   * @param {string} value hex value to write.
   * @return {Object} representation of the complete request with response.
   */
Blast.Bluetooth.gatt_writeWithResponse = async function(
    id, serviceUUID, characteristicUUID, value) {
  const characteristic = await Blast.Bluetooth.getCharacteristic(
      id, serviceUUID, characteristicUUID,
  );
  if (!characteristic) {
    return;
  }
     
  // If value is a string, convert it to an ArrayBuffer.
  if (typeof value === 'string') {
    Blast.Ui.addToLog(`Converting string ${value} to ArrayBuffer`);
    value = hexStringToArrayBuffer(value);
    Blast.Ui.addToLog(`Converted to ArrayBuffer ${value}`);
  }
 
  try {
    Blast.Ui.addToLog(
        `Invoke WriteValueWithResponse on characteristic ${characteristic}` +
         ` of device ${id} with value ${value}`);
    await characteristic.writeValueWithResponse(value);
    Blast.Ui.addToLog(
        `Finished WriteValueWithResponse on characteristic ${characteristic}` +
         ` of device ${id} with value ${value}`);
  } catch (error) {
    const errorMsg = 'Error writing to Bluetooth device.\nMake sure the device is compatible with the connected block.';
    console.error(error);
    Blast.throwError(errorMsg);
  }
};
 
/**
  * Returns a promise to the primary BluetoothRemoteGATTService offered by
  * the bluetooth device for a specified BluetoothServiceUUID.
  * @param {string} id identifier of the device to get the service from.
  * @param {ServiceUUID} serviceUUID identifier of the service.
  * @returns {Promise<BluetoothRemoteGATT>} A BluetoothRemoteGATTService object.
  */
Blast.Bluetooth.getPrimaryService = async function(id, serviceUUID) {
  const server = await Blast.Bluetooth.connect(id);
  let service;
  try {
    Blast.Ui.addToLog(`Getting primary service ${serviceUUID} from device ${id}`);
    service = await server.getPrimaryService(serviceUUID);
    Blast.Ui.addToLog(`Got primary service ${serviceUUID} from device ${id}`);
  } catch (error) {
    console.error(error);
    Blast.throwError('The device is not compatible with the connected block.');
  }
  return service;
};
 
/**
 * Returns a promise to the BluetoothRemoteGATTCharacteristic offered by
 * the bluetooth device for a specified BluetoothServiceUUID and
 * BluetoothCharacteristicUUID.
 * @param {string} id identifier of the device to get the characteristic from.
 * @param {ServiceUUID} serviceUUID identifier of the service.
 * @param {CharacteristicUUID} characteristicUUID identifier of the characteristic.
 * @returns {Promise<BluetoothRemoteGATTCharacteristic>} A BluetoothRemoteGATTCharacteristic object.
 */
Blast.Bluetooth.getCharacteristic = async function(id, serviceUUID, characteristicUUID) {
  const service = await Blast.Bluetooth.getPrimaryService(id, serviceUUID);
  if (!service) {
    return;
  }
  let characteristic;
  try {
    Blast.Ui.addToLog(
        `Getting characteristic ${characteristicUUID} from service ${serviceUUID} of device ${id}`);
    characteristic = await service.getCharacteristic(characteristicUUID);
    Blast.Ui.addToLog(
        `Got characteristic ${characteristicUUID} from service ${serviceUUID} of device ${id}`);
  } catch (error) {
    console.error(error);
    Blast.throwError('The device is not compatible with the connected block.');
  }
  return characteristic;
};
 
/**
  * Reads data from Bluetooth device using the gatt protocol.
  * @param {string} id identifier of the device to read from.
  * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
  * @param {BluetoothCharacteristicUUID} characteristicUUID identifier of the characteristic.
  * @return {Object} representation of the complete request with response.
  * @public
  */
Blast.Bluetooth.gatt_read = async function(id, serviceUUID, characteristicUUID) {
  const characteristic = await Blast.Bluetooth.getCharacteristic(
      id,
      serviceUUID,
      characteristicUUID,
  );
  try {
    Blast.Ui.addToLog(
        `Invoke ReadValue on characteristic ${characteristic}` +
         ` from service ${serviceUUID} of device ${id}`);
    const value = await characteristic.readValue();
    Blast.Ui.addToLog(
        `Finished ReadValue on characteristic ${characteristic}` +
         ` from service ${serviceUUID} of device ${id} - value: ${value}`);
    return value;
  } catch (error) {
    console.error(error);
    Blast.throwError(`Error reading from Bluetooth device ${id}`);
  }
};
 
/**
  * Reads a text (UTF-8) characteristic value from a Bluetooth device.
  * @param {string} id identifier of the device to read from.
  * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
  * @param {BluetoothCharacteristicUUID} characteristicUUID identifier of the characteristic.
  * @return {string} the value of the characteristic.
  * @public
  */
Blast.Bluetooth.gatt_read_text = async function(id, serviceUUID, characteristicUUID) {
  const value = await Blast.Bluetooth.gatt_read(id, serviceUUID, characteristicUUID);
  Blast.Ui.addToLog(`Converting ArrayBuffer ${value} to string`);
  const stringValue = new TextDecoder().decode(value);
  Blast.Ui.addToLog(`Converted to string ${stringValue}`);
  return stringValue;
};
 
/**
  * Reads a nummerical characteristic value from a Bluetooth device.
  * @param {string} id identifier of the device to read from.
  * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
  * @param {BluetoothCharacteristicUUID} characteristicUUID identifier of the characteristic.
  * @returns {number} the value of the characteristic.
  * @public
  */
Blast.Bluetooth.gatt_read_number = async function(id, serviceUUID, characteristicUUID) {
  let dataView = await Blast.Bluetooth.gatt_read(id, serviceUUID, characteristicUUID);
  // If value is not a DataView already, convert it.
  if (!(dataView instanceof DataView)) {
    dataView = new DataView(value);
  }
  Blast.Ui.addToLog(`Converting ArrayBuffer ${dataView} to number`);
  const arr = new Uint8Array(dataView.buffer);
  const length = arr.length;
  const arrayBuffer = buffer.Buffer.from(arr);
  const result = arrayBuffer.readUIntBE(0, length);
  Blast.Ui.addToLog(`Converted to number ${result}`);
 
  return result;
};
 
/** Reads a hexadecimal characteristic value from a Bluetooth device.
  * @param {string} id identifier of the device to read from.
  * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
  * @param {BluetoothCharacteristicUUID} characteristicUUID identifier of the characteristic.
  * @returns {string} the value of the characteristic.
  * @public
  */
Blast.Bluetooth.gatt_read_hex = async function(id, serviceUUID, characteristicUUID) {
  const value = await Blast.Bluetooth.gatt_read(id, serviceUUID, characteristicUUID);
  Blast.Ui.addToLog(`Converting ArrayBuffer ${value} to hex`);
  const hexValue = new Uint8Array(value.buffer).reduce((acc, byte) => {
    return acc + ('0' + byte.toString(16)).slice(-2);
  }, '');
  Blast.Ui.addToLog(`Converted to hex ${hexValue}`);
  return hexValue;
};
 
/**
  * Subscribes to a Bluetooth characteristic and adds an event listener.
  * @param {string} id identifier of the device to read from.
  * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
  * @param {BluetoothCharacteristicUUID} charUUID identifier of the characteristic.
  * @param {Function} handler handler to register for notifications.
  */
Blast.Bluetooth.gatt_subscribe = async function(id, serviceUUID, charUUID, handler) {
  const characteristic = await Blast.Bluetooth.getCharacteristic(
      id, serviceUUID, charUUID,
  );
  Blast.Ui.addToLog(
      `Add 'characteristicvaluechanged' listener to characteristic ${charUUID}` +
       ` of service ${serviceUUID} of device ${id}`);
  characteristic.addEventListener('characteristicvaluechanged', handler);
  // add the event to the list of events.
  Blast.Bluetooth.charEventListeners[charUUID] = [characteristic, 'characteristicvaluechanged', handler];
  try {
    Blast.Ui.addToLog(
        `Invoke startNotifications on characteristic ${charUUID}` +
         ` from service ${serviceUUID} of device ${id}`);
    await characteristic.startNotifications();
    Blast.Ui.addToLog(
        `Finished startNotifications on characteristic ${charUUID}` +
         ` from service ${serviceUUID} of device ${id}`);
  } catch (error) {
    console.error(error);
    Blast.throwError(`Error subscribing to Bluetooth device ${id}`);
  }
};
 
/** Start the LE Scan.
  * public
  */
Blast.Bluetooth.startLEScan = async function() {
  // If the LE Scan is already running, do nothing.
  if (Blast.Bluetooth.isLEScanRunning) {
    return;
  }
  // If the LE Scan is not running, register the cache handler and start it.
  Blast.Bluetooth.cacheLEScanResults();
  Blast.Bluetooth.isLEScanRunning = true;
  Blast.Ui.addToLog('Requesting LE Scan');
  Blockly.alert('Please click allow on the LE Scan prompt now, then close this dialog.',
      navigator.bluetooth.requestLEScan(
          {acceptAllAdvertisements: true, keepRepeatedDevices: true},
      ),
  );
  // Stop scan after 30 seconds.
  setTimeout(Blast.Bluetooth.stopLEScan, 30000);
};
 
/**
  * Stops the BLE Scan.
  * @public
  */
Blast.Bluetooth.stopLEScan = function() {
  if (Blast.Bluetooth.isLEScanRunning) {
    Blast.Ui.addToLog('Stopping LE Scan');
    navigator.bluetooth.stopLEScan();
    Blast.Bluetooth.isLEScanRunning = false;
  }
};
 
/**
  * Caches the results of a LE Scan.
  */
Blast.Bluetooth.cacheLEScanResults = function() {
  // Cache the results of the scan.
  const handler = function(event) {
    const device = event.device;
    const deviceId = device.id;
    if (!Blast.Bluetooth.LEScanResults[deviceId]) {
      Blast.Bluetooth.LEScanResults[deviceId] = [];
    }
    Blast.Bluetooth.LEScanResults[deviceId].unshift(event);
  };
  // Register the event handler.
  Blast.Bluetooth.addEventListener('advertisementreceived', handler);
};
 
/**
  * Adds a webBluetooth eventListener.
  * @param {string} event the event to add the listener to.
  * @param {function} listener the listener to add.
  */
Blast.Bluetooth.addEventListener = function(event, listener) {
  Blast.Bluetooth.eventListeners.push([event, listener]);
  navigator.bluetooth.addEventListener(event, listener);
};
 
/**
  * Removes a webBluetooth eventListener.
  * @param {string} event the event to remove the listener from.
  * @param {function} listener the listener to remove.
  * @public
  */
Blast.Bluetooth.removeEventListener = function(event, listener) {
  const index = Blast.Bluetooth.eventListeners.findIndex(function(element) {
    return element[0] === event && element[1] === listener;
  });
  if (index !== -1) {
    Blast.Bluetooth.eventListeners.splice(index, 1);
  }
  navigator.bluetooth.removeEventListener(event, listener);
};
 
/**
  * Removes webBluetooth eventListeners and deletes cached advertisements.
  */
Blast.Bluetooth.tearDown = function() {
  Blast.Ui.addToLog('Tearing down webBluetooth');
  // Reset running scan flag
  if (Blast.Bluetooth.isLEScanRunning) {
    Blast.Bluetooth.isLEScanRunning = false;
  }
  // Remove all event handlers.
  if (Blast.Bluetooth.eventListeners) {
    for (const event of Blast.Bluetooth.eventListeners) {
      Blast.Bluetooth.removeEventListener(event[0], event[1]);
    }
    // Reset event listeners.
    Blast.Bluetooth.eventListeners = [];
  }
  if (Blast.Bluetooth.charEventListeners) {
    for (const characteristicUUID of Object.keys(Blast.Bluetooth.charEventListeners)) {
      const triple = Blast.Bluetooth.charEventListeners[characteristicUUID];
      const characteristic = triple[0];
      const event = triple[1];
      const handler = triple[2];
      characteristic.stopNotifications();
      characteristic.removeEventListener(event, handler);
    }
    // Reset event listeners.
    Blast.Bluetooth.charEventListeners = {};
  }
  // Clear cached advertisements.
  Blast.Bluetooth.LEScanResults = {};
};
