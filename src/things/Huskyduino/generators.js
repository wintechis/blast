/**
 * @fileoverview Generates JavaScript of the HuskyDuino blocks, see
 * (https://github.com/wintechis/huskyduino) for the interface specification.
 * @author yongxu.ren1996@gmail.com
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';


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
  const id = '0x' + Blockly.JavaScript.valueToCode(
      block,
      'ID',
      Blockly.JavaScript.ORDER_ATOMIC).toString(16);
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
  const code = `readID(${thing})`;
  // Return code.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


// set the service UUID here， for all characteristics
const HuskyServiceUUID = '5be35d20-f9b0-11eb-9a03-0242ac130003';
Blast.Bluetooth.optionalServices.push(HuskyServiceUUID);


/**
 * Write the choosen algorithm value to Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {String} value represents the algorithm, ranges from 1 to 7.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const chooseAlgo = async function(thing, value, callback) {
  const characteristicUUID = '5be35d26-f9b0-11eb-9a03-0242ac130003';

  await Blast.Bluetooth.gatt_writeWithoutResponse(
      thing,
      HuskyServiceUUID,
      characteristicUUID,
      value,
  );
  callback();
};

Blast.asyncApiFunctions.push(['chooseAlgo', chooseAlgo]);


/**
 * write face id value to Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {String} id faceID to write to the Huskyduino.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const learnID = async function(thing, id, callback) {
  const characteristicUUID = '5be35eca-f9b0-11eb-9a03-0242ac130003';

  await Blast.Bluetooth.gatt_writeWithoutResponse(
      thing,
      HuskyServiceUUID,
      characteristicUUID,
      id);
  callback();
};

Blast.asyncApiFunctions.push(['learnID', learnID]);

/**
 * write forget flag to Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {String} flag whether to forget all saved values or not.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const forgetAll = async function(thing, flag, callback) {
  const characteristicUUID = '5be361b8-f9b0-11eb-9a03-0242ac130003';
    
  await Blast.Bluetooth.gatt_writeWithoutResponse(
      thing,
      HuskyServiceUUID,
      characteristicUUID,
      flag,
  );
  callback();
};

Blast.asyncApiFunctions.push(['forgetAll', forgetAll]);

/**
 * read the face IDs of all known faces currently visible to the camera via bluetooth.
 * @param {String} thing identifier of the Huskyduino.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @returns {String} contains all known faceIDs currently visible to the camera.
 */
const readID = async function(thing, callback) {
  const characteristicUUID = '5be3628a-f9b0-11eb-9a03-0242ac130003';

  const id = await Blast.Bluetooth.gatt_read_text(
      thing,
      HuskyServiceUUID,
      characteristicUUID,
  );
  callback(id);
};

Blast.asyncApiFunctions.push(['readID', readID]);
