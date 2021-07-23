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
    const device = await Blast.Bluetooth.getDevices(id);
    const server = await device.gatt.connect();
    return server;
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
    const device = await Blast.Bluetooth.getDevices(id);
    await device.gatt.disconnect();
    return;
  } catch (error) {
    Blast.throwError(`Error disconnecting from Bluetooth device ${id}`);
    console.error(error);
  }
};
 
/**
  * Writes data from Bluetooth device using the gatt protocol.
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
  return;
};
