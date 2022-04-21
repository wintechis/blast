/**
 * @fileoverview JavaScript code generators for the Xiaomi Mijia thermometer.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
import {asyncApiFunctions, getWorkspace} from './../../blast_interpreter.js';
import {throwError} from './../../blast_interpreter.js';

/**
 * Generates JavaScript code for the things_xiaomiThermometer block.
 * @param {Blockly.Block} block the things_xiaomiThermometer block.
 * @returns {String} the generated code.
 */
JavaScript['things_xiaomiThermometer'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the get_mijia_property block.
 * @param {Blockly.Block} block the get_temperature block.
 * @returns {String} the generated code.
 */
JavaScript['read_mijia_property'] = function (block) {
  const measurement = JavaScript.quote_(block.getFieldValue('measurement'));
  const thing = JavaScript.valueToCode(block, 'Thing', JavaScript.ORDER_ATOMIC);
  let blockId = "''";
  if (block.getInputTargetBlock('Thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('Thing').id);
  }
  const code = `readMijiaProperty(${blockId}, ${measurement}, ${thing})`;

  return [code, JavaScript.ORDER_NONE];
};

/**
 * Fetches the selected measurement from a RuuviTag.
 * @param {Blockly.Block.id} blockId the things_xiaomiThermometer block's id.
 * @param {String} measurement the measurement to fetch.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a RuuviTag.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const readMijiaProperty = async function (
  blockId,
  measurement,
  webBluetoothId,
  callback
) {
  // make sure a device is connected.
  if (!webBluetoothId) {
    throwError('No Thermometer is set.');
    callback();
    return;
  }
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  const value = await thing.readProperty(measurement);
  callback(value);
};

// add readMijiaProperty to the interpreter's API.
asyncApiFunctions.push(['readMijiaProperty', readMijiaProperty]);
