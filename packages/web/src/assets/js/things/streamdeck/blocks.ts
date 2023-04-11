/**
 * @fileoverview Blocks definitions for the ElGato Stream Deck, see
 * (https://www.elgato.com/de/stream-deck).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {
  ALIGN_CENTRE,
  Blocks,
  Events,
  FieldCheckbox,
  FieldTextInput,
  Names,
} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

import {eventsInWorkspace, getWorkspace} from '../../interpreter';
import {implementedThings} from '../../things.js';
import {BlockDelete} from 'blockly/core/events/events_block_delete';
import {BlockBase} from 'blockly/core/events/events_block_base';

Blocks['things_streamdeck'] = {
  /**
   * Block representing a StreamDeck.
   * @this Blockly.Block
   */
  init: function () {
    this.appendDummyInput()
      .appendField('StreamDeck Mini')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput()
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('An Elgato StreamDeck');
    this.setHelpUrl('https://github.com/wintechis/blast/wiki/Stream-Deck');
    this.getField('name').setEnabled(false);
  },
};

Blocks['streamdeck_button_event'] = {
  /**
   * Block handling streamdeck button pushes.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('on')
      .appendField(new FieldTextInput('inputreport'), 'eventType')
      .appendField('events of Streamdeck mini');
    this.appendDummyInput().appendField('uses variables');
    this.appendDummyInput()
      .appendField(new FieldTextInput('button1'), 'button1')
      .appendField(new FieldTextInput('button2'), 'button2')
      .appendField(new FieldTextInput('button3'), 'button3');
    this.appendDummyInput()
      .appendField(new FieldTextInput('button4'), 'button4')
      .appendField(new FieldTextInput('button5'), 'button5')
      .appendField(new FieldTextInput('button6'), 'button6');
    this.appendStatementInput('statements').appendField('do').setCheck(null);
    this.setInputsInline(false);
    this.setColour(180);
    this.setTooltip("Handles 'inputreport' events of a Streamdeck mini.");
    this.setHelpUrl('');
    this.getField('eventType').setEnabled(false);
    this.getField('button1').setEnabled(false);
    this.getField('button2').setEnabled(false);
    this.getField('button3').setEnabled(false);
    this.getField('button4').setEnabled(false);
    this.getField('button5').setEnabled(false);
    this.getField('button6').setEnabled(false);
    this.changeListener = null;
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: function () {
    eventsInWorkspace.push(this.id);
    // add change listener to remove block from events array when deleted.
    this.changeListener = getWorkspace()?.addChangeListener((e: BlockBase) => {
      if (
        e.type === Events.BLOCK_DELETE &&
        (e as BlockDelete).ids?.includes(this.id)
      ) {
        this.removeFromEvents();
      }
    });
  },
  onchange: function () {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.requested = true;
      this.addEvent();
      this.createVars();
    }
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
  createVars: function () {
    const ws = getWorkspace();
    if (ws === null) {
      return;
    }
    const varNames = [
      'button1',
      'button2',
      'button3',
      'button4',
      'button5',
      'button6',
    ];
    for (const varName of varNames) {
      // create legal variable name
      let legalName = JavaScript.nameDB_.getName(
        varName,
        Names.NameType.VARIABLE
      );
      for (let i = 1; ws.getVariable(legalName) !== null; i++) {
        legalName = JavaScript.nameDB_.getName(
          varName + '-' + i,
          Names.NameType.VARIABLE
        );
      }
      // create variable
      legalName = ws.createVariable(legalName).name;
      // set variable name in block
      this.getField(varName).setValue(legalName);
    }
  },
};

Blocks['streamdeck_color_buttons'] = {
  /**
   * Block for coloring stream deck buttons.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('color')
      .setCheck('Colour')
      .appendField('write color');
    this.appendDummyInput().appendField('to display property of button(s)');
    this.appendDummyInput()
      .setAlign(ALIGN_CENTRE)
      .appendField(new FieldCheckbox('FALSE'), 'button1')
      .appendField(new FieldCheckbox('FALSE'), 'button2')
      .appendField(new FieldCheckbox('FALSE'), 'button3');
    this.appendDummyInput()
      .setAlign(ALIGN_CENTRE)
      .appendField(new FieldCheckbox('FALSE'), 'button4')
      .appendField(new FieldCheckbox('FALSE'), 'button5')
      .appendField(new FieldCheckbox('FALSE'), 'button6');
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('of Stream Deck Mini');
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

Blocks['streamdeck_write_on_buttons'] = {
  /**
   * Block for writing on stream deck buttons.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('value')
      .setCheck(['String', 'Number', 'Boolean'])
      .appendField('write Number/String/Boolean');
    this.appendDummyInput().appendField('to display property of button(s)');
    this.appendDummyInput()
      .setAlign(ALIGN_CENTRE)
      .appendField(new FieldCheckbox('FALSE'), 'button1')
      .appendField(new FieldCheckbox('FALSE'), 'button2')
      .appendField(new FieldCheckbox('FALSE'), 'button3');
    this.appendDummyInput()
      .setAlign(ALIGN_CENTRE)
      .appendField(new FieldCheckbox('FALSE'), 'button4')
      .appendField(new FieldCheckbox('FALSE'), 'button5')
      .appendField(new FieldCheckbox('FALSE'), 'button6');
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('of Stream Deck Mini');
    this.setColour(255);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.requested = false;
    this.keyState = new Array(6).fill(false);
  },
};

Blocks['streamdeck_set_brightness'] = {
  /**
   * Block for setting the brightness of a stream deck.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('value')
      .setCheck('Number')
      .appendField('write brightness property');
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('to Stream Deck Mini');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

const STREAMDECK_SET_BRIGHTNESS_XML = `
<block type="streamdeck_set_brightness">
  <value name="value">
    <block type="math_number">
      <field name="NUM">100</field>
    </block>
  </value>
</block>
`;

// Add StreamDeck to list of implemented devices.
implementedThings.push({
  id: 'streamdeck',
  name: 'StreamDeck',
  type: 'hid',
  blocks: [
    {
      type: 'streamdeck_button_event',
      category: 'Events',
    },
    {
      type: 'streamdeck_color_buttons',
      category: 'Properties',
      XML: STREAMDECK_COLOR_BUTTONS_XML,
    },
    {
      type: 'streamdeck_write_on_buttons',
      category: 'Properties',
    },
    {
      type: 'streamdeck_set_brightness',
      category: 'Properties',
      XML: STREAMDECK_SET_BRIGHTNESS_XML,
    },
  ],
  infoUrl: 'https://github.com/wintechis/blast/wiki/Stream-Deck',
  filters: [
    {
      vendorId: 0x0fd9,
      productId: 0x0063,
    },
  ],
});
