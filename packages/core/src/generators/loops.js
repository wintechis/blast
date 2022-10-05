/**
 * @fileoverview Generating JavaScript for Blast's loop blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {throwError} from '../blast_interpreter.js';
const {JavaScript} = Blockly;

// Remap blockly blocks to improve naming in xml.
JavaScript['repeat'] = JavaScript['controls_repeat_ext'];
JavaScript['while_until'] = JavaScript['controls_whileUntil'];
JavaScript['for'] = JavaScript['controls_for'];
JavaScript['break_continue'] = JavaScript['controls_flow_statements'];
JavaScript['conditional_statement'] = JavaScript['controls_if'];

JavaScript['wait_seconds'] = function (block) {
  const seconds =
    JavaScript.valueToCode(block, 'SECONDS', JavaScript.ORDER_ATOMIC) || 0;

  const code = `await waitSeconds(${seconds});\n`;
  return code;
};

/**
 * Halts the program execution for the given number of seconds.
 * @param {Number} seconds the number of seconds to wait.
 */
globalThis['waitSeconds'] = async function (seconds) {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

JavaScript['every_seconds'] = function (block) {
  // read block inputs
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || 1;
  const unit = block.getFieldValue('units');
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );

  if (value < 0.1) {
    throwError('Event interval value must be greater than 0.1.');
  }

  let milliSeconds;
  if (unit === 'seconds') {
    milliSeconds = value * 1000;
  } else if (unit === 'minutes') {
    milliSeconds = value * 60 * 1000;
  } else if (unit === 'hours') {
    milliSeconds = value * 60 * 60 * 1000;
  }

  const code = `const interval = setInterval(() => eval(async () => {${statements}}()), ${milliSeconds});
// Add interval to intervalEvents, so it can be removed when BLAST is stopped.
intervalEvents.push(interval);\n`;

  return code;
};
