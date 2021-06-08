/**
 * @fileoverview Generating JavaScript for blocks in the things category.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

Blockly.JavaScript['things_webBluetooth'] = function(block) {
  const id = Blockly.JavaScript.quote_(block.getFieldValue('id'));

  return [id, Blockly.JavaScript.ORDER_NONE];
};
