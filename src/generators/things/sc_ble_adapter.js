/**
 * @fileoverview Block definitions for the SC-BLE-Adapter
 * (https://github.com/wintechis/sc-ble-adapter).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*******************
 * Property blocks.*
 *******************/

/**
 * Generates JavaScript code for the get_signal_strength block.
 * @param {Blockly.Block} block the get_signal_strength block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['get_signal_strength'] = function(block) {
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'MAC',
      Blockly.JavaScript.ORDER_NONE,
  );
  const code = `getRSSI(${mac})`;
    
  return [code, Blockly.JavaScript.ORDER_NONE];
};
