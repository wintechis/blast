import {implementedThings} from '../../blast_things.js';
import {
  UUID_SPHERO_SERVICE,
  UUID_SPHERO_SERVICE_INITIALIZE,
} from './lib/const.js';
import SpheroBolt from './lib/spheroBolt.js';

import {Blocks, FieldTextInput} from 'blockly';

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
      this.thing = new SpheroBolt();
      this.thing.connect().then(() => {
        const bolt = this.thing;
        bolt.on('onWillSleepAsync', () => {
          console.log('Waking up robot');
          bolt.wake();
        });
        bolt.on('onCompassNotify', async angle => {
          bolt.setAllLeds(0, 0, 0);
          bolt.setMainLedColor(255, 0, 0);
          await bolt.setHeading(angle);
        });
      });
    }
  },
};

Blocks['sphero_roll'] = {
  /**
   * Block representing a roll command.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput()
      .appendField('send roll command')
      .appendField('speed')
      .setCheck('Number');
    this.appendValueInput().appendField('heading').setCheck('Number');
    this.appendValueInput().appendField('to SpheroMini').setCheck('Thing');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Rolls the Sphero Mini.');
    this.setHelpUrl('');
  },
};

Blocks['sphero_stop'] = {
  /**
   * Block representing a stop command.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput()
      .appendField('send stop command to SpheroMini')
      .setCheck('Thing');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Stops the Sphero Mini.');
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
    },
    {
      type: 'sphero_stop',
      category: 'Actions',
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
