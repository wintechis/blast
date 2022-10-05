/**
 * @fileoverview Javascript generators for `display` Blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';

const {JavaScript} = Blockly;
import {getStdOut} from './../blast_interpreter.js';

/**
 * Generates JavaScript code for the display_text block.
 * @param {Blockly.Block} block the display_text block.
 * @returns {String} the generated code.
 */
JavaScript['display_text'] = function (block) {
  const message =
    JavaScript.valueToCode(block, 'text', JavaScript.ORDER_NONE) || "''";

  const code = `displayText(${message});\n`;
  return code;
};

/**
 * Add a text message to the {@link Blast.Ui.messageOutputContainer}.
 * @param {string} text text message to output.
 * @public
 */
globalThis['displayText'] = function (text) {
  const stdOut = getStdOut();
  stdOut(text);
};
