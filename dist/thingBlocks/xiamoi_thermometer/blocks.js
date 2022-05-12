/**
 * @fileoverview Block definitions for the Xiaomi Mijia thermometer.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {Blocks, FieldDropdown, FieldTextInput} = Blockly;
import {implementedThings} from '../../blast_things.js';
// eslint-disable-next-line node/no-missing-import
import XiaomiThermometer from './../../things/xiaomiThermometer/XiaomiThermometer.js';

Blocks['things_xiaomiThermometer'] = {
  /**
   * Block representing a BLE RGB LED controller.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput()
      .appendField('Xiamoi Thermometer')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput()
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A Xiamoi Thermometer.');
    this.setHelpUrl(
      'https://github.com/wintechis/blast/wiki/Xiaomi-Thermometer'
    );
    this.getField('name').setEnabled(false);
    this.firstTime = true;
    this.webBluetoothId = '';
    this.thing = null;
  },
  onchange: function () {
    // on creating this block initialize new instance of BleRgbController
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.webBluetoothId = this.getFieldValue('id');
      this.thing = new XiaomiThermometer(this.webBluetoothId);
      this.firstTime = false;
    }
  },
};

Blocks['read_mijia_property'] = {
  /**
   * Block for reading a property of a Xiaomi Mijia thermometer.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('Thing')
      .setCheck('Thing')
      .appendField('read')
      .appendField(
        new FieldDropdown([
          ['temperature', 'temperature'],
          ['humidity', 'humidity'],
        ]),
        'measurement'
      )
      .appendField('property of Xiaomi Mijia');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip(
      'Reads the selected property of a Xiaomi Mijia Thermometer.'
    );
    this.setHelpUrl('');
  },
};

// Add Xiamoi Thermometer to the list of implemented things.
implementedThings.push({
  id: 'xiaomiThermometer',
  name: 'Xiaomi Thermometer',
  type: 'bluetooth',
  blocks: [
    {
      type: 'read_mijia_property',
      category: 'Properties',
    },
  ],
  filters: [
    {
      namePrefix: 'lywsd03mmc',
    },
  ],
  optionalServices: ['ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6'],
  infoUrl: 'https://github.com/wintechis/blast/wiki/Xiaomi-Thermometer',
});
