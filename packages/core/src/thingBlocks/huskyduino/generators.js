/**
 * @fileoverview Generates JavaScript of the HuskyDuino blocks, see
 * (https://github.com/wintechis/huskyduino) for the interface specification.
 * @author yongxu.ren1996@gmail.com
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import {getWorkspace, throwError} from './../../blast_interpreter.js';
import {ProtocolHelpers} from '@node-wot/core';

/**
 * Generates JavaScript code for the things_HuskyDuino block.
 * @param {Blockly.Block} block the things_HuskyDuino block.
 * @returns {String} the generated code.
 */
JavaScript['things_HuskyDuino'] = function (block) {
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
  if (block.getInputTargetBlock('Thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('Thing').id);
  }

  const code = `huskyduino_chooseAlgo(${blockId}, '${value}');\n`;
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
  if (block.getInputTargetBlock('Thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('Thing').id);
  }

  const code = `huskyduino_learnID(${blockId}, '${id}');\n`;
  return code;
};

/**
 * Generate JavaScript code for the huskylens_write_forget_flag block.
 * @param {Blockly.Block} block the huskylens_write_forget_flag block
 * @returns {String} the generated JavaScript code
 */
JavaScript['huskylens_write_forget_flag'] = function (block) {
  let blockId = "''";
  if (block.getInputTargetBlock('Thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('Thing').id);
  }

  const code = `huskyduino_forgetAll(${blockId});\n`;
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
  if (block.getInputTargetBlock('Thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('Thing').id);
  }
  // Assemble JavaScript into code variable.
  const code = `huskyduino_readID(${blockId}, ${thing})`;
  // Return code.
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Generate JavaScript code for the huskylens_read_location block.
 * @param {Blockly.Block} block the huskylens_read_location block
 * @returns {String} the generated JavaScript code
 */
JavaScript['huskylens_read_location'] = function (block) {
  const thing = JavaScript.valueToCode(block, 'Thing', JavaScript.ORDER_ATOMIC);
  let blockId = "''";
  if (block.getInputTargetBlock('Thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('Thing').id);
  }
  // Assemble JavaScript into code variable.
  const str = `huskyduino_readLoc(${blockId}, ${thing})`;
  return [str, JavaScript.ORDER_NONE];
};

/**
 * Write the choosen algorithm value to Huskyduino via bluetooth
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @param {String} value represents the algorithm, ranges from 1 to 7.
 */
globalThis['huskyduino_chooseAlgo'] = async function (blockId, value) {
  // Get thing instance of block.
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Write face id to thing.
  await thing.writeProperty('algorithm', value);
};

/**
 * write face id value to Huskyduino via bluetooth
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @param {String} value faceID to write to the Huskyduino.
 */
globalThis['huskyduino_learnID'] = async function (blockId, value) {
  // Get thing instance of block.
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Write face id to thing.
  await thing.writeProperty('id', value);
};

/**
 * write forget flag to Huskyduino via bluetooth
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @param {String} flag whether to forget all saved values or not.
 */
globalThis['huskyduino_forgetAll'] = async function (blockId) {
  // Get thing instance of block.
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // invoke action.
  await thing.invokeAction('forgetAll');
};

/**
 * read the face IDs of all known faces currently visible to the camera via bluetooth.
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @returns {Array<Number>} contains all known IDs currently visible to the camera.
 */
globalThis['huskyduino_readID'] = async function (blockId) {
  // Get thing instance of block.
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Read property data
  const interActionInput = await thing.readProperty('id');
  const str = await ProtocolHelpers.readStreamFully(
    interActionInput.content.body
  );
  if (str[0] === '[') {
    const arr = JSON.parse(str);
    // output is all non 0 element in the array
    const outArr = [];
    arr.forEach(item => {
      if (item !== 0) {
        outArr.push(parseInt(item));
      }
    });
    if (outArr.length === 0) {
      throwError('No Recognized Obj');
    }
    return outArr;
  } else if (str[0] === '0') {
    throwError('No Recognized Obj');
  } else if (str[0] >= 1 && str[0] <= 9) {
    const loc = str.indexOf('(');
    const id = parseInt(str.slice(0, loc));
    return [id];
  } else {
    throwError(str);
  }
};

/**
 * read the ID and its x y location on display of the object currently visible to the camera.
 * @param {String} thing identifier of the Huskyduino.
 * @returns {Array<Number>} contains ID and location of the object currently visible to the camera.
 */
globalThis['huskyduino_outArrreadLoc'] = async function (blockId) {
  // Get thing instance of block.
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Read property data
  const interActionInput = await thing.readProperty('id');
  const str = await ProtocolHelpers.readStreamFully(
    interActionInput.content.body
  );

  if (str[0] === '[') {
    throwError('Recognized Multi Objs');
  } else if (str[0] === '0') {
    throwError('No Recognized Obj');
  } else if (str[0] >= 1 && str[0] <= 9) {
    const loc1 = str.indexOf('(');
    const loc2 = str.indexOf(',');
    const loc3 = str.indexOf(')');
    const id = parseInt(str.slice(0, loc1));
    const x = parseInt(str.slice(loc1 + 1, loc2));
    const y = parseInt(str.slice(loc2 + 1, loc3));
    return [id, x, y];
  } else {
    throwError(str);
  }
};
