/**
 * @fileoverview Generating JavaScript for Blast's function blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript, Names} from 'blockly';
import {apiFunctions} from './../blast_interpreter.js';

JavaScript['procedures_defeval'] = function (block) {
  const funcName = JavaScript.variableDB_.getName(
    block.getFieldValue('NAME'),
    Names.NameType.PROCEDURE_CATEGORY_NAME
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
      Names.NameType.VARIABLE_CATEGORY_NAME
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
  return null;
};

JavaScript['procedures_defnoreturn'] = JavaScript['procedures_defreturn'];

JavaScript['procedures_calleval'] = function (block) {
  // Call a procedure with a return value.
  const funcName = JavaScript.variableDB_.getName(
    block.getFieldValue('NAME'),
    Names.NameType.PROCEDURE_CATEGORY_NAME
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

// Add console to JSInterpreter for debugging with the procedures_calleval block.
apiFunctions.push(['log', console.log]);
