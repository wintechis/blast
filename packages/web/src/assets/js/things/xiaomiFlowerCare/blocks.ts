/**
 * @fileoverview Block definitions for the Xiaomi Flower Care blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Blocks, dialog, Events, FieldTextInput} from 'blockly';
import {getWorkspace} from '../../interpreter';
import {implementedThings} from '../../../../tabs/Devices/things';
import {Abstract} from 'blockly/core/events/events_abstract';
import {BlockCreate} from 'blockly/core/events/events_block_create';

Blocks['things_xiaomiFlowerCare'] = {
  /**
   * Block representing a Xiaomi Plant Sensor.
   * @this {Blockly.Block}
   * @return {null}.
   */
  init: function () {
    this.appendDummyInput()
      .appendField('Xiaomi Flower Care')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput()
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A Xiaomi Flower Care plant sensor.');
    this.setHelpUrl('');
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

/**
 * Block for reading a property of a Xiaomi Flower Care.
 * @this {Blockly.Block}
 * @return {null}.
 */
Blocks['xiaomiFlowerCare_read'] = {
  init: function () {
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('read environmental parameters');
    this.setOutput(true, null);
    this.setColour(260);
    this.setTooltip('');
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

// Add Xiaomi Flower Care to the list of implemented things.
implementedThings.push({
  id: 'xiaomiFlowerCare',
  name: 'Xiaomi Flower Care',
  type: 'bluetooth',
  blocks: [
    {
      type: 'xiaomiFlowerCare_read',
      category: 'Properties',
    },
  ],
  filters: [
    {
      name: 'Flower care',
    },
  ],
  optionalServices: ['00001204-0000-1000-8000-00805f9b34fb'],
  infoUrl: '',
});
