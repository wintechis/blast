/**
 * @fileoverview Control flow blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

// Remap blockly blocks to improve naming in xml.
Blockly.Blocks['repeat'] = Blockly.Blocks['controls_repeat_ext'];
Blockly.Blocks['while_until'] = Blockly.Blocks['controls_whileUntil'];
Blockly.Blocks['for'] = Blockly.Blocks['controls_for'];
Blockly.Blocks['break_continue'] = Blockly.Blocks['controls_flow_statements'];
Blockly.Blocks['conditional_statement'] = Blockly.Blocks['controls_if'];

// add changed names to Loops constant to ensure correct execution.
Blockly.Constants.Loops.CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.LOOP_TYPES.push(
    'repeat',
    'while_until',
    'for',
);

Blockly.Blocks['wait_seconds'] = {
  /**
     * Block for executing a sleep/timeout command.
     * @this {Blockly.Block}
     */
  init: function() {
    this.appendDummyInput()
        .appendField('wait')
        .appendField(
            new Blockly.FieldNumber('1, 0, 600'),
            'SECONDS',
        )
        .appendField('seconds');
    this.setColour(120);
    this.setTooltip('Wait x seconds before executing the next block.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl('');
  },
};
