/**
 * BLE part code
 * characters: 
 *            
 *            chooseAlgo: change algorithm by input 'Algo Name' ( write ) -> Int
 *                  UUIDs: 5be35d26-f9b0-11eb-9a03-0242ac130003
 *  
 *            writeFaceID: choose learning face ID by input 'number' ( write )  -> Int
 *                  UUIDs: 5be35eca-f9b0-11eb-9a03-0242ac130003
 *  
 *            forgetAll: forget all that have learned by input 'forget' ( write )  -> Bool
 *                  UUIDs: 5be361b8-f9b0-11eb-9a03-0242ac130003
 *  
 *            readFaceID: read the face ID from arduino  ( read )  -> Int
 *                  UUIDs: 5be3628a-f9b0-11eb-9a03-0242ac130003
 */
'use strict';



/**
 * Generate JavaScript code for the choose algorithm block
 * @param {Blockly.Block} block is the choose algorithm block
 * @returns {String} the generated JavaScript code
 */
Blockly.JavaScript['huskylens_choosealgo'] = function(block) {
    
    const algorithm = block.getFieldValue('Algorithms');
    const thing = Blockly.JavaScript.valueToCode(
        block, 
        'Thing', 
        Blockly.JavaScript.ORDER_ATOMIC
    );
    
    // use dictionary to change the algorithm to int value
    const dic = { 
        face_recognition : 1,
        object_tracking : 2,
        object_recognition : 3,
        line_tracking : 4,
        color_recognition : 5,
        tag_recognition : 6,
        object_classification : 7
    };
    const value = dic[algorithm]

    // generate JavaScript code to send algorithm value to Huskyduino
    const code = `chooseAlgo( ${thing}, '${value}');\n`;
    return code;
};



/**
 * Generate JavaScript code for the learn face id block
 * @param {Blockly.Block} block is the learn id block
 * @returns {String} the generated JavaScript code
 */
Blockly.JavaScript['huskylens_learnid'] = function(block) {
    const id = block.getFieldValue('ID');
    const thing = Blockly.JavaScript.valueToCode(
        block, 
        'Thing', 
        Blockly.JavaScript.ORDER_ATOMIC
    );
    // generate JavaScript code to send learning face id to Huskyduino
    var code = `learnID( ${thing}, '${id}');\n`;
    return code;
};



/**
 * Generate JavaScript code for forget learned knowledge
 * @param {Blockly.Block} block is the forget flag block
 * @returns {String} the generated JavaScript code
 */
Blockly.JavaScript['block_type'] = function(block) {
    const flag = block.getFieldValue('ForgetFlag') == 'TRUE';
    const thing = Blockly.JavaScript.valueToCode(
        block, 
        'Thing', 
        Blockly.JavaScript.ORDER_ATOMIC
    );
    
    // generate JavaScript code to send forget flag to Huskyduino
    var code = '...;\n';
    return code;
};



/**
 * send the choosen algorithm value to Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {String} value represent seven algorithms, between 1 and 7.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback. 
 */
const chooseAlgo = async function(thing, value, callback) {
    const serviceUUID = '180A';
    const characteristicUUID = '5be35d26-f9b0-11eb-9a03-0242ac130003';

    // TODO: may be a problem here
    await Blast.Bluetooth.gatt_writeWithoutResponse(thing, serviceUUID, characteristicUUID, value);
    callback();
};




/**
 * send the given id value to Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {String} id means the given number, in order to name the learned face.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback. 
 */
const learnID = async function(thing, id, callback) {
    const serviceUUID = '180A';
    const characteristicUUID = '5be35eca-f9b0-11eb-9a03-0242ac130003';

    // TODO: may be a problem here
    await Blast.Bluetooth.gatt_writeWithoutResponse(thing, serviceUUID, characteristicUUID, id);
    callback();
};



/**
 * send the given forget flag to Huskyduino via bluetooth
 * @param {String} thing identifier of the Huskyduino.
 * @param {String} flag means whether to forget the knowledge or not.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback. 
 */
const forgetAll = async function(thing, flag, callback){
    const serviceUUID = '180A';
    const characteristicUUID = '5be361b8-f9b0-11eb-9a03-0242ac130003';
    
    // TODO: may be a problem here
    await Blast.Bluetooth.gatt_writeWithoutResponse(thing, serviceUUID, characteristicUUID, flag);
    callback();
};