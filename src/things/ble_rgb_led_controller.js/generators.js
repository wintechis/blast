/**
 * @fileoverview Generates JavaScript for the BLE RGB LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

goog.module('Blast.generators.ble_rgb_led_controller');

const {asyncApiFunctions} = goog.require('Blast.Interpreter');
const {throwError} = goog.require('Blast.Interpreter');
 
/**
  * Generates JavaScript code for the switch_lights_RGB block.
  * @param {Blockly.Block} block the get_request block.
  * @returns {String} the generated code.
  */
Blockly.JavaScript['switch_lights_rgb'] = function(block) {
  const colour = Blockly.JavaScript.valueToCode(block, 'colour', Blockly.JavaScript.ORDER_ATOMIC) || Blockly.JavaScript.quote_('#000000');
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'thing',
      Blockly.JavaScript.ORDER_NONE,
  ) || 'null';

  const code = `switchLights(${thing}, ${colour});\n`;
  return code;
};

// Add the LED controller's serviceUUID to optionalServices
const LEDServiceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
Blast.Bluetooth.optionalServices.push(LEDServiceUUID);

/**
 * switches lights of an LED controller via Bluetooth, by writing a value to it.
 * @param {String} mac identifier of the LED controller.
 * @param {String} colour the colour to switch the lights to, as hex value.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const switchLights = async function(mac, colour, callback) {
  // make sure a device is connected.
  if (!mac) {
    throwError('No LED Controller is set.');
    callback();
    return;
  }

  const value = '7e000503' + colour.substring(1, 7) + '00ef';

  const characteristicUUID = '0000fff3-0000-1000-8000-00805f9b34fb';
  await Blast.Bluetooth.writeWithoutResponse(mac, LEDServiceUUID, characteristicUUID, value);
  callback();
};
// Add switchLights function to the interpreter's API.
asyncApiFunctions.push(['switchLights', switchLights]);

