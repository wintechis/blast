/**
 * @fileoverview Generates JavaScript for tulogic BlinkStick, see
 * (https://www.blinkstick.com).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
import {
  asyncApiFunctions,
  getWorkspace,
  throwError,
} from './../../blast_interpreter.js';
// eslint-disable-next-line node/no-missing-import
import {jsonToReadble} from './../../things/bindings/binding-helpers.js';

JavaScript['blinkstick_set_colors'] = function (block) {
  const colour =
    JavaScript.valueToCode(block, 'COLOUR', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('#000000');
  const index =
    JavaScript.valueToCode(block, 'index', JavaScript.ORDER_NONE) || '0';
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || "''";
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `blinkstickSetColors(${blockId}, ${thing}, ${index}, ${colour});\n`;
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
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const blinkstickSetColors = async function (
  blockId,
  id,
  index,
  colour,
  callback
) {
  // check if index is between 0 and 7.
  if (index < 0 || index > 7) {
    throwError('BlinkStick index must be between 0 and 7.');
    callback();
    return;
  }

  // If no things block is attached, return.
  if (!id) {
    throwError('No BlinkStick block set.');
    callback();
    return;
  }

  // convert hex colour to rgb
  const red = parseInt(colour.substring(1, 3), 16);
  const green = parseInt(colour.substring(3, 5), 16);
  const blue = parseInt(colour.substring(5, 7), 16);

  // create report
  const reportId = 5;
  const report = [reportId, index, red, green, blue];
  const stream = jsonToReadble({reportId, report});

  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  await thing.writeProperty('colours', stream);
  callback();
};

// add joycon_read_property function to the interpreter's API.
asyncApiFunctions.push(['blinkstickSetColors', blinkstickSetColors]);
