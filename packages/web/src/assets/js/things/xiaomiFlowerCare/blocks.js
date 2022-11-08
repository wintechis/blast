/**
 * @fileoverview Block definitions for the Xiaomi Flower Care blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {Blocks, dialog, FieldTextInput} = Blockly;
import {implementedThings} from '../../things.js';

const {XiaomiFlowerCare} = tds;

const xiaomiFlowerCareInstances = new Map();

/**
 * Keeps singleton instances of XiaomiPlantSensor instantiated by BLAST.
 * @param {string} id the id of the XiaomiPlantSensor.
 * @return {XiaomiPlantSensor} the instance.
 */
const getXiaomiFlowerCare = async function (id) {
  if (xiaomiFlowerCareInstances.has(id)) {
    return xiaomiFlowerCareInstances.get(id);
  } else {
    const thing =  await createThing(XiaomiFlowerCare, id);
    xiaomiFlowerCareInstances.set(id, thing);
    return thing;
  }
};

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
    this.thing = null;
  },

  onchange: function () {
    // on creating this block initialize new instance of XiaomiPlantSensor
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      const webBluetoothId = this.getFieldValue('id');
      this.firstTime = false;
      getXiaomiFlowerCare(webBluetoothId)
        .then(thing => {
          this.thing = thing;
        });
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
