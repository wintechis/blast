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
 * Returns a paired bluetooth device by their id.
 * @param {string} id identifier of the device to get.
 * @returns {BluetoothDevice} the bluetooth device with id.
 */
Blast.Bluetooth.getDeviceById = async function(id) {
  const devices = await navigator.bluetooth.getDevices();
  for (const device of devices) {
    if (device.id == id) {
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
    return await device.gatt.connect();
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
    return await device.gatt.disconnect();
  } catch (error) {
    Blast.throwError(`Error disconnecting from Bluetooth device ${id}`);
    console.error(error);
  }
};
 
/**
  * Writes data to Bluetooth device using the gatt protocol.
  * @param {string} id identifier of the device to disconnect from.
  * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
  * @param {BluetoothCharacteristicUUID} characteristcUUID identifier of the characteristic.
  * @param {string} value hex value to write.
  */
Blast.Bluetooth.gatt_writeWithoutResponse = async function(
    id, serviceUUID, characteristcUUID, value) {
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
      console.log('WARNING: expecting an even number of characters in the hexString');
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
  const server = await Blast.Bluetooth.connect(id, serviceUUID);
  const service = await server.getPrimaryService(serviceUUID);
  const characteristic = await service.getCharacteristic(characteristcUUID);
  value = hexStringToArrayBuffer(value);
  await characteristic.writeValueWithoutResponse(value);
};

/**
 * Reads data from Bluetooth device using the gatt protocol.
 * @param {string} id identifier of the device to disconnect from.
 * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
 * @param {BluetoothCharacteristicUUID} characteristcUUID identifier of the characteristic.
 * @return {Object} representation of the complete request with response.
 * @public
 */
Blast.Bluetooth.gatt_read = async function(id, serviceUUID, characteristcUUID) {
  try {
    const server = await Blast.Bluetooth.connect(id, serviceUUID);
    const service = await server.getPrimaryService(serviceUUID);
    const characteristic = await service.getCharacteristic(characteristcUUID);
    return await characteristic.readValue();
  } catch (error) {
    Blast.throwError(`Error reading from Bluetooth device ${id}`);
    console.error(error);
  }
};

/**
 * Starts scan for BLE advertisements.
 */
Blast.Bluetooth.startLEScan = async function() {
  navigator.bluetooth.requestLEScan(
      {acceptAllAdvertisements: true, keepRepeatedDevices: true},
  );
};

/**
 * Checks if any of the blocks in {@link Blast.Bluetooth.scanBlocks}
 * is in the workspace and no scan is currently running, if so, starts a BLE Scan.
 */
Blast.Bluetooth.checkForLEScan = function() {
  console.log('foo');
  // If no scan is currently running
  if (!Blast.Bluetooth.isLEScanRunning) {
    // And if any of the blocks in scanBlocks is in the workspace,
    for (const block of Blast.Bluetooth.scanBlocks) {
      const isInWorkspace = Blast.workspace.getBlocksByType(block).length > 0;
      if (isInWorkspace) {
        // Start a BLE Scan
        Blast.Bluetooth.startLEScan();
        Blast.Bluetooth.isLEScanRunning = true;
        // And break out of the loop
        return;
      }
    }
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
    Blast.Bluetooth.LEScanResults[deviceId] = event;
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
  navigator.bluetooth.addEventListener(event, listener);
};
