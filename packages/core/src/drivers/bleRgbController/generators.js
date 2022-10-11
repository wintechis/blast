/**
 * @fileoverview Generates JavaScript for the BLE RGB LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
import {getWorkspace, throwError} from '../../blast_interpreter.js';

const {JavaScript} = Blockly;

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
 * Generates JavaScript code for the bleLedController_switch_lights block.
 * @param {Blockly.Block} block the get_request block.
 * @returns {String} the generated code.
 */
JavaScript['bleLedController_switch_lights'] = function (block) {
  const colour =
    JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('#000000');
  // Colour is a hex string in quotes, e.g. '#ff0000', convert to rgb.
  const r = parseInt(colour.slice(2, 4), 16);
  const g = parseInt(colour.slice(4, 6), 16);
  const b = parseInt(colour.slice(6, 8), 16);
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }
  const code = `await bleLedController_switch_lights(${blockId}, ${thing}, ${r}, ${g}, ${b});\n`;
  return code;
};

/**
 * switches lights of an LED controller via Bluetooth, by writing a value to it.
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @param {String} webBluetoothId identifier of the LED controller.
 * @param {Number} r red value.
 * @param {Number} g green value.
 * @param {Number} b blue value.
 */
globalThis['bleLedController_switch_lights'] = async function (
  blockId,
  webBluetoothId,
  R,
  G,
  B
) {
  // make sure a device is connected.
  if (!webBluetoothId) {
    throwError('No LED Controller is set.');
    return;
  }
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  await thing.writeProperty('colour', {R, G, B});
};
