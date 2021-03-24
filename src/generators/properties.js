/**
 * @fileoverview Generating JavaScript for properties blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.JavaScript['get_temperature'] = function(block) {
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'MAC',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  const code = `getTemperature(${mac})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
  
Blockly.JavaScript['get_signal_strength'] = function(block) {
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'MAC',
      Blockly.JavaScript.ORDER_NONE,
  );
  const code = `getRSSI(${mac})`;
  
  return [code, Blockly.JavaScript.ORDER_NONE];
};
  
