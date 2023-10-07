/**
 * @fileoverview Blocks definitions for the Philips Hue.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Blocks, dialog, Events, FieldTextInput} from 'blockly';
import {getWorkspace} from '../../interpreter';
import {implementedThings} from '../../../../tabs/Devices/things';
import {Abstract} from 'blockly/core/events/events_abstract';
import {BlockCreate} from 'blockly/core/events/events_block_create';

Blocks['things_hue'] = {
  /**
   * Block representing a BLE RGB LED controller.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput('name')
      .appendField('Philips hue', 'label')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput('id')
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A Philips hue light bulb.');
    this.setHelpUrl('https://github.com/wintechis/blast/wiki/Philips-Hue');
    this.getField('name').setEnabled(false);
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

Blocks['hue_colour'] = {
  /**
   * Block for switchling the hue's colour.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('colour')
      .setCheck('Colour')
      .appendField('write colour property', 'label');
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('to Philips hue', 'label');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Changes the colour of the Philips hue.');
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

// Define inner block XML for the bleLedController_switch_lights block.
const COLOUR_XML = `
<block type="hue_colour">
  <value name="colour">
    <block type="colour_picker">
      <field name="COLOUR">#ff0000</field>
    </block>
  </value>
</block>`;

Blocks['hue_power'] = {
  /**
   * Block for switchling the hue's power.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('power')
      .setCheck('Boolean')
      .appendField('write power property', 'label');
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('to Philips hue', 'label');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Changes the power of the Philips hue.');
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

// Define inner block XML for the bleLedController_switch_lights block.
const POWER_XML = `
<block type="hue_power">
  <value name="power">
    <block type="logic_boolean">
      <field name="BOOL">TRUE</field>
    </block>
  </value>
</block>`;

Blocks['hue_brightness'] = {
  /**
   * Block for changing the hue's brightness.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('brightness')
      .setCheck('Number')
      .appendField('write brightness property', 'label');
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('to Philips hue', 'label');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Changes the brightness of the Philips hue. (0-254)');
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

const BRIGHTNESS_XML = `
<block type="hue_brightness">
  <value name="brightness">
    <block type="math_number">
      <field name="NUM">127</field>
    </block>
  </value>
</block>`;

// Add LED Controller block to the list of implemented things.
implementedThings.push({
  id: 'hue',
  name: 'Philips hue',
  type: 'bluetooth',
  blocks: [
    {
      type: 'hue_colour',
      category: 'Properties',
      XML: COLOUR_XML,
    },
    {
      type: 'hue_power',
      category: 'Properties',
      XML: POWER_XML,
    },
    {
      type: 'hue_brightness',
      category: 'Properties',
      XML: BRIGHTNESS_XML,
    },
    {
      type: 'things_hue',
      category: 'Things',
    },
  ],
  filters: [
    {
      services: [
        '00001800-0000-1000-8000-00805f9b34fb',
        '00001801-0000-1000-8000-00805f9b34fb',
        '0000180a-0000-1000-8000-00805f9b34fb',
        '0000fe0f-0000-1000-8000-00805f9b34fb',
        '932c32bd-0000-47a2-835a-a8d455b859dd',
        '9da2ddf1-0000-44d0-909c-3f3d3cb34a7b',
        'b8843add-0000-4aa1-8794-c3f462030bda',
      ],
    },
  ],
  infoUrl: 'https://github.com/wintechis/blast/wiki/Philips-Hue',
  optionalServices: ['932c32bd-0000-47a2-835a-a8d455b859dd'],
});
