/**
 * @fileoverview Generates JavaScript of the HuskyDuino blocks, see
 * (https://github.com/wintechis/huskyduino) for the interface specification.
 * @author yongxu.ren1996@gmail.com
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {asyncApiFunctions} from './../../blast_interpreter.js';
import {optionalServices} from './../../blast_webBluetooth.js';
import {readText} from './../../blast_webBluetooth.js';
import {writeWithoutResponse} from './../../blast_webBluetooth.js';
import {throwError} from './../../blast_interpreter.js';


/**
 * Generate JavaScript code of the huskylens_choose_algo block.
 * @param {Blockly.Block} block the huskylens_choose_algo block
 * @returns {String} the generated JavaScript code
 */
Blockly.JavaScript['huskylens_choose_algo'] = function(block) {
  const algorithm = block.getFieldValue('Algorithms');
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  
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

  const code = `chooseAlgo(${thing}, '${value}');\n`;
  return code;
};


/**
 * Generate JavaScript code for the huskylens_write_face_id block.
 * @param {Blockly.Block} block the huskylens_write_face_id block
 * @returns {String} the generated JavaScript code
 */
Blockly.JavaScript['huskylens_write_id'] = function(block) {
  const input = Blockly.JavaScript.valueToCode(
      block,
      'ID',
      Blockly.JavaScript.ORDER_ATOMIC);
  const id = '0x' + parseInt(input).toString(16);
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  
  const code = `learnID(${thing}, '${id}');\n`;
  return code;
};


/**
 * Generate JavaScript code for the huskylens_write_forget_flag block.
 * @param {Blockly.Block} block the huskylens_write_forget_flag block
 * @returns {String} the generated JavaScript code
 */
Blockly.JavaScript['huskylens_write_forget_flag'] = function(block) {
  const flag = Blockly.JavaScript.valueToCode(
      block,
      'forgetFlag',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC,
  );

  // convert the flag to a byte string.
  const flagByte = flag ? '01' : '00';
  const value = '0x' + flagByte;
  
  const code = `forgetAll(${thing}, '${value}');\n`;
  return code;
};


/**
 * Generate JavaScript code for the huskylens_read_id block.
 * @param {Blockly.Block} block the huskylens_read_id block
 * @returns {String} the generated JavaScript code
 */
Blockly.JavaScript['huskylens_read_id'] = function(block) {
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC);
  
  // Assemble JavaScript into code variable.
  const str = `readID(${thing})`;
  return [str, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Generate JavaScript code for the huskylens_read_id block.
 * @param {Blockly.Block} block the huskylens_read_id block
 * @returns {String} the generated JavaScript code
 */
Blockly.JavaScript['huskylens_read_location'] = function(block) {
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC);
  
  // Assemble JavaScript into code variable.
  const str = `readLoc(${thing})`;
  return [str, Blockly.JavaScript.ORDER_NONE];
};
// set the service UUID here， for all characteristics
const HuskyServiceUUID = '5be35d20-f9b0-11eb-9a03-0242ac130003';
optionalServices.push(HuskyServiceUUID);


/**
 * Write the choosen algorithm value to Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {String} value represents the algorithm, ranges from 1 to 7.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const chooseAlgo = async function(thing, value, callback) {
  const characteristicUUID = '5be35d26-f9b0-11eb-9a03-0242ac130003';

  await writeWithoutResponse(
      thing,
      HuskyServiceUUID,
      characteristicUUID,
      value,
  );
  callback();
};

asyncApiFunctions.push(['chooseAlgo', chooseAlgo]);


/**
 * write face id value to Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {String} id faceID to write to the Huskyduino.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const learnID = async function(thing, id, callback) {
  const characteristicUUID = '5be35eca-f9b0-11eb-9a03-0242ac130003';

  await writeWithoutResponse(
      thing,
      HuskyServiceUUID,
      characteristicUUID,
      id);
  callback();
};

asyncApiFunctions.push(['learnID', learnID]);

/**
 * write forget flag to Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {String} flag whether to forget all saved values or not.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const forgetAll = async function(thing, flag, callback) {
  const characteristicUUID = '5be361b8-f9b0-11eb-9a03-0242ac130003';
    
  await writeWithoutResponse(
      thing,
      HuskyServiceUUID,
      characteristicUUID,
      flag,
  );
  callback();
};

asyncApiFunctions.push(['forgetAll', forgetAll]);

/**
 * read the IDs of all known objects currently visible to the camera via bluetooth.
 * @param {String} thing identifier of the Huskyduino.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @returns {Array} contains all known IDs currently visible to the camera.
 */
const readID = async function(thing, callback) {
  const characteristicUUID = '5be3628a-f9b0-11eb-9a03-0242ac130003';

  const str = await readText(
      thing,
      HuskyServiceUUID,
      characteristicUUID,
  );
  if (str[0] == '[') {
    const arr = JSON.parse(str);
    // output is all non 0 element in the array
    const outArr = [];
    arr.forEach((item) => {
      if (item != 0) {
        outArr.push(parseInt(item));
      }
    });
    if (outArr.length == 0) {
      throwError('No Recognized Obj');
    }
    callback(outArr);
  } else if (str[0] == 0) {
    throwError('No Recognized Obj');
  } else if (str[0] >= 1 && str[0] <= 9) {
    const loc = str.indexOf('(');
    const id = parseInt(str.slice(0, loc));
    const outArr = [id];
    callback(outArr);
  } else {
    throwError(str);
  }
};

asyncApiFunctions.push(['readID', readID]);

/**
 * read the ID and its x y location on display of the object currently visible to the camera.
 * @param {String} thing identifier of the Huskyduino.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @returns {Array} contains ID and location of the object currently visible to the camera.
 */
const readLoc = async function(thing, callback) {
  const characteristicUUID = '5be3628a-f9b0-11eb-9a03-0242ac130003';

  const str = await readText(
      thing,
      HuskyServiceUUID,
      characteristicUUID,
  );
  if (str[0] == '[') {
    throwError('Recognized Multi Objs');
  } else if (str[0] == 0) {
    throwError('No Recognized Obj');
  } else if (str[0] >= 1 && str[0] <= 9) {
    const loc1 = str.indexOf('(');
    const loc2 = str.indexOf(',');
    const loc3 = str.indexOf(')');
    const id = parseInt(str.slice(0, loc1));
    const x = parseInt(str.slice(loc1 + 1, loc2));
    const y = parseInt(str.slice(loc2 + 1, loc3));
    const outArr = [id, x, y];
    callback(outArr);
  } else {
    throwError(str);
  }
};

asyncApiFunctions.push(['readLoc', readLoc]);
