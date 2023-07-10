/**
 * @fileoverview Generating JavaScript for Blast's function blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block, Names} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

JavaScript.forBlock['procedures_defeval'] = function (
  block: Block
): string | void {
  const funcName = JavaScript.variableDB_.getName(
    block.getFieldValue('NAME'),
    Names.NameType.PROCEDURE
  );
  let xfix1 = '';
  if (JavaScript.STATEMENT_PREFIX) {
    xfix1 += JavaScript.injectId(JavaScript.STATEMENT_PREFIX, block);
  }
  if (JavaScript.STATEMENT_SUFFIX) {
    xfix1 += JavaScript.injectId(JavaScript.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = JavaScript.prefixLines(xfix1, JavaScript.INDENT);
  }
  let loopTrap = '';
  if (JavaScript.INFINITE_LOOP_TRAP) {
    loopTrap = JavaScript.prefixLines(
      JavaScript.injectId(JavaScript.INFINITE_LOOP_TRAP, block),
      JavaScript.INDENT
    );
  }
  const branch = block.getFieldValue('STACK') || '';
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = JavaScript.variableDB_.getName(
      variables[i],
      Names.NameType.PROCEDURE
    );
  }
  let code =
    'function ' +
    funcName +
    '(' +
    args.join(', ') +
    ') {\n' +
    xfix1 +
    loopTrap +
    branch +
    '\n}';
  code = JavaScript.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  JavaScript.definitions_['%' + funcName] = code;
};

JavaScript.forBlock['procedures_defnoreturn'] =
  JavaScript.forBlock['procedures_defreturn'];

JavaScript.forBlock['procedures_calleval'] = function (
  block: Block
): [string, number] {
  // Call a procedure with a return value.
  const funcName = JavaScript.variableDB_.getName(
    block.getFieldValue('NAME'),
    Names.NameType.PROCEDURE
  );
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] =
      JavaScript.valueToCode(block, 'ARG' + i, JavaScript.ORDER_NONE) || 'null';
  }
  const code = funcName + '(' + args.join(', ') + ')';
  return [code, JavaScript.ORDER_FUNCTION_CALL];
};
