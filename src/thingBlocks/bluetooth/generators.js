/**
 * @fileoverview Javascript generators for (generic) bluetooth blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
import {asyncApiFunctions} from './../../blast_interpreter.js';
import {optionalServices, readText} from './../../blast_webBluetooth.js';
import {throwError} from './../../blast_interpreter.js';
// eslint-disable-next-line node/no-missing-import
import {EddystoneDevice} from './../../things/eddystone/EddystoneDevice.js';

/**
 * Generates JavaScript code for the get_signal_strength block.
 * @param {Blockly.Block} block the get_signal_strength block.
 * @returns {String} the generated code.
 */
JavaScript['get_signal_strength_wb'] = function (block) {
  const thing = JavaScript.valueToCode(block, 'Thing', JavaScript.ORDER_NONE);
  const code = `getRSSIWb(${thing})`;

  return [code, JavaScript.ORDER_NONE];
};

/**
 * Get the RSSI of a bluetooth device, using webBluetooth.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const getRSSIWb = async function (webBluetoothId, callback) {
  const devices = await navigator.bluetooth.getDevices();
  let device = null;

  for (const d of devices) {
    if (d.id === webBluetoothId) {
      device = d;
      break;
    }
  }
  if (device === null) {
    throwError('Error pairing with Bluetooth device.');
  }

  // eslint-disable-next-line no-undef
  const abortController = new AbortController();

  device.addEventListener('advertisementreceived', async evt => {
    // Stop watching advertisements
    abortController.abort();
    // Advertisement data can be read from |evt|.
    callback(evt.rssi);
  });

  await device.watchAdvertisements({signal: abortController.signal});
};
// add getRSSIWb method to the interpreter's API.
asyncApiFunctions.push(['getRSSIWb', getRSSIWb]);

/**
 * Generates JavaScript code for the write_eddystone_property block.
 * @param {Blockly.Block} block the get_signal_strength block.
 * @returns {String} the generated code.
 */
JavaScript['write_eddystone_property'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'Thing', JavaScript.ORDER_NONE) || null;
  const property = JavaScript.quote_(block.getFieldValue('Property'));
  const slot =
    JavaScript.valueToCode(block, 'Slot', JavaScript.ORDER_NONE) || null;
  const value =
    JavaScript.valueToCode(block, 'Value', JavaScript.ORDER_NONE) || null;

  const code = `writeEddystoneProperty(${thing}, ${slot}, ${property}, ${value});\n`;
  return code;
};

const eddystoneServiceUUID = 'a3c87500-8ed3-4bdf-8a39-a01bebede295';
optionalServices.push(eddystoneServiceUUID);

/**
 * Writes an Eddystone property to a bluetooth device.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} slot The slot to write to.
 * @param {String} property The property to write.
 * @param {String} value The value to write.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const writeEddystoneProperty = async function (
  webBluetoothId,
  slot,
  property,
  value,
  callback
) {
  // make sure a device block is connected
  if (!webBluetoothId) {
    throwError('No bluetooth device set.');
    callback();
    return;
  }

  // make sure a slot is set
  if (slot === null || slot === undefined) {
    throwError('No slot set.');
    callback();
    return;
  }

  // make sure a property is set
  if (!property) {
    throwError('No property set.');
    callback();
    return;
  }

  const device = new EddystoneDevice(webBluetoothId);
  await device.writeProperty(property, value, slot);

  callback();
};

// add writeEddystoneProperty method to the interpreter's API.
asyncApiFunctions.push(['writeEddystoneProperty', writeEddystoneProperty]);

/**
 * Generates JavaScript code for the read_eddystone_property block.
 * @param {Blockly.Block} block the get_signal_strength block.
 * @returns {String} the generated code.
 */
JavaScript['read_eddystone_property'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'Thing', JavaScript.ORDER_NONE) || null;
  const property = JavaScript.quote_(block.getFieldValue('Property'));
  const slot =
    JavaScript.valueToCode(block, 'Slot', JavaScript.ORDER_NONE) || null;
  const code = `readEddystoneProperty(${thing}, ${slot}, ${property})`;

  return [code, JavaScript.ORDER_NONE];
};

