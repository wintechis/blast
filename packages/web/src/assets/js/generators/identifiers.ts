/**
 * @fileoverview Generating JavaScript for identifier blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

JavaScript['uri'] = function (block: Block): [string, number] {
  const uri = JavaScript.quote_(block.getFieldValue('URI'));
  return [uri, JavaScript.ORDER_NONE];
};

JavaScript['uri_from_string'] = function (block: Block) {
  const uri = JavaScript.valueToCode(block, 'URI', JavaScript.ORDER_NONE);

  const functionName = JavaScript.provideFunction_('convertToUri', [
    'function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(uri) {',
    '  // Check if the string is a valid URI.',
    '  try {',
    '    new URL(uri);',
    '  } catch (e) {',
    '    console.error("The given string is not a valid URI.");',
    '  }',
    '  return uri;',
    '}',
  ]);

  const code = `${functionName}(${uri})`;

  return [code, JavaScript.ORDER_NONE];
};

JavaScript['mac'] = function (block: Block): [string, number] {
  const mac = JavaScript.quote_(block.getFieldValue('MAC'));
  return [mac, JavaScript.ORDER_NONE];
};
