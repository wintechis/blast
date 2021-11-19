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
  const red = Blockly.JavaScript.valueToCode(block, 'red', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  const green = Blockly.JavaScript.valueToCode(block, 'green', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  const blue = Blockly.JavaScript.valueToCode(block, 'blue', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'thing',
      Blockly.JavaScript.ORDER_NONE,
  ) || 'null';

  const code = `switchLights(${thing}, ${red}, ${green}, ${blue});\n`;
  return code;
};

/**
 * Generates JavaScript code for the switch_lights_RYG block.
 * @param {Blockly.Block} block the get_request block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['switch_lights_ryg'] = function(block) {
  const red = Blockly.JavaScript.valueToCode(block, 'red', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  const yellow = Blockly.JavaScript.valueToCode(block, 'yellow', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  const green = Blockly.JavaScript.valueToCode(block, 'green', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'thing',
      Blockly.JavaScript.ORDER_NONE,
  ) || 'null';
    
  const code = `switchLights(${thing}, ${red}, ${yellow}, ${green});\n`;
  return code;
};

// Add the LED controller's serviceUUID to optionalServices
const LEDServiceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
Blast.Bluetooth.optionalServices.push(LEDServiceUUID);

/**
 * switches lights of an LED controller via Bluetooth, by writing a value to it.
 * @param {String} mac identifier of the LED controller.
 * @param {Number} r red value in the rgb color space.
 * @param {Number} g green value in the rgb color space.
 * @param {Number} b blue value in the rgb color space.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const switchLights = async function(mac, r, g, b, callback) {
  // make sure a device is connected.
  if (!mac) {
    Blast.throwError('No LED Controller is set.');
    callback();
    return;
  }

  // convert rgb values to hexadecimal and make sure length is 2 digits.
  const redByte = parseInt(r).toString(16).padStart(2, '0');
  const greenByte = parseInt(g).toString(16).padStart(2, '0');
  const blueByte = parseInt(b).toString(16).padStart(2, '0');

  const value = '7e000503' + redByte + greenByte + blueByte + '00ef';

  const characteristicUUID = '0000fff3-0000-1000-8000-00805f9b34fb';
  await Blast.Bluetooth.gatt_writeWithoutResponse(mac, LEDServiceUUID, characteristicUUID, value);
  callback();
};
// Add switchLights function to the interpreter's API.
Blast.asyncApiFunctions.push(['switchLights', switchLights]);

