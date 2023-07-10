/**
 * @fileoverview Generating JavaScript for strings blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

// Remap blockly blocks to improve naming in xml.
JavaScript.forBlock['string'] = JavaScript.forBlock['text'];
JavaScript.forBlock['string_multiline'] = JavaScript.forBlock['text_multiline'];
JavaScript.forBlock['string_join'] = JavaScript.forBlock['text_join'];
JavaScript.forBlock['string_length'] = JavaScript.forBlock['text_length'];
JavaScript.forBlock['string_isEmpty'] = JavaScript.forBlock['text_isEmpty'];
JavaScript.forBlock['string_indexOf'] = JavaScript.forBlock['text_indexOf'];
JavaScript.forBlock['string_charAt'] = JavaScript.forBlock['text_charAt'];
JavaScript.forBlock['string_getSubstring'] =
  JavaScript.forBlock['text_getSubstring'];
JavaScript.forBlock['string_changeCase'] =
  JavaScript.forBlock['text_changeCase'];
JavaScript.forBlock['string_trim'] = JavaScript.forBlock['text_trim'];
JavaScript.forBlock['string_count'] = JavaScript.forBlock['text_count'];
JavaScript.forBlock['string_replace'] = JavaScript.forBlock['text_replace'];
JavaScript.forBlock['string_reverse'] = JavaScript.forBlock['text_reverse'];

JavaScript.forBlock['string_showPrompt'] = function (
  block: Block
): [string, number] {
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
