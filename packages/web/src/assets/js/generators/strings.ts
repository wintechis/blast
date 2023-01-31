/**
 * @fileoverview Generating JavaScript for strings blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

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

JavaScript['string_showPrompt'] = function (block: Block): [string, number] {
  let msg;
  if (block.getField('TEXT')) {
    // Internal message.
    msg = JavaScript.quote_(block.getFieldValue('TEXT'));
  } else {
    // External message.
    msg = JavaScript.valueToCode(block, 'TEXT', JavaScript.ORDER_NONE) || "''";
  }

  JavaScript.definitions_['getStdIn'] =
    "import {getStdIn} from '../interpreter'";

  const functionName = JavaScript.provideFunction_('showPrompt', [
    'async function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(message) {',
    '  const input = getStdIn();',
    '  const inputString = await input(message);',
    '  return inputString;',
    '}',
  ]);

  let code = `await showPrompt(${msg})`;
  const toNumber = block.getFieldValue('TYPE') === 'NUMBER';
  if (toNumber) {
    code = `Number(${code})`;
  }
  return [code, JavaScript.ORDER_FUNCTION_CALL];
};
