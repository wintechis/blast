/**
 * @fileoverview Javascript generators for (generic) bluetooth blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {asyncApiFunctions} from './../../blast_interpreter.js';
import {getAdvertisedTxPower} from './../../blast_eddystone.js';
import {getAdvertisingData} from './../../blast_eddystone.js';
import {getAdvertisingInterval} from './../../blast_eddystone.js';
import {getLockState} from './../../blast_eddystone.js';
import {getPublicECDHKey} from './../../blast_eddystone.js';
import {getTxPowerLevel} from './../../blast_eddystone.js';
import {optionalServices} from './../../blast_webBluetooth.js';
import {setActiveSlot} from './../../blast_eddystone.js';
import {setAdvertisedTxPower} from './../../blast_eddystone.js';
import {setAdvertisingData} from './../../blast_eddystone.js';
import {setAdvertisingInterval} from './../../blast_eddystone.js';
import {setTxPowerLevel} from './../../blast_eddystone.js';
import {throwError} from './../../blast_interpreter.js';


/**
 * Generates JavaScript code for the get_signal_strength block.
 * @param {Blockly.Block} block the get_signal_strength block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['get_signal_strength_wb'] = function(block) {
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_NONE);
  const code = `getRSSIWb(${thing})`;
  
  return [code, Blockly.JavaScript.ORDER_NONE];
};
  
/**
   * Get the RSSI of a bluetooth device, using webBluetooth.
   * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
   * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
   * @public
   */
const getRSSIWb = async function(webBluetoothId, callback) {
  const devices = await navigator.bluetooth.getDevices();
  let device = null;
  
  for (const d of devices) {
    if (d.id === webBluetoothId) {
      device = d;
      break;
    }
  }
  if (device == null) {
    throwError('Error pairing with Bluetooth device.');
  }
  
  const abortController = new AbortController();
  
  device.addEventListener('advertisementreceived', async(evt) => {
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
Blockly.JavaScript['write_eddystone_property'] = function(block) {
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_NONE) || null;
  const property = Blockly.JavaScript.quote_(block.getFieldValue('Property'));
  const slot = Blockly.JavaScript.valueToCode(
      block,
      'Slot',
      Blockly.JavaScript.ORDER_NONE) || null;
  const value = Blockly.JavaScript.valueToCode(
      block,
      'Value',
      Blockly.JavaScript.ORDER_NONE) || null;
  const frameType = Blockly.JavaScript.quote_(block.getFieldValue('FrameType'));
    
  const code = `writeEddystoneProperty(${thing}, ${slot}, ${property}, ${frameType}, ${value});\n`;
  return code;
};
  
const eddystoneServiceUUID = 'a3c87500-8ed3-4bdf-8a39-a01bebede295';
optionalServices.push(eddystoneServiceUUID);
  
/**
   * Writes an Eddystone property to a bluetooth device.
   * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
   * @param {number} slot The slot to write to.
   * @param {String} property The property to write.
   * @param {String} frameType The eddystone frame type to write.
   * @param {String} value The value to write.
   * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
   */
const writeEddystoneProperty = async function(
    webBluetoothId, slot, property, frameType, value, callback) {
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
    
  // Set the active slot.
  await setActiveSlot(webBluetoothId, slot);
  
  // write the property
  switch (property) {
    case 'advertisedTxPower':
      await setAdvertisedTxPower(webBluetoothId, value);
      break;
    case 'advertisementData':
      await setAdvertisingData(webBluetoothId, frameType, value);
      break;
    case 'advertisingInterval':
      await setAdvertisingInterval(webBluetoothId, value);
      break;
    case 'radioTxPower':
      await setTxPowerLevel(webBluetoothId, value);
      break;
  }
  callback();
};
  
// add writeEddystoneProperty method to the interpreter's API.
asyncApiFunctions.push(['writeEddystoneProperty', writeEddystoneProperty]);
  
/**
   * Generates JavaScript code for the read_eddystone_property block.
   * @param {Blockly.Block} block the get_signal_strength block.
   * @returns {String} the generated code.
   */
Blockly.JavaScript['read_eddystone_property'] = function(block) {
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_NONE) || null;
  const property = Blockly.JavaScript.quote_(block.getFieldValue('Property'));
  const slot = Blockly.JavaScript.valueToCode(
      block,
      'Slot',
      Blockly.JavaScript.ORDER_NONE) || null;
  const code = `readEddystoneProperty(${thing}, ${slot}, ${property})`;
  
  return [code, Blockly.JavaScript.ORDER_NONE];
};
  
/**
   * Reads an Eddystone property from a bluetooth device.
   * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
   * @param {number} slot The slot to read from.
   * @param {String} property The property to read.
   * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
   */
const readEddystoneProperty = async function(webBluetoothId, slot, property, callback) {
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
  
  // Set the active slot.
  await setActiveSlot(webBluetoothId, slot);
  
  // read the property
  let value = null;
  switch (property) {
    case 'advertisedTxPower':
      value = await getAdvertisedTxPower(webBluetoothId);
      break;
    case 'advertisementData':
      value = await getAdvertisingData(webBluetoothId);
      break;
    case 'advertisingInterval':
      value = await getAdvertisingInterval(webBluetoothId);
      break;
    case 'lockState':
      value = await getLockState(webBluetoothId);
      break;
    case 'publicECDHKey':
      value = await getPublicECDHKey(webBluetoothId);
      break;
    case 'radioTxPower':
      value = await getTxPowerLevel(webBluetoothId);
      break;
  }
  callback(value);
};
  
// Add readEddystoneProperty method to the interpreter's API.
asyncApiFunctions.push(['readEddystoneProperty', readEddystoneProperty]);
  
