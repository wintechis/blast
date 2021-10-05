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
 * Stores all event handlers for the LE Scan as tuples of event and handler.
 * @private
 */
Blast.Bluetooth.eventListeners = [];

/**
 * Pairs a Bluetooth device.
 * @param {Object} options An object that sets options for the device request.
 * @param {Array<BluetoothScanFilters>} options.filters An array of BluetoothScanFilters.
 * @param {boolean} options.optionalServices An array of BluetoothServiceUUIDs.
 * @param {boolean} [options.acceptAllDevices=false] whether script accepts all Bluetooth devices.
 * @return {Promise<BluetoothDevice>} A Promise to a BluetoothDevice object.
 */
Blast.Bluetooth.requestDevice = async function(options) {
  if (navigator.bluetooth) {
    // if no options are given, use default ones
    if (!options) {
      options = {};
      options.acceptAllDevices = true;
      options.optionalServices = Blast.Bluetooth.optionalServices;
    }

    navigator.bluetooth.requestDevice(options)
        .then((device) => {
          Blast.Things.addWebBluetoothDevice(device.id, device.name);
          Blast.workspace.refreshToolboxSelection();
          return (device);
        })
        .catch((error) => {
          Blast.throwError(error);
        });
  }
};

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
  // Reset running scan flag
  if (Blast.Bluetooth.isLEScanRunning) {
    Blast.Bluetooth.isLEScanRunning = false;
  }
  // Remove all event handlers.
  if (Blast.Bluetooth.eventListeners) {
    for (const event of Blast.Bluetooth.eventListeners) {
      Blast.Bluetooth.removeEventListener(event[0], event[1]);
    }
  }
  // Clear cached advertisements.
  Blast.Bluetooth.LEScanResults = {};
};
