/**
 * @fileoverview JavaScript code generators for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*******************
 * Property blocks.*
 *******************/

/**
 * Generates JavaScript code for the get_temperature block.
 * @param {Blockly.Block} block the get_temperature block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['get_temperature'] = function(block) {
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'MAC',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  const code = `getTemperature(${mac})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
