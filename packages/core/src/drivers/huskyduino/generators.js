/**
 * @fileoverview Generates JavaScript of the HuskyDuino blocks, see
 * (https://github.com/wintechis/huskyduino) for the interface specification.
 * @author yongxu.ren1996@gmail.com
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import {getWorkspace, throwError} from './../../blast_interpreter.js';

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
  const algorithm = JavaScript.quote_(block.getFieldValue('algorithm'));
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `await huskyduino_chooseAlgo(${blockId}, ${algorithm});\n`;
  return code;
};

/**
 * Generate JavaScript code for the huskylens_write_face_id block.
 * @param {Blockly.Block} block the huskylens_write_face_id block
 * @returns {String} the generated JavaScript code
 */
JavaScript['huskylens_write_id'] = function (block) {
  const input =
    JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC) || '0';
  const id = JavaScript.quote_(input);
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `await huskyduino_learnId(${blockId}, ${id});\n`;
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

  const code = `await huskyduino_forgetAll(${blockId});\n`;
  return code;
};

/**
 * Generate JavaScript code for the huskylens_read_id block.
 * @param {Blockly.Block} block the huskylens_read_id block
 * @returns {String} the generated JavaScript code
 */
JavaScript['huskylens_read_id'] = function (block) {
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }
  // Assemble JavaScript into code variable.
  const code = `await huskyduino_readId(${blockId})`;
  // Return code.
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Generate JavaScript code for the huskylens_read_coordinates block.
 * @param {Blockly.Block} block the huskylens_read_coordinates block
 * @returns {String} the generated JavaScript code
 */
JavaScript['huskylens_read_coordinates'] = function (block) {
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }
  // Assemble JavaScript into code variable.
  const str = `await huskyduino_outArrreadLoc(${blockId})`;
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * write face id value to Huskyduino via bluetooth
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @param {String} value faceID to write to the Huskyduino.
 */
globalThis['huskyduino_learnId'] = async function (blockId, value) {
  // Get thing instance of block.
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Write face id to thing.
  await thing.invokeAction('learn', value);
  // Should wait a few seconds -> huskylens needs time to learn
  await sleep(1500);
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
  await thing.invokeAction('forgetAll', 'true');
};

/**
 * read the face IDs of all known faces currently visible to the camera via bluetooth.
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @returns {Array<Number>} contains all known IDs currently visible to the camera.
 */
globalThis['huskyduino_readId'] = async function (blockId) {
  // Get thing instance of block.
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  // Read property data
  const interActionInput = await thing.readProperty('id');
  const value = await interActionInput.value();

  if (value === 'No Block') {
    return 'No Obj recognized';
  } else if (value[0] === '[') {
    const arr = JSON.parse(value);
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
  } else if (value[0] === '0') {
    throwError('No Recognized Obj');
  } else if (value[0] >= 1 && value[0] <= 9) {
    const loc = value.indexOf('(');
    const id = parseInt(value.slice(0, loc));
    return [id];
  } else {
    throwError(value);
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
  const value = await interActionInput.value();

  if (value[0] === '[') {
    throwError('Recognized Multi Objs');
  } else if (value[0] === '0') {
    throwError('No Recognized Obj');
  } else if (value[0] >= 1 && value[0] <= 9) {
    const loc1 = value.indexOf('(');
    const loc2 = value.indexOf(',');
    const loc3 = value.indexOf(')');
    const id = parseInt(value.slice(0, loc1));
    const x = parseInt(value.slice(loc1 + 1, loc2));
    const y = parseInt(value.slice(loc2 + 1, loc3));
    return [id, x, y];
  } else {
    throwError(value);
  }
};
