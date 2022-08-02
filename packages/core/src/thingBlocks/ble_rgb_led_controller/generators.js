/**
 * @fileoverview Generates JavaScript for the BLE RGB LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import {getWorkspace, throwError} from './../../blast_interpreter.js';

/**
 * Generates JavaScript code for the things_bleLedController block.
 * @param {Blockly.Block} block the things_bleLedController block.
 * @returns {String} the generated code.
 */
JavaScript['things_bleLedController'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the switch_lights_RGB block.
 * @param {Blockly.Block} block the get_request block.
 * @returns {String} the generated code.
 */
JavaScript['switch_lights_rgb'] = function (block) {
  const colour =
    JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('#000000');
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `await bleLedController_switchLights(${blockId}, ${thing}, ${colour});\n`;
  return code;
};

/**
 * switches lights of an LED controller via Bluetooth, by writing a value to it.
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @param {String} webBluetoothId identifier of the LED controller.
 * @param {String} colour the colour to switch the lights to, as hex value.
 */
globalThis['bleLedController_switchLights'] = async function (
  blockId,
  webBluetoothId,
  colour
) {
  // make sure a device is connected.
  if (!webBluetoothId) {
    throwError('No LED Controller is set.');
    return;
  }
  // convert data to json
  const data = '7e000503' + colour.substring(1, 7) + '00ef';
  // get thing instance of block
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  await thing.writeProperty('colour', data);
};
