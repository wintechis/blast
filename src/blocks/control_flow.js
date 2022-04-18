/**
 * @fileoverview Control flow blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {addBlock} from './../blast_toolbox.js';
import Blockly from 'blockly';

// Remap blockly blocks to improve naming in xml.
Blockly.Blocks['repeat'] = Blockly.Blocks['controls_repeat_ext'];
Blockly.Blocks['for'] = Blockly.Blocks['controls_for'];
Blockly.Blocks['while_until'] = Blockly.Blocks['controls_whileUntil'];
Blockly.Blocks['break_continue'] = Blockly.Blocks['controls_flow_statements'];
Blockly.Blocks['conditional_statement'] = Blockly.Blocks['controls_if'];

// add changed names to Loops constant to ensure correct execution.
Blockly.blocks.all.loops.loopTypes.add('repeat');
Blockly.blocks.all.loops.loopTypes.add('while_until');
Blockly.blocks.all.loops.loopTypes.add('for');

// Define inner block XML for the repeat block.
const REPEAT_XML = `
<block type="repeat">
  <value name="TIMES">
    <block type="math_number">
      <field name="NUM">10</field>
    </block>
  </value>
</block>`;

// Add repeat block to the block library.
addBlock('repeat', 'Control Flow', REPEAT_XML);

// Define inner block XML for the for block.
const FOR_XML = `
<block type="for">
  <value name="FROM">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
  </value>
  <value name="TO">
    <block type="math_number">
      <field name="NUM">5</field>
    </block>
  </value>
  <value name="BY">
    <block type="math_number">
      <field name="NUM">1</field>
    </block>
  </value>
</block>`;

// Add for block to the toolbox.
addBlock('for', 'Control Flow', FOR_XML);

Blockly.Blocks['wait_seconds'] = {
  /**
   * Block for executing a sleep/timeout command.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('SECONDS').appendField('wait').setCheck('Number');
    this.appendDummyInput().appendField('seconds');
    this.setColour(120);
    this.setTooltip('Wait x seconds before executing the next block.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl('');
  },
};

// Define inner block XML for the wait_seconds block
const WAIT_SECONDS_XML = `
<block type="wait_seconds">
  <value name="SECONDS">
    <block type="math_number">
      <field name="NUM">1</field>
    </block>
  </value>
</block>
`;

// Add the wait_seconds block to the toolbox
addBlock('wait_seconds', 'Control Flow', WAIT_SECONDS_XML);
