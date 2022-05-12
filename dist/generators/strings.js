/**
 * @fileoverview Generating JavaScript for strings blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import {asyncApiFunctions, getStdIn} from './../blast_interpreter.js';

// Remap blockly blocks to improve naming in xml.
JavaScript['string'] = JavaScript['text'];
JavaScript['string_multiline'] = JavaScript['text_multiline'];
JavaScript['string_join'] = JavaScript['text_join'];
JavaScript['string_length'] = JavaScript['text_length'];
JavaScript['string_isEmpty'] = JavaScript['text_isEmpty'];
JavaScript['string_indexOf'] = JavaScript['text_indexOf'];
JavaScript['string_charAt'] = JavaScript['text_charAt'];
JavaScript['string_getSubstring'] = JavaScript['text_getSubstring'];
JavaScript['string_changeCase'] = JavaScript['text_changeCase'];
JavaScript['string_trim'] = JavaScript['text_trim'];
JavaScript['string_count'] = JavaScript['text_count'];
JavaScript['string_replace'] = JavaScript['text_replace'];
JavaScript['string_reverse'] = JavaScript['text_reverse'];

JavaScript['string_showPrompt'] = function (block) {
  let msg;
  if (block.getField('TEXT')) {
    // Internal message.
    msg = JavaScript.quote_(block.getFieldValue('TEXT'));
  } else {
    // External message.
    msg = JavaScript.valueToCode(block, 'TEXT', JavaScript.ORDER_NONE) || "''";
  }
  let code = `stdIn(${msg})`;
  const toNumber = block.getFieldValue('TYPE') === 'NUMBER';
  if (toNumber) {
    code = `Number(${code})`;
  }
  return [code, JavaScript.ORDER_FUNCTION_CALL];
};

/**
 * String input function
 * @param {String} message the message to show
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @returns {String} the input string
 */
const stdIn = async function (message, callback) {
  const input = getStdIn();
  const inputString = await input(message);
  callback(inputString);
};

asyncApiFunctions.push(['stdIn', stdIn]);
