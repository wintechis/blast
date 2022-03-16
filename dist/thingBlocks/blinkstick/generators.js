/**
 * @fileoverview Generates JavaScript for tulogic BlinkStick, see
 * (https://www.blinkstick.com).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
// eslint-disable-next-line node/no-missing-import
import Blinkstick from './../../things/blinkstick/Blinkstick.js';
import {getThingsLog} from './../../blast_things.js';
import {asyncApiFunctions} from './../../blast_interpreter.js';
import {throwError} from './../../blast_interpreter.js';

const thingsLog = getThingsLog();

Blockly.JavaScript['blinkstick_set_colors'] = function (block) {
  const colour =
    Blockly.JavaScript.valueToCode(
      block,
      'COLOUR',
      Blockly.JavaScript.ORDER_ATOMIC
    ) || Blockly.JavaScript.quote_('#000000');
  const index =
    Blockly.JavaScript.valueToCode(
      block,
      'index',
      Blockly.JavaScript.ORDER_ATOMIC
    ) || '0';
  const thing =
    Blockly.JavaScript.valueToCode(
      block,
      'thing',
      Blockly.JavaScript.ORDER_ATOMIC
    ) || "''";

  const code = `blinkstickSetColors(${thing}, ${index}, ${colour})\n;`;
  return code;
};

/**
 * Set the color of the BlinkStick.
 * @param {string} id the id identifier of the BlinkStick.
 * @param {number} index index of the LED.
 * @param {string} colour the color to set, as hex value.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const blinkstickSetColors = async function (id, index, colour, callback) {
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

  const ledColour = {index, red, green, blue};

  const thing = new Blinkstick(id);
  await thing.writeProperty('colours', ledColour);
  callback();
};

// add joycon_read_property function to the interpreter's API.
asyncApiFunctions.push(['blinkstickSetColors', blinkstickSetColors]);
