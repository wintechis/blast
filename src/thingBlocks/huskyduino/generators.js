/**
 * @fileoverview Generates JavaScript of the HuskyDuino blocks, see
 * (https://github.com/wintechis/huskyduino) for the interface specification.
 * @author yongxu.ren1996@gmail.com
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
import {asyncApiFunctions, getWorkspace} from './../../blast_interpreter.js';
// eslint-disable-next-line node/no-missing-import
import {readableStreamToString, stringToReadable} from '../../things/bindings/binding-helpers.js';

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

/**
 * Write the choosen algorithm value to Huskyduino via bluetooth
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @param {String} value represents the algorithm, ranges from 1 to 7.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const chooseAlgo = async function (blockId, value, callback) {
  // Get thing instance of block.
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Write face id to thing.
  const valueReadable = stringToReadable(value);
  await thing.writeProperty('algorithm', valueReadable);
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
  // Get thing instance of block.
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Write face id to thing.
  const valueReadable = stringToReadable(value);
  await thing.writeProperty('id', valueReadable);
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
  // Get thing instance of block.
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // invoke action.
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
  // Get thing instance of block.
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Read property data
  const interActionInput = await thing.readProperty('id');
  const value = await readableStreamToString(interActionInput.content.body);
  callback(value);
};

asyncApiFunctions.push(['readID', readID]);
