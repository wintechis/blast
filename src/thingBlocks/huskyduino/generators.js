/**
 * @fileoverview Generates JavaScript of the HuskyDuino blocks, see
 * (https://github.com/wintechis/huskyduino) for the interface specification.
 * @author yongxu.ren1996@gmail.com
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
import {asyncApiFunctions, getWorkspace} from './../../blast_interpreter.js';
import {
  optionalServices,
  readText,
  writeWithoutResponse,
} from './../../blast_webBluetooth.js';

/**
 * Generates JavaScript code for the things_huskylens block.
 * @param {Blockly.Block} block the things_huskylens block.
 * @returns {String} the generated code.
 */
JavaScript['things_huskylens'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generate JavaScript code of the huskylens_choose_algo block.
 * @param {Blockly.Block} block the huskylens_choose_algo block
 * @returns {String} the generated JavaScript code
 */
JavaScript['huskylens_choose_algo'] = function (block) {
  const algorithm = block.getFieldValue('Algorithms');
  const dict = {
    face_recognition: '0x01',
    object_tracking: '0x02',
    object_recognition: '0x03',
    line_tracking: '0x04',
    color_recognition: '0x05',
    tag_recognition: '0x06',
    object_classification: '0x07',
  };
  const value = dict[algorithm];
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `chooseAlgo(${blockId}, '${value}');\n`;
  return code;
};

/**
 * Generate JavaScript code for the huskylens_write_face_id block.
 * @param {Blockly.Block} block the huskylens_write_face_id block
 * @returns {String} the generated JavaScript code
 */
JavaScript['huskylens_write_id'] = function (block) {
  const input = JavaScript.valueToCode(block, 'ID', JavaScript.ORDER_ATOMIC);
  const id = '0x' + parseInt(input).toString(16);
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `learnID(${blockId}, '${id}');\n`;
  return code;
};

/**
 * Generate JavaScript code for the huskylens_write_forget_flag block.
 * @param {Blockly.Block} block the huskylens_write_forget_flag block
 * @returns {String} the generated JavaScript code
 */
JavaScript['huskylens_write_forget_flag'] = function (block) {
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `forgetAll(${blockId});\n`;
  return code;
};

/**
 * Generate JavaScript code for the huskylens_read_id block.
 * @param {Blockly.Block} block the huskylens_read_id block
 * @returns {String} the generated JavaScript code
 */
JavaScript['huskylens_read_id'] = function (block) {
  const thing = JavaScript.valueToCode(block, 'Thing', JavaScript.ORDER_ATOMIC);
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }
  // Assemble JavaScript into code variable.
  const code = `readID(${blockId}, ${thing})`;
  // Return code.
  return [code, JavaScript.ORDER_NONE];
};

// set the service UUID here， for all characteristics
const HuskyServiceUUID = '5be35d20-f9b0-11eb-9a03-0242ac130003';
optionalServices.push(HuskyServiceUUID);

/**
 * Write the choosen algorithm value to Huskyduino via bluetooth
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @param {String} value represents the algorithm, ranges from 1 to 7.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const chooseAlgo = async function (blockId, value, callback) {
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  await thing.writeProperty('algorithm', value);
  callback();
};

asyncApiFunctions.push(['chooseAlgo', chooseAlgo]);

/**
 * write face id value to Huskyduino via bluetooth
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @param {String} value faceID to write to the Huskyduino.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const learnID = async function (blockId, value, callback) {
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  await thing.writeProperty('id', value);
  callback();
};

asyncApiFunctions.push(['learnID', learnID]);

/**
 * write forget flag to Huskyduino via bluetooth
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @param {String} flag whether to forget all saved values or not.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const forgetAll = async function (blockId, callback) {
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  await thing.invokeAction('forgetAll');
  callback();
};

asyncApiFunctions.push(['forgetAll', forgetAll]);

/**
 * read the face IDs of all known faces currently visible to the camera via bluetooth.
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @returns {String} contains all known faceIDs currently visible to the camera.
 */
const readID = async function (blockId, callback) {
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  await thing.readProperty('id');
  callback();
};

asyncApiFunctions.push(['readID', readID]);
