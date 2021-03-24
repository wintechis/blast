/**
 * @fileoverview Generating JavaScript for numbers blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 */

'use strict';

Blockly.JavaScript['number_value'] = Blockly.JavaScript['math_number'];

Blockly.JavaScript['number_infinity'] = function(block) {
  return [Infinity, Blockly.JavaScript.ORDER_NONE];
};
  
Blockly.JavaScript['number_arithmetic'] = function(block) {
  // Basic arithmetic operators, and modulo and power.
  const OPERATORS = {
    ADD: [' + ', Blockly.JavaScript.ORDER_ADDITION],
    MINUS: [' - ', Blockly.JavaScript.ORDER_SUBTRACTION],
    MULTIPLY: [' * ', Blockly.JavaScript.ORDER_MULTIPLICATION],
    DIVIDE: [' / ', Blockly.JavaScript.ORDER_DIVISION],
    MODULO: [' % ', Blockly.JavaScript.ORDER_DIVISION],
    POWER: [null, Blockly.JavaScript.ORDER_NONE], // Handle power separately.
  };
  const tuple = OPERATORS[block.getFieldValue('OP')];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
  const argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
  let code;
  // Power in JavaScript requires a special case since it has no operator.
  if (!operator) {
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.JavaScript['number_random'] = function(block) {
  // Random integer between [X] and [Y].
  const argument0 =
      Blockly.JavaScript.valueToCode(
          block,
          'FROM',
          Blockly.JavaScript.ORDER_NONE,
      ) || '0';
  const argument1 =
      Blockly.JavaScript.valueToCode(
          block,
          'TO',
          Blockly.JavaScript.ORDER_NONE,
      ) || '0';
  
  const code = `numberRandom(${argument0}, ${argument1})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
