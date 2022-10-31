/**
 * @fileoverview Javascript generators for `display` Blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';

const {JavaScript} = Blockly;
import {getStdOut} from '../interpreter.js';

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

/**
 * Generates JavaScript code for the capture_image block.
 * @param {Blockly.Block} block the display_image block.
 * @returns {String} the generated code.
 */
 JavaScript['display_image'] = function (block) {
  const image = JavaScript.valueToCode(block, 'image', JavaScript.ORDER_NONE);

  // This block only works if you define displayImage in your Environmnet
  // and add it to the interpreter's API. See packages/web for an example.
  const code = `displayImage(${image});\n`;
  return code;
};

/**
 * Adds an image to {@link Blast.Ui.messageOutputContainer}.
 * @param {string} image base64 encoded image.
 */
globalThis['displayImage'] = function (image) {
  addMessage('image', image);
};

/**
 * Generates JavaScript code for the display_table block.
 * @param {Blockly.Block} block the display_table block.
 * @returns {String} the generated code.
 */
JavaScript['display_table'] = function (block) {
  const table = JavaScript.valueToCode(block, 'table', JavaScript.ORDER_NONE);

  // This block only works if you define displayTable in your Environmnet
  // and add it to the interpreter's API. See packages/web for an example.
  const code = `displayTable(${table});\n`;
  return code;
};

/**
 * Generates an HTML Table from a sparql query result (array of arrays).
 * and add it to {@link Blast.Ui.messageOutputContainer}.
 * @param {graph} arr graph to output.
 * @public
 */
globalThis['displayTable'] = function (arr) {
  // display message if table is empty
  if (arr.length === 0) {
    const stdOut = getStdOut();
    stdOut('empty table');
    return;
  }

  addMessage('table', arr);
};
