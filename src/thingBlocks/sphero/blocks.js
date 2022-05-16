import {implementedThings} from '../../blast_things.js';
import {
  UUID_SPHERO_SERVICE,
  UUID_SPHERO_SERVICE_INITIALIZE,
} from './lib/spheroBolt.js';
import SpheroBolt from './lib/spheroBolt.js';

import Blockly from 'blockly';
const {Blocks, FieldTextInput} = Blockly;

const spheroInstances = new Map();

/**
 * Keeps singleton instances of SpheroMinis instantiated by BLAST.
 * @param {string} id The id of the SpheroMini.
 */
const getSpheroMini = function (id) {
  if (spheroInstances.has(id)) {
    return spheroInstances.get(id);
  } else {
    const thing = new SpheroBolt(id);
    spheroInstances.set(id, thing);
    return thing;
  }
};

/**
 * Generates JavaScript code for the things_spheroMini block.
 * @param {Blockly.Block} block the things_spheroMini block.
 * @returns {String} the generated code.
 */
Blocks['things_spheroMini'] = {
  /**
   * Block representing a SpheroMini.
   * @this Blockly.Block
   */
  init: function () {
    this.appendDummyInput()
      .appendField('SpheroMini')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput()
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A Sphero Mini.');
    this.setHelpUrl('');
    this.getField('name').setEnabled(false);
    this.firstTime = true;
    this.webBluetoothId = '';
    this.thing = null;
  },
  onchange: function () {
    // on creating this block initialize new instance of SpheroMini
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.webBluetoothId = this.getFieldValue('id');
      this.firstTime = false;
      this.thing = getSpheroMini(this.webBluetoothId);
    }
  },
};

Blocks['sphero_roll'] = {
  /**
   * Block representing a roll command.
   * @this Blockly.Block
   */
  init: function () {
    this.appendDummyInput().appendField('send roll command');
    this.appendValueInput('speed').appendField('with speed').setCheck('Number');
    this.appendValueInput('heading')
      .appendField('and heading')
      .setCheck('Number');
    this.appendValueInput('thing')
      .appendField('to SpheroMini')
      .setCheck('Thing');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Rolls the Sphero Mini.');
    this.setHelpUrl('');
  },
};

const SPHERO_ROLL_XML = `
<block type="sphero_roll">
  <value name="speed">
    <block type="number_value">
      <field name="NUM">200</field>
    </block>
  </value>
  <value name="heading">
    <block type="number_value">
      <field name="NUM">0</field>
    </block>
  </value>
</block>
`;

Blocks['sphero_stop'] = {
  /**
   * Block representing a stop command.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput('thing')
      .appendField('send stop command to SpheroMini')
      .setCheck('Thing');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Stops the Sphero Mini.');
    this.setHelpUrl('');
  },
};

Blocks['sphero_color'] = {
  /**
   * Block representing a color command.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput('thing')
      .appendField('set LED color property of SpheroMini')
      .setCheck('Thing');
    this.appendValueInput('color').appendField('to colour').setCheck('Colour');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Sets the LED color of the Sphero Mini.');
    this.setHelpUrl('');
  },
};

// Add spheromini blocks to the list of implemented things.
implementedThings.push({
  id: 'spheroMini',
  name: 'Sphero Mini',
  type: 'bluetooth',
  blocks: [
    {
      type: 'sphero_roll',
      category: 'Actions',
      XML: SPHERO_ROLL_XML,
    },
    {
      type: 'sphero_stop',
      category: 'Actions',
    },
    {
      type: 'sphero_color',
      category: 'Properties',
    },
  ],
  infoUrl: 'https://github.com/wintechis/blast/wiki/SpheroMini',
  filters: [
    {
      services: [UUID_SPHERO_SERVICE],
    },
  ],
  optionalServices: [UUID_SPHERO_SERVICE_INITIALIZE],
});
