/**
 * @fileoverview Generating JavaScript for identifier blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.JavaScript['uri'] = function(block) {
  const uri = Blockly.JavaScript.quote_(block.getFieldValue('URI'));
  return [uri, Blockly.JavaScript.ORDER_NONE];
};
  
Blockly.JavaScript['mac'] = function(block) {
  const mac = Blockly.JavaScript.quote_(block.getFieldValue('MAC'));
  return [mac, Blockly.JavaScript.ORDER_NONE];
};
  