/**
 * Reads an Eddystone property from a bluetooth device.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} slot The slot to read from.
 * @param {String} property The property to read.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const readEddystoneProperty = async function (
  webBluetoothId,
  slot,
  property,
  callback
) {
  // make sure a device block is connected
  if (!webBluetoothId) {
    throwError('No bluetooth device set.');
    callback();
    return;
  }

  // make sure a slot is set
  if (slot === null || slot === undefined) {
    throwError('No slot set.');
    callback();
    return;
  }

  // make sure a property is set
  if (!property) {
    throwError('No property set.');
    callback();
    return;
  }

  const device = new EddystoneDevice(webBluetoothId);
  const value = await device.readProperty(property, slot);

  callback(value);
};

// Add readEddystoneProperty method to the interpreter's API.
asyncApiFunctions.push(['readEddystoneProperty', readEddystoneProperty]);

/**
 * Generates JavaScript code for the read_bluetooth_service block.
 * @param {Blockly.Block} block the read_bluetooth_service block.
 * @returns {String} the generated code.
 */
JavaScript['read_gatt_characteristic'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'Thing', JavaScript.ORDER_NONE) || null;
  const characteristic = JavaScript.quote_(
    block.getFieldValue('characteristic')
  );
  const code = `readBluetoothService(${thing}, ${characteristic})`;

  return [code, JavaScript.ORDER_NONE];
};

const characteristics = {
  barometricPressureTrend: {
    service: '00001802-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a1c-0000-1000-8000-00805f9b34fb',
  },
  batteryLevel: {
    service: '0000180f-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a19-0000-1000-8000-00805f9b34fb',
  },
  deviceName: {
    service: '00001800-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a00-0000-1000-8000-00805f9b34fb',
  },
  elevation: {
    service: '00001803-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a6c-0000-1000-8000-00805f9b34fb',
  },
  firmwareRevision: {
    service: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a26-0000-1000-8000-00805f9b34fb',
  },
  hardwareRevision: {
    service: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a27-0000-1000-8000-00805f9b34fb',
  },
  humidity: {
    service: '00001803-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a6f-0000-1000-8000-00805f9b34fb',
  },
  irradiance: {
    service: '00001803-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a77-0000-1000-8000-00805f9b34fb',
  },
  intermediateTemperature: {
    service: '00001809-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a1e-0000-1000-8000-00805f9b34fb',
  },
  manufacturerName: {
    service: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a29-0000-1000-8000-00805f9b34fb',
  },
  modelNumber: {
    service: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a24-0000-1000-8000-00805f9b34fb',
  },
  movementCounter: {
    service: '00001809-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a56-0000-1000-8000-00805f9b34fb',
  },
  pressure: {
    service: '00001809-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a6d-0000-1000-8000-00805f9b34fb',
  },
  serialNumber: {
    service: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a25-0000-1000-8000-00805f9b34fb',
  },
  softwareRevision: {
    service: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a28-0000-1000-8000-00805f9b34fb',
  },
  temperature: {
    service: '00001809-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a6e-0000-1000-8000-00805f9b34fb',
  },
  temperatureMeasurement: {
    service: '00001809-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a1c-0000-1000-8000-00805f9b34fb',
  },
  temperatureType: {
    service: '00001809-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a1d-0000-1000-8000-00805f9b34fb',
  },
  txPowerLevel: {
    service: '00001804-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a07-0000-1000-8000-00805f9b34fb',
  },
  weight: {
    service: '00001808-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a9d-0000-1000-8000-00805f9b34fb',
  },
};

// Add all services to optionalServices.
for (const characteristic in characteristics) {
  if (!optionalServices.includes(characteristics[characteristic].service)) {
    optionalServices.push(characteristics[characteristic].service);
  }
}

/**
 * Reads a bluetooth characteristic from a bluetooth device.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {String} characteristic The characteristic to read.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const readBluetoothService = async function (
  webBluetoothId,
  characteristic,
  callback
) {
  // make sure a device block is connected
  if (!webBluetoothId) {
    throwError('No bluetooth device set.');
    callback();
    return;
  }

  const value = await readText(
    webBluetoothId,
    characteristics[characteristic].service,
    characteristics[characteristic].characteristic
  );
  callback(value);
};

asyncApiFunctions.push(['readBluetoothService', readBluetoothService]);
