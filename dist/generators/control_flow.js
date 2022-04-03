/**
 * @fileoverview Generating JavaScript for Blast's control flow blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
import {asyncApiFunctions} from './../blast_interpreter.js';

// Remap blockly blocks to improve naming in xml.
JavaScript['repeat'] = JavaScript['controls_repeat_ext'];
JavaScript['while_until'] = JavaScript['controls_whileUntil'];
JavaScript['for'] = JavaScript['controls_for'];
JavaScript['break_continue'] = JavaScript['controls_flow_statements'];
JavaScript['conditional_statement'] = JavaScript['controls_if'];

JavaScript['wait_seconds'] = function (block) {
  const seconds =
    JavaScript.valueToCode(block, 'SECONDS', JavaScript.ORDER_ATOMIC) || 0;
  const code = 'waitForSeconds(' + seconds + ');\n';
  return code;
};

/**
 * Sets a timeout of timeInSeconds.
 * @param {*} timeInSeconds time in seconds to wait
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const waitForSeconds = function (timeInSeconds, callback) {
  setTimeout(callback, timeInSeconds * 1000);
};
// Add waitForSeconds method to the interpreter's API
asyncApiFunctions.push(['waitForSeconds', waitForSeconds]);
