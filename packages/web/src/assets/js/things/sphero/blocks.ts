/**
 * @fileoverview Blocks definitions for blocks interacting with the SpheroMini.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {implementedThings} from '../../things';
import {
  UUID_SPHERO_SERVICE,
  UUID_SPHERO_SERVICE_INITIALIZE,
} from './lib/spheroBolt';
import SpheroBolt from './lib/spheroBolt';

import {Blocks, dialog, Events, FieldTextInput} from 'blockly';
import {getWorkspace} from '../../interpreter';
import {Abstract} from 'blockly/core/events/events_abstract';
import {BlockCreate} from 'blockly/core/events/events_block_create';

export const spheroInstances = new Map();
export const spheroIds = new Map();

/**
 * Keeps singleton instances of SpheroMinis instantiated by BLAST.
 * @param id The id of the SpheroMini.
 */
export const getSpheroMini = function (id: string): SpheroBolt {
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
 * @param block the things_spheroMini block.
 * @returns the generated code.
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
    this.thing = null;
    getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_CREATE &&
        (e as BlockCreate).ids?.includes(this.id)
      ) {
        if (!navigator.bluetooth) {
          dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
          this.dispose();
          return;
        }
        this.thing = getSpheroMini(this.getFieldValue('id'));
        spheroIds.set(this.getFieldValue('name'), this.getFieldValue('id'));
      }
    });
  },
};

Blocks['spheroMini_roll'] = {
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
    getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_CREATE &&
        (e as BlockCreate).ids?.includes(this.id)
      ) {
        if (!navigator.bluetooth) {
          dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
          this.dispose();
          return;
        }
      }
    });
  },
};

const SPHEROMINI_ROLL_XML = `
<block type="spheroMini_roll">
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

Blocks['spheroMini_stop'] = {
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
    getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_CREATE &&
        (e as BlockCreate).ids?.includes(this.id)
      ) {
        if (!navigator.bluetooth) {
          dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
          this.dispose();
          return;
        }
      }
    });
  },
};

Blocks['spheroMini_color'] = {
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
    getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_CREATE &&
        (e as BlockCreate).ids?.includes(this.id)
      ) {
        if (!navigator.bluetooth) {
          dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
          this.dispose();
          return;
        }
      }
    });
  },
};

// Add spheromini blocks to the list of implemented things.
implementedThings.push({
  id: 'spheroMini',
  name: 'Sphero Mini',
  type: 'bluetooth',
  blocks: [
    {
      type: 'spheroMini_roll',
      category: 'Actions',
      XML: SPHEROMINI_ROLL_XML,
    },
    {
      type: 'spheroMini_stop',
      category: 'Actions',
    },
    {
      type: 'spheroMini_color',
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
