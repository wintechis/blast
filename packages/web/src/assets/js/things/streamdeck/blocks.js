/**
 * @fileoverview Blocks definitions for the ElGato Stream Deck, see
 * (https://www.elgato.com/de/stream-deck).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {
  ALIGN_CENTRE,
  Blocks,
  Events,
  FieldCheckbox,
  FieldDropdown,
  FieldTextInput,
} = Blockly;

import {eventsInWorkspace, getWorkspace} from '../../interpreter.js';
import {implementedThings, getWebHidDevice} from '../../things.js';
import StreamDeck from '@elgato-stream-deck/webhid';

globalThis['StreamDeck'] = StreamDeck;

const streamDeckInstances = new Map();
let openening = false;

/**
 * Keeps singleton instances of StreamDeck instantiated by BLAST.
 * @param {string} id The id of the StreamDeck.
 */
export const getStreamdeck = async function (id) {
  if (streamDeckInstances.has(id)) {
    return streamDeckInstances.get(id);
  } else {
    if (openening) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return getStreamdeck(id);
    }
    const device = getWebHidDevice(id);
    openening = true;
    const thing = await StreamDeck.openDevice(device);
    streamDeckInstances.set(id, thing);
    openening = false;
    return thing;
  }
};

Blocks['things_streamdeck'] = {
  /**
   * Block representing a StreamDeck.
   * @this Blockly.Block
   */
  init: function () {
    this.appendDummyInput()
      .appendField('StreamDeck')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput()
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('An Elgato StreamDeck');
    this.setHelpUrl('https://github.com/wintechis/blast/wiki/Stream-Deck');
    this.getField('name').setEnabled(false);
    this.firstTime = true;
    this.webHidId = '';
    this.thing = null;
  },
  onchange: function () {
    // on creating this block initialize new instance of Streamdeck
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.webHidId = this.getFieldValue('id');
      this.firstTime = false;
      getStreamdeck(this.webHidId).then(thing => {
        this.thing = thing;
      });
    }
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
      .appendField('Stream Deck Mini');
    this.appendDummyInput()
      .appendField('on button')
      .appendField(
        new FieldDropdown([
          ['up', 'up'],
          ['down', 'down'],
        ]),
        'upDown'
      );
    this.appendDummyInput()
      .setAlign(ALIGN_CENTRE)
      .appendField(
        new FieldCheckbox('FALSE', value =>
          this.uncheckAllOtherCheckboxes(value, 'button1')
        ),
        'button1'
      )
      .appendField(
        new FieldCheckbox('FALSE', value =>
          this.uncheckAllOtherCheckboxes(value, 'button2')
        ),
        'button2'
      )
      .appendField(
        new FieldCheckbox('FALSE', value =>
          this.uncheckAllOtherCheckboxes(value, 'button3')
        ),
        'button3'
      );
    this.appendDummyInput()
      .setAlign(ALIGN_CENTRE)
      .appendField(
        new FieldCheckbox('FALSE', value =>
          this.uncheckAllOtherCheckboxes(value, 'button4')
        ),
        'button4'
      )
      .appendField(
        new FieldCheckbox('FALSE', value =>
          this.uncheckAllOtherCheckboxes(value, 'button5')
        ),
        'button5'
      )
      .appendField(
        new FieldCheckbox('FALSE', value =>
          this.uncheckAllOtherCheckboxes(value, 'button6')
        ),
        'button6'
      );
    this.appendStatementInput('statements').appendField('do').setCheck(null);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
    this.changeListener = null;
    this.requested = false;
    this.keyState = new Array(6).fill(false);
  },
  /**
   * Unchecks all other checkboxes than the one that was clicked.
   * @param {string} value the new value of the checkbox.
   * @param {string} checkboxName Name of the ceckbox that was clicked.
   */
  uncheckAllOtherCheckboxes: function (value, checkboxName) {
    if (value === 'TRUE') {
      for (let i = 1; i <= 6; i++) {
        if ('button' + i !== checkboxName) {
          this.setFieldValue('FALSE', 'button' + i);
        }
      }
    }
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: async function () {
    eventsInWorkspace.push(this.id);
    // remove event if block is deleted
    this.changeListener = getWorkspace().addChangeListener(event =>
      this.onDispose(event)
    );
  },
  onchange: function () {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.addEvent();
    }
  },
  onDispose: function (event) {
    if (event.type === Events.BLOCK_DELETE) {
      if (
        event.type === Events.BLOCK_DELETE &&
        event.ids.indexOf(this.id) !== -1
      ) {
        // block is being deleted
        this.removeFromEvents();
        getWorkspace().removeChangeListener(this.changeListener);
      }
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
