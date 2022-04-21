/**
 * @fileoverview Generates JavaScript for the Sphero Mini.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
import {apiFunctions, getWorkspace} from '../../blast_interpreter.js';

/**
 * Generates JavaScript code for the things_bleLedController block.
 * @param {Blockly.Block} block the things_bleLedController block.
 * @returns {String} the generated code.
 */
JavaScript['things_spheroMini'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the sphero_roll block.
 * @param {Blockly.Block} block the sphero_roll block.
 * @returns {String} the generated code.
 */
JavaScript['sphero_roll'] = function (block) {
  const speed = JavaScript.valueToCode(block, 'speed', JavaScript.ORDER_ATOMIC);
  const heading = JavaScript.valueToCode(
    block,
    'heading',
    JavaScript.ORDER_ATOMIC
  );
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }
  const code = `spheroRoll(${blockId}, ${speed}, ${heading});\n`;
  return code;
};

/**
 * Generates JavaScript code for the sphero_roll block.
 * @param {Blockly.Block} block the sphero_roll block.
 * @returns {String} the generated code.
 */
JavaScript['sphero_stop'] = function (block) {
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }
  const code = `spheroStop(${blockId});\n`;
  return code;
};

/**
 * Sends a roll command to the Sphero Mini.
 * @param {Blockly.Block.id} blockId the things_spheroMini block's id.
 * @param {Number} speed the speed of the roll.
 * @param {Number} heading the heading in degrees, (0 is forwards, 90 is right, 180 is backwards, 270 is left).
 */
function spheroRoll(blockId, speed, heading) {
  // get thing instance of block
  const block = getWorkspace().getBlockById(blockId);
  const bolt = block.thing;
  bolt.roll(speed, heading, []);
}

// Add spheroRoll function to the interpreter's API
apiFunctions.push(['spheroRoll', spheroRoll]);

/**
 * Sends a stop command to the Sphero Mini.
 * @param {Blockly.Block.id} blockId the things_spheroMini block's id.
 */
function spheroStop(blockId) {
  // get thing instance of block
  const block = getWorkspace().getBlockById(blockId);
  const bolt = block.thing;
  bolt.roll(0, bolt.heading, []);
}

// Add spheroStop function to the interpreter's API
apiFunctions.push(['spheroStop', spheroStop]);
