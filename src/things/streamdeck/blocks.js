/**
 * @fileoverview Blocks definitions for the ElGato Stream Deck, see
 * (https://www.elgato.com/de/stream-deck).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['streamdeck_button_event'] = {
  /**
   * Block handling streamdeck button pushes.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('id')
        .setCheck('Thing')
        .appendField('Streamdeck mini');
    this.appendDummyInput()
        .appendField('on button')
        .appendField(new Blockly.FieldDropdown([
          ['up', 'up'],
          ['down', 'down'],
        ]), 'upDown');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox('FALSE', (value) => this.uncheckAllOtherCheckboxes(value, 'button1')), 'button1')
        .appendField(new Blockly.FieldCheckbox('FALSE', (value) => this.uncheckAllOtherCheckboxes(value, 'button2')), 'button2')
        .appendField(new Blockly.FieldCheckbox('FALSE', (value) => this.uncheckAllOtherCheckboxes(value, 'button3')), 'button3');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox('FALSE', (value) => this.uncheckAllOtherCheckboxes(value, 'button4')), 'button4')
        .appendField(new Blockly.FieldCheckbox('FALSE', (value) => this.uncheckAllOtherCheckboxes(value, 'button5')), 'button5')
        .appendField(new Blockly.FieldCheckbox('FALSE', (value) => this.uncheckAllOtherCheckboxes(value, 'button6')), 'button6');
    this.appendDummyInput()
        .appendField('do');
    this.appendStatementInput('statements')
        .setCheck(null);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
    this.requested = false;
    this.keyState = new Array(6).fill(false);
  },
  /**
   * Unchecks all other checkboxes than the one that was clicked.
   * @param {string} value the new value of the checkbox.
   * @param {string} checkboxName Name of the ceckbox that was clicked.
   */
  uncheckAllOtherCheckboxes: function(value, checkboxName) {
    if (value === 'TRUE') {
      for (let i = 1; i <= 6; i++) {
        if ('button' + i != checkboxName) {
          this.setFieldValue('FALSE', 'button' + i);
        }
      }
    }
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: async function() {
    Blast.eventInWorkspace.push(this.id);
    // remove event if block is deleted
    Blast.workspace.addChangeListener((event) => this.onDispose(event));
  },
  onchange: function() {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.addEvent();
    }
  },
  onDispose: function(event) {
    if (event.type === Blockly.Events.BLOCK_DELETE) {
      if (event.type === Blockly.Events.BLOCK_DELETE && event.ids.indexOf(this.id) !== -1) {
        // block is being deleted
        this.removeFromEvents();
      }
    }
  },
  /**
   * Remove this block's id from the events array.
   */
  removeFromEvents: function() {
    // remove this block from the events array.
    const index = Blast.eventInWorkspace.indexOf(this.id);
    if (index !== -1) {
      Blast.eventInWorkspace.splice(index, 1);
    }
  },
};

// Add streamdeck_button_event block to the toolbox.
Blast.Toolbox.addBlock('streamdeck_button_event', 'States and Events');


Blockly.Blocks['streamdeck_color_buttons'] = {
  /**
   * Block for coloring stream deck buttons.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('color')
        .setCheck('Colour')
        .appendField('write color');
    this.appendDummyInput()
        .appendField('to display property of button(s)');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button1')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button2')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button3');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button4')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button5')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button6');
    this.appendValueInput('id')
        .setCheck('Thing')
        .appendField('of Stream Deck mini');
    this.setColour(255);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.requested = false;
    this.keyState = new Array(6).fill(false);
  },
};

// Define inner block XML for the streamdeck_color_buttons block.
const STREAMDECK_COLOR_BUTTONS_XML = `
<block type="streamdeck_color_buttons">
  <value name="color">
    <block type="colour_picker">
      <field name="COLOUR">#ffff00</field>
    </block>
  </value>
</block>
`;

// Add streamdeck_color_buttons block to the toolbox.
Blast.Toolbox.addBlock('streamdeck_color_buttons', 'Properties', STREAMDECK_COLOR_BUTTONS_XML);


Blockly.Blocks['streamdeck_write_on_buttons'] = {
  /**
   * Block for writing on stream deck buttons.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('value')
        .setCheck(['String', 'Number', 'Boolean'])
        .appendField('write Number/String/Boolean');
    this.appendDummyInput()
        .appendField('to display property of button(s)');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button1')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button2')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button3');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button4')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button5')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button6');
    this.appendValueInput('id')
        .setCheck('Thing')
        .appendField('of Stream Deck mini');
    this.setColour(255);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.requested = false;
    this.keyState = new Array(6).fill(false);
  },
};

// Add streamdeck_write_on_buttons block to the toolbox.
Blast.Toolbox.addBlock('streamdeck_write_on_buttons', 'Properties');
