/**
 * @fileoverview Block definitions for a BLE RGB LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
import {Blocks, dialog, Events, FieldTextInput} from 'blockly';
import {implementedThings} from '../../../../ThingsStore/things';
import {getWorkspace} from '../../interpreter';
import {Abstract} from 'blockly/core/events/events_abstract';
import {BlockCreate} from 'blockly/core/events/events_block_create';

Blocks['things_govee'] = {
  /**
   * Block representing a Govee LED bulb.
   * (https://eu.govee.com/products/govee-smart-led-bulb)
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput('name')
      .appendField('Govee LED bulb', 'label')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput('id')
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A Govee LED bulb.');
    this.setHelpUrl('https://github.com/wintechis/blast/wiki/Govee-Light');
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

Blocks['govee_set_power'] = {
  /**
   * Block for switching the power of a Govee LED bulb.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('power')
      .setCheck(['Boolean', 'Number'])
      .appendField('set power to ', 'label');
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('of govee LED bulb', 'label');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Set the power of a Govee LED bulb.');
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

const SET_POWER_XML = `
<block type="govee_set_power">
  <value name="power">
    <block type="logic_boolean">
      <field name="BOOL">TRUE</field>
    </block>
  </value>
</block>`;

Blocks['govee_set_brightness'] = {
  /**
   * Block for setting the brightness of a Govee LED bulb.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('brightness')
      .setCheck(['Number'])
      .appendField('set brightness to', 'label');
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('of govee LED bulb', 'label');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Set the brightness of a Govee LED bulb.');
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

const SET_BRIGHTNESS_XML = `
<block type="govee_set_brightness">
  <value name="brightness">
    <block type="math_number">
      <field name="NUM">100</field>
    </block>
  </value>
</block>`;

Blocks['govee_set_colour'] = {
  /**
   * Block for setting the colour of a Govee LED bulb.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('colour')
      .setCheck(['String', 'Number', 'Colour'])
      .appendField('set colour to', 'label');
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('of govee LED bulb', 'label');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Set the colour of a Govee LED bulb.');
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

const SET_COLOUR_XML = `
<block type="govee_set_colour">
  <value name="colour">
    <block type="colour_picker">
      <field name="COLOUR">#ff0000</field>
    </block>
  </value>
</block>`;

implementedThings.push({
  id: 'govee',
  name: 'Govee LED bulb',
  type: 'bluetooth',
  blocks: [
    {
      type: 'govee_set_power',
      category: 'Properties',
      XML: SET_POWER_XML,
    },
    {
      type: 'govee_set_brightness',
      category: 'Properties',
      XML: SET_BRIGHTNESS_XML,
    },
    {
      type: 'govee_set_colour',
      category: 'Properties',
      XML: SET_COLOUR_XML,
    },
  ],
  infoUrl: 'https://github.com/wintechis/blast/wiki/Govee-Light',
  optionalServices: ['00010203-0405-0607-0809-0a0b0c0d1910'],
});
