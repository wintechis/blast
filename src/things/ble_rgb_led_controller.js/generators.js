/**
 * @fileoverview Generates JavaScript for the BLE RGB LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';
 
/**
  * Generates JavaScript code for the switch_lights_RGB block.
  * @param {Blockly.Block} block the get_request block.
  * @returns {String} the generated code.
  */
Blockly.JavaScript['switch_lights_rgb'] = function(block) {
  const red = block.getFieldValue('cb_red') == 'TRUE';
  const green = block.getFieldValue('cb_green') == 'TRUE';
  const blue = block.getFieldValue('cb_blue') == 'TRUE';
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'mac',
      Blockly.JavaScript.ORDER_NONE,
  );
     
  // create value byte from checkboxes
  const redByte = red ? 'ff' : '00';
  const greenByte = green ? 'ff' : '00';
  const blueByte = blue ? 'ff' : '00';
  const value = '7e000503' + redByte + greenByte + blueByte + '00ef';

  const code = `switchLights(${mac}, ${value});\n`;
  return code;
};

/**
 * Generates JavaScript code for the switch_lights_RYG block.
 * @param {Blockly.Block} block the get_request block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['switch_lights_ryg'] = function(block) {
  const red = block.getFieldValue('cb_red') == 'TRUE';
  const yellow = block.getFieldValue('cb_yellow') == 'TRUE';
  const green = block.getFieldValue('cb_green') == 'TRUE';
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'mac',
      Blockly.JavaScript.ORDER_NONE,
  );

  // create value byte from checkboxes
  const redByte = red ? 'ff' : '00';
  const yellowByte = yellow ? 'ff' : '00';
  const greenByte = green ? 'ff' : '00';
  const value = '7e000503' + redByte + greenByte + yellowByte + '00ef';
    
  const code = `switchLights(${mac}, ${value});\n`;
  return code;
};

/**
 * switches lights of an LED controller via Bluetooth, by writing a value to it.
 * @param {String} mac identifier of the LED controller.
 * @param {String} value the value to write on the LED controller.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const switchLights = async function(mac, value, callback) {
  const serviceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
  const characteristicUUID = '0000fff3-0000-1000-8000-00805f9b34fb';
  await Blast.Bluetooth.gatt_writeWithoutResponse(mac, serviceUUID, characteristicUUID, value);
  callback();
};
// Add switchLights function to the interpreter's API.
Blast.asyncApiFunctions.push(['switchLights', switchLights]);

