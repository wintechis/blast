/**
 * @fileoverview Generating JavaScript for Blast's control flow blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {asyncApiFunctions} from './../blast_interpreter.js';


// Remap blockly blocks to improve naming in xml.
Blockly.JavaScript['repeat'] = Blockly.JavaScript['controls_repeat_ext'];
Blockly.JavaScript['while_until'] = Blockly.JavaScript['controls_whileUntil'];
Blockly.JavaScript['for'] = Blockly.JavaScript['controls_for'];
Blockly.JavaScript['break_continue'] =
  Blockly.JavaScript['controls_flow_statements'];
Blockly.JavaScript['conditional_statement'] = Blockly.JavaScript['controls_if'];

Blockly.JavaScript['wait_seconds'] = function(block) {
  const seconds = Blockly.JavaScript.valueToCode(block, 'SECONDS', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  const code = 'waitForSeconds(' + seconds + ');\n';
  return code;
};

/**
 * Sets a timeout of timeInSeconds.
 * @param {*} timeInSeconds time in seconds to wait
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const waitForSeconds = function(timeInSeconds, callback) {
  setTimeout(callback, timeInSeconds * 1000);
};
// Add waitForSeconds method to the interpreter's API
asyncApiFunctions.push(['waitForSeconds', waitForSeconds]);
