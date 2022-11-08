/**
 * @fileoverview Generates JavaScript for tulogic BlinkStick, see
 * (https://www.blinkstick.com).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import {getWorkspace, throwError} from '../../interpreter.js';

JavaScript['blinkstick_set_colors'] = function (block) {
  const colour =
    JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('#000000');
  const index =
    JavaScript.valueToCode(block, 'index', JavaScript.ORDER_NONE) || '0';
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `await blinkstick_setColors(${blockId}, ${thing}, ${index}, ${colour});\n`;
  return code;
};

/**
 * Generates JavaScript code for the things_blinkstick block.
 * @param {Blockly.Block} block the things_blinkstick block.
 * @returns {String} the generated code.
 */
JavaScript['things_blinkstick'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Set the color of the BlinkStick.
 * @param {Blockly.Block.id} blockId the things_blinkstick block's id.
 * @param {string} id the id identifier of the BlinkStick.
 * @param {number} index index of the LED.
 * @param {string} colour the color to set, as hex value.
 */
globalThis['blinkstick_setColors'] = async function (
  blockId,
  id,
  index,
  colour
) {
  // check if index is between 0 and 7.
  if (index < 0 || index > 7) {
    throwError('BlinkStick index must be between 0 and 7.');
    return;
  }

  // If no things block is attached, return.
  if (!id) {
    throwError('No BlinkStick block set.');
    return;
  }
  const channel = 0;

  // convert hex colour to rgb
  const red = parseInt(colour.substring(1, 3), 16);
  const green = parseInt(colour.substring(3, 5), 16);
  const blue = parseInt(colour.substring(5, 7), 16);

  // create report
  const report = [channel, index, red, green, blue];

  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  if (!thing.opened) {
    await thing.open();
  }
  await thing.sendFeatureReport(5, Uint8Array.from(report));
};
