/**
 * @fileoverview Loop blocks for Blast.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {addBlock} from '../../../BlocklyWorkspace/toolbox.ts';
import {eventsInWorkspace} from '../../interpreter.ts';
import {Blocks, Events, FieldDropdown} from 'blockly';

// Remap blockly blocks to improve naming in xml.
Blocks['repeat'] = Blocks['controls_repeat_ext'];
Blocks['for'] = Blocks['controls_for'];
Blocks['while_until'] = Blocks['controls_whileUntil'];
Blocks['break_continue'] = Blocks['controls_flow_statements'];
Blocks['conditional_statement'] = Blocks['controls_if'];

// add changed names to Loops constant to ensure correct execution.
// libraryBlocks.loops.loopTypes.add('repeat');
// libraryBlocks.loops.loopTypes.add('while_until');
// libraryBlocks.loops.loopTypes.add('for');

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
addBlock('repeat', 'Loops', REPEAT_XML);

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
addBlock('for', 'Loops', FOR_XML);

Blocks['wait_seconds'] = {
  /**
   * Block for executing a sleep/timeout command.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('SECONDS').appendField('wait').setCheck('Number');
    this.appendDummyInput().appendField('seconds');
    this.setColour(180);
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
addBlock('wait_seconds', 'Loops', WAIT_SECONDS_XML);

Blocks['every_seconds'] = {
  /**
   * Block for every x minutes event.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput('value').appendField('every').setCheck('Number');
    this.appendDummyInput('units').appendField(
      new FieldDropdown([
        ['seconds', 'seconds'],
        ['minutes', 'minutes'],
        ['hours', 'hours'],
      ]),
      'units'
    );
    this.appendStatementInput('statements').appendField('do');
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: function () {
    eventsInWorkspace.push(this.id);
  },
  /**
   * Remove this block's id from the events array.
   */
  removeFromEvents: function () {
    // remove this block from the events array.
    const index = eventsInWorkspace.indexOf(this.id);
    if (index !== -1) {
      eventsInWorkspace.splice(index, 1);
    }
  },
  onchange: function (event) {
    if (!this.workspace || this.workspace.isFlyout) {
      // Block is deleted or is in a flyout.
      return;
    }
    if (!event.recordUndo) {
      // Events not generated by user. Skip handling.
      return;
    }
    if (
      event.type === Events.BLOCK_CREATE &&
      event.ids.indexOf(this.id) !== -1
    ) {
      this.addEvent();
    } else if (event.type === Events.BLOCK_DELETE) {
      // Remove this blocks eventListeners.
      this.removeFromEvents();
    }
  },
};

const EVERY_SECONDS_XML = `
<block type="every_seconds">
  <field name="units">seconds</field>
  <value name="value">
    <block type="number_value">
      <field name="NUM">10</field>
    </block>
  </value>
</block>`;

// Add the wait_seconds block to the toolbox
addBlock('every_seconds', 'Loops', EVERY_SECONDS_XML);

Blocks['terminate'] = {
  /**
   * Block for terminating the execution.
   */
  init: function () {
    this.appendDummyInput().appendField('terminate program');
    this.setColour(120);
    this.setTooltip('Stops the program currently being executed in BLAST.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl('');
  },
};

// Add the terminate block to the toolbox.
addBlock('terminate', 'Loops');
