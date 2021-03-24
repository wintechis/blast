/**
 * @fileoverview Generating JavaScript for Blast's control flow blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 */

'use strict';

// Remap blockly blocks to improve naming in xml.
Blockly.JavaScript['repeat'] = Blockly.JavaScript['controls_repeat_ext'];
Blockly.JavaScript['while_until'] = Blockly.JavaScript['controls_whileUntil'];
Blockly.JavaScript['for'] = Blockly.JavaScript['controls_for'];
Blockly.JavaScript['break_continue'] =
  Blockly.JavaScript['controls_flow_statements'];
Blockly.JavaScript['conditional_statement'] = Blockly.JavaScript['controls_if'];

Blockly.JavaScript['wait_seconds'] = function(block) {
  const seconds = Number(block.getFieldValue('SECONDS'));
  const code = 'waitForSeconds(' + seconds + ');\n';
  return code;
};
  
