/**
 * @fileoverview Block definitions for the Xiaomi Flower Care blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Blocks, dialog, FieldTextInput} from 'blockly';
import {implementedThings} from '../../things.js';

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
    this.firstTime = true;
  },
  onchange: function () {
    // on creating this block check webBluetooth availability
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        dialog.alert(`Webbluetooth is not supported by this browser.\n
        Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
        this.dispose();
      }
    }
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
  },
  onchange: function () {
    // on creating this block check webBluetooth availability.
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        dialog.alert(`Webbluetooth is not supported by this browser.\n
                Upgrade to Chrome version 85 or later.`);
        this.dispose();
      }
    }
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
