/**
 * @fileoverview Block definitions for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';
import Blockly from 'blockly';
const {Blocks, dialog, FieldDropdown, FieldTextInput} = Blockly;
import {implementedThings} from '../../blast_things.js';
import {scanBlocks} from '../../blast_webBluetooth.js';
// eslint-disable-next-line node/no-missing-import
import RuuviTag from '../../things/ruuviTag/RuuviTag.js';

Blocks['things_ruuviTag'] = {
  /**
   * Block representing a RuuviTag.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput()
      .appendField('Ruuvi Tag')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput()
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A Ruuvi Tag');
    this.setHelpUrl('https://github.com/wintechis/blast/wiki/RuuviTag');
    this.getField('name').setEnabled(false);
    this.firstTime = true;
    this.webBluetoothId = '';
    this.thing = null;
  },
  onchange: function () {
    // on creating this block initialize new instance of BleRgbController
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.webBluetoothId = this.getFieldValue('id');
      this.thing = new RuuviTag(this.webBluetoothId);
      this.firstTime = false;
    }
  },
};

Blocks['read_ruuvi_property'] = {
  /**
   * Block for reading a property of a Ruuvi Tag.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('read')
      .appendField(
        new FieldDropdown([
          ['temperature', 'temperature'],
          ['humidity', 'humidity'],
          ['pressure', 'pressure'],
          ['acceleration X', 'accelerationX'],
          ['acceleration Y', 'accelerationY'],
          ['acceleration Z', 'accelerationZ'],
          ['battery voltage', 'batteryVoltage'],
          ['txPower', 'txPower'],
          ['movement counter', 'movementCounter'],
          ['measurement sequence number', 'measurementSequenceNumber'],
        ]),
        'measurement'
      )
      .appendField('property of RuuviTag');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads a property of a Ruuvi Tag.');
    this.setHelpUrl('');
    this.firstTime = true;
  },
  onchange: function () {
    // on creating this block check webBluetooth availability, then request LEScan.
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

// Add read_ruuvi_property block to the scanBlocks array.
scanBlocks.push('read_ruuvi_property');

// Add Ruuvi Tag to the list implemented things.
implementedThings.push({
  id: 'ruuviTag',
  name: 'Ruuvi Tag',
  type: 'bluetooth',
  blocks: [
    {
      type: 'read_ruuvi_property',
      category: 'Properties',
    },
  ],
  infoUrl: 'https://github.com/wintechis/blast/wiki/RuuviTag',
  filters: [
    {
      namePrefix: 'Ruuvi',
    },
  ],
});
