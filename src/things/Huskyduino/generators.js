/**
 * @fileoverview Generates JavaScript for the bluetooth interface of
 * [Huskyduino](https://github.com/wintechis/huskyduino)
 * @author yongxu.ren1996@gmail.com
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';


/**
 * Generate JavaScript code for choosing algorithm
 * @param {Blockly.Block} block is the huskylens_choose_algo block
 * @returns {String} the generated JavaScript code
 */
Blockly.JavaScript['huskylens_choose_algo'] = function(block) {
  const algorithm = block.getFieldValue('Algorithms');
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  
  const dic = {
    face_recognition: '0x01',
    object_tracking: '0x02',
    object_recognition: '0x03',
    line_tracking: '0x04',
    color_recognition: '0x05',
    tag_recognition: '0x06',
    object_classification: '0x07',
  };
  const value = dic[algorithm];

  // generate JavaScript code to send algorithm value to Huskyduino
  const code = `chooseAlgo( ${thing}, '${value}');\n`;
  return code;
};


/**
 * Generate JavaScript code for learning face id
 * @param {Blockly.Block} block is the huskylens_learn_id block
 * @returns {String} the generated JavaScript code
 */
Blockly.JavaScript['huskylens_learn_id'] = function(block) {
  const id = '0x' + block.getFieldValue('ID').toString(16);
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  // generate JavaScript code to send learning face id to Huskyduino
  const code = `learnID(${thing}, '${id}');\n`;
  return code;
};


/**
 * Generate JavaScript code for forgetting learned knowledge
 * @param {Blockly.Block} block is the huskylens_forget_all block
 * @returns {String} the generated JavaScript code
 */
Blockly.JavaScript['huskylens_forget_all'] = function(block) {
  const flag = block.getFieldValue('ForgetFlag') == 'TRUE';
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC,
  );

  // change the flag to a Byte data
  const flagByte = flag ? '01' : '00';
  const value = '0x' + flagByte;
  
  // generate JavaScript code to send forget flag to Huskyduino
  const code = `forgetAll(${thing}, '${value}');\n`;
  return code;
};


/**
 * Generate JavaScript code for reading ids out from arduino
 * @param {Blockly.Block} block is the huskylens_read_id block
 * @returns {String} the generated JavaScript code
 */
Blockly.JavaScript['huskylens_read_id'] = function(block) {
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC);
  
  // Assemble JavaScript into code variable.
  const code = `readID(${thing})`;
  // Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


// set the service UUID here， for all characteristics
const HuskyServiceUUID = '5be35d20-f9b0-11eb-9a03-0242ac130003';
Blast.Bluetooth.optionalServices.push(HuskyServiceUUID);


/**
 * send the choosen algorithm value to Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {String} value represent seven algorithms, between 1 and 7.
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
 * send the given id value to Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {String} id means the given number, in order to name the learned face.
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
 * send the given forget flag to Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {String} flag means whether to forget the knowledge or not.
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
 * read the output string from the Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @returns {String} a String containing all known faceIDs currently visible to the camera.
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
