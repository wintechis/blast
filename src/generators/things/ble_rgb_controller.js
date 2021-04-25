/**
 * @fileoverview Generates JavaScript for the BLE RGB LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*******************
 * Property blocks.*
 *******************/

/**
 * Generates JavaScript code for the switch_lights block.
 * @param {Blockly.Block} block the get_request block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['switch_lights'] = function(block) {
  const cbRed = block.getFieldValue('cb_red') == 'TRUE';
  const cbYellow = block.getFieldValue('cb_yellow') == 'TRUE';
  const cbGreen = block.getFieldValue('cb_green') == 'TRUE';
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'mac',
      Blockly.JavaScript.ORDER_NONE,
  );
    
  const code = `switchLights(${mac}, ${cbRed}, ${cbYellow}, ${cbGreen});\n`;
  return code;
};
