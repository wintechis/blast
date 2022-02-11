/**
 * @fileoverview Generating JavaScript for strings blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {asyncApiFunctions, getStdIn} from './../blast_interpreter.js';


// Remap blockly blocks to improve naming in xml.
Blockly.JavaScript['string'] = Blockly.JavaScript['text'];
Blockly.JavaScript['string_multiline'] = Blockly.JavaScript['text_multiline'];
Blockly.JavaScript['string_join'] = Blockly.JavaScript['text_join'];
Blockly.JavaScript['string_length'] = Blockly.JavaScript['text_length'];
Blockly.JavaScript['string_isEmpty'] = Blockly.JavaScript['text_isEmpty'];
Blockly.JavaScript['string_indexOf'] = Blockly.JavaScript['text_indexOf'];
Blockly.JavaScript['string_charAt'] = Blockly.JavaScript['text_charAt'];
Blockly.JavaScript['string_getSubstring'] =
  Blockly.JavaScript['text_getSubstring'];
Blockly.JavaScript['string_changeCase'] = Blockly.JavaScript['text_changeCase'];
Blockly.JavaScript['string_trim'] = Blockly.JavaScript['text_trim'];
Blockly.JavaScript['string_count'] = Blockly.JavaScript['text_count'];
Blockly.JavaScript['string_replace'] = Blockly.JavaScript['text_replace'];
Blockly.JavaScript['string_reverse'] = Blockly.JavaScript['text_reverse'];

Blockly.JavaScript['string_showPrompt'] = function(block) {
  let msg;
  if (block.getField('TEXT')) {
    // Internal message.
    msg = Blockly.JavaScript.quote_(block.getFieldValue('TEXT'));
  } else {
    // External message.
    msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
  }
  let code = `stdIn(${msg})`;
  const toNumber = block.getFieldValue('TYPE') === 'NUMBER';
  if (toNumber) {
    code = `Number(${code})`;
  }
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

/**
 * String input function
 * @param {String} message the message to show
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @returns {String} the input string
 */
const stdIn = async function(message, callback) {
  const input = getStdIn();
  const inputString = await input(message);
  callback(inputString);
};

asyncApiFunctions.push(['stdIn', stdIn]);
