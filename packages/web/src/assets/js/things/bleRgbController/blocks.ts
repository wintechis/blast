/**
 * @fileoverview Block definitions for a BLE RGB LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Blocks, dialog, Events, FieldTextInput} from 'blockly';
import {getWorkspace} from '../../interpreter';
import {implementedThings} from '../../../../ThingsStore/things';
import {Abstract} from 'blockly/core/events/events_abstract';
import {BlockCreate} from 'blockly/core/events/events_block_create';

Blocks['things_bleLedController'] = {
  /**
   * Block representing a BLE RGB LED controller.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput('name')
      .appendField('BLE LED controller', 'label')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput('id')
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A BLE LED controller.');
    this.setHelpUrl(
      'https://github.com/wintechis/blast/wiki/Bluetooth-LED-controller'
    );
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

Blocks['bleLedController_switch_lights'] = {
  /**
   * Block for switchling rgb lights.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('colour')
      .setCheck(['String', 'Number', 'Colour'])
      .appendField('write colour property', 'label');
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('to LED controller', 'label');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Switches checked lights on and unchecked ones off.');
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
const SWITCH_LIGHTS_RGB_XML = `
<block type="bleLedController_switch_lights">
  <value name="colour">
    <block type="colour_picker">
      <field name="COLOUR">#ff0000</field>
    </block>
  </value>
</block>`;

// Add LED Controller block to the list of implemented things.
implementedThings.push({
  id: 'bleLedController',
  name: 'LED Controller',
  type: 'bluetooth',
  blocks: [
    {
      type: 'bleLedController_switch_lights',
      category: 'Properties',
      XML: SWITCH_LIGHTS_RGB_XML,
    },
  ],
  filters: [
    {
      namePrefix: 'ELK-',
    },
    // Service is not advertised so we can not filter for it.
    //{
    //     services: ['0000fff0-0000-1000-8000-00805f9b34fb'],
    //},
  ],
  infoUrl: 'https://github.com/wintechis/blast/wiki/Bluetooth-LED-controller',
  optionalServices: ['0000fff0-0000-1000-8000-00805f9b34fb'],
});
