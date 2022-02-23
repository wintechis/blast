/**
 * @fileoverview Blocks handling thing instances for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {getWebBluetoothDevices} from './../blast_things.js';
import {getWebHIDDevices} from './../blast_things.js';


Blockly.Blocks['things_webBluetooth'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('webBluetooth device')
        .appendField(new Blockly.FieldDropdown(getWebBluetoothDevices), 'id');
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['things_webHID'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('HID device')
        .appendField(new Blockly.FieldDropdown(getWebHIDDevices), 'id');
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
