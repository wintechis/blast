/**
 * @fileoverview Javascript generators for (generic) bluetooth blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
import {
  getDeviceById,
  read,
  writeWithoutResponse,
} from '../../blast_webBluetooth.js';
const {JavaScript} = Blockly;
import {
  stringToReadable,
  readableStreamToString,
  // eslint-disable-next-line node/no-missing-import
} from '../bindings/binding-helpers.js';
import {getWorkspace, throwError} from '../../blast_interpreter.js';

JavaScript['things_eddyStoneDevice'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

JavaScript['things_bluetoothGeneric'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the get_signal_strength block.
 * @param {Blockly.Block} block the get_signal_strength block.
 * @returns {String} the generated code.
 */
JavaScript['bluetoothGeneric_get_signal_strength_wb'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const code = `await getRSSIWb(${thing})`;

  return [code, JavaScript.ORDER_NONE];
};

/**
 * Get the RSSI of a bluetooth device, using webBluetooth.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 */
globalThis['getRSSIWb'] = async function (webBluetoothId) {
  // make sure a device block is connected
  if (!webBluetoothId) {
    throwError('No device connected.');
  }

  return new Promise(resolve => {
    getDeviceById(webBluetoothId).then(device => {
      // eslint-disable-next-line no-undef
      const abortController = new AbortController();

      device.addEventListener('advertisementreceived', event => {
        abortController.abort();
        resolve(event.rssi);
      });
      device.watchAdvertisements({signal: abortController.signal});
    });
  });
};

/**
 * Generates JavaScript code for the eddyStoneDevice_write_eddystone_property block.
 * @param {Blockly.Block} block the get_signal_strength block.
 * @returns {String} the generated code.
 */
JavaScript['eddyStoneDevice_write_eddystone_property'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const property = JavaScript.quote_(block.getFieldValue('property'));
  const slot =
    JavaScript.valueToCode(block, 'slot', JavaScript.ORDER_NONE) || null;
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `await writeEddystoneProperty(${blockId}, ${thing}, ${slot}, ${property}, ${value});\n`;
  return code;
};

/**
 * Writes an Eddystone property to a bluetooth device.
 * @param {Blockly.Block.id} blockId the things_eddyStoneDevice block's id.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} slot The slot to write to.
 * @param {String} property The property to write.
 * @param {String} value The value to write.
 */
globalThis['writeEddystoneProperty'] = async function (
  blockId,
  webBluetoothId,
  slot,
  property,
  value
) {
  // make sure a device block is connected
  if (!webBluetoothId) {
    throwError('No bluetooth device set.');
    return;
  }

  // make sure a slot is set
  if (slot === null || slot === undefined) {
    throwError('No slot set.');
    return;
  }

  // make sure a property is set
  if (!property) {
    throwError('No property set.');
    return;
  }

  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Set the active slot
  await thing.writeProperty('activeSlot', slot);
  // Write the property
  const valueReadable = stringToReadable(value);
  await thing.writeProperty(property, valueReadable);
};

/**
 * Generates JavaScript code for the read_eddystone_property block.
 * @param {Blockly.Block} block the get_signal_strength block.
 * @returns {String} the generated code.
 */
JavaScript['read_eddystone_property'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const property = JavaScript.quote_(block.getFieldValue('property'));
  const slot =
    JavaScript.valueToCode(block, 'slot', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `await readEddystoneProperty(${blockId}, ${thing}, ${slot}, ${property})`;

  return [code, JavaScript.ORDER_NONE];
};

/**
 * Reads an Eddystone property from a bluetooth device.
 * @param {Blockly.Block.id} blockId the things_eddyStoneDevice block's id.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} slot The slot to read from.
 * @param {String} property The property to read.
 */
globalThis['readEddystoneProperty'] = async function (
  blockId,
  webBluetoothId,
  slot,
  property
) {
  // make sure a device block is connected
  if (!webBluetoothId) {
    throwError('No bluetooth device set.');
    return;
  }

  // make sure a slot is set
  if (slot === null || slot === undefined) {
    throwError('No slot set.');
    return;
  }

  // make sure a property is set
  if (!property) {
    throwError('No property set.');
    return;
  }

  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Set the active slot
  await thing.writeProperty('activeSlot', 0);
  // Read property data
  const interActionInput = await thing.readProperty(property);
  const value = await readableStreamToString(interActionInput.content.body);
  return value;
};

/**
 * Generates JavaScript code for the read_gatt_characteristic block.
 * @param {Blockly.Block} block the read_gatt_characteristic block.
 * @returns {String} the generated code.
 */
JavaScript['read_gatt_characteristic'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const characteristic = JavaScript.quote_(
    block.getFieldValue('characteristic')
  );
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }
  const code = `await readBluetoothChar(${blockId}, ${thing}, ${characteristic})`;

  return [code, JavaScript.ORDER_NONE];
};

/**
 * Reads a bluetooth characteristic from a bluetooth device.
 * @param {Blockly.Block.id} blockId the things_eddyStoneDevice block's id.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {String} property The characteristic to read.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
globalThis['readBluetoothChar'] = async function (
  blockId,
  webBluetoothId,
  property
) {
  // make sure a device block is connected
  if (!webBluetoothId) {
    throwError('No bluetooth device set.');
    return;
  }

  // get thing instance of block
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Read property data
  const interActionInput = await thing.readProperty(property);
  const value = await readableStreamToString(interActionInput.content.body);
  return value;
};

JavaScript['write_gatt_characteristic'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const characteristic = JavaScript.quote_(
    block.getFieldValue('characteristic')
  );
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }
  const code = `await writeBluetoothChar(${blockId}, ${thing}, ${characteristic}, ${value});\n`;

  return code;
};

globalThis['writeBluetoothChar'] = async function (
  blockId,
  webBluetoothId,
  property,
  value
) {
  // make sure a device block is connected
  if (!webBluetoothId) {
    throwError('No bluetooth device set.');
    return;
  }

  // get thing instance of block
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Write property data
  const valueReadable = stringToReadable(value);
  await thing.writeProperty(property, valueReadable);
};

JavaScript['read_characteristic'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const characteristic =
    JavaScript.valueToCode(block, 'characteristic', JavaScript.ORDER_NONE) ||
    null;
  const service =
    JavaScript.valueToCode(block, 'service', JavaScript.ORDER_NONE) || null;

  const code = `await readCharacteristicRaw(${thing}, ${service}, ${characteristic})`;

  return [code, JavaScript.ORDER_NONE];
};

globalThis['readCharacteristicRaw'] = async function (
  webBluetoothId,
  service,
  characteristic
) {
  // make sure a device block is connected
  if (!webBluetoothId) {
    throwError('No bluetooth device set.');
    return;
  }

  return await read(webBluetoothId, service, characteristic);
};

JavaScript['write_characteristic'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const characteristic =
    JavaScript.valueToCode(block, 'characteristic', JavaScript.ORDER_NONE) ||
    null;
  const service =
    JavaScript.valueToCode(block, 'service', JavaScript.ORDER_NONE) || null;

  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || null;

  const code = `await writeCharacteristicRaw(${thing}, ${service}, ${characteristic}, ${value});\n`;

  return code;
};

globalThis['writeCharacteristicRaw'] = async function (
  webBluetoothId,
  service,
  characteristic,
  value
) {
  // make sure a device block is connected
  if (!webBluetoothId) {
    throwError('No bluetooth device set.');
    return;
  }

  return await writeWithoutResponse(
    webBluetoothId,
    service,
    characteristic,
    value
  );
};
