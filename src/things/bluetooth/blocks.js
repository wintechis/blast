/**
 * @fileoverview Blocks definitions for (generic) Bluetooth blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {addBlock} from './../../blast_toolbox.js';

Blockly.Blocks['get_signal_strength_wb'] = {
  /**
       * Block for reading the strength of the signal (rssiValue property) sent by a ble device,
       * measured at the sc-ble-adapter.
       * @this {Blockly.Block}
       */
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('read signal-strength property of Bluetooth device');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads the strength of the signal (rssiValue property) sent by a BLE device, measured at the at the BLAST client.');
    this.setHelpUrl('');
    this.firstTime = true;
    this.deviceId = '';
  },
  onchange: function() {
    // on creating this block check webBluetooth availability
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        Blockly.dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later.`);
        this.dispose();
      }
    }
  },
};
// Add get_signal_strength_wb block to the toolbox.
addBlock('get_signal_strength_wb', 'Properties');
  
Blockly.Blocks['write_eddystone_property'] = {
  /**
     * Block for writing a property to an eddystone device.
     * @this {Blockly.Block}
     */
  init: function() {
    this.appendDummyInput('Property')
        .appendField('write')
        .appendField(
            new Blockly.FieldDropdown([
              ['advertised tx power', 'advertisedTxPower'],
              ['advertisement data', 'advertisementData'],
              ['advertising interval', 'advertisingInterval'],
              ['radio tx power', 'radioTxPower'],
            ], this.propertyValidator,
            ), 'Property')
        .appendField('property at slot');
    this.appendValueInput('Slot')
        .setCheck('Number');
    this.appendDummyInput('FrameType')
        .appendField('frame type')
        .appendField(
            new Blockly.FieldDropdown([
              ['UID', 'UID'],
              ['URL', 'URL'],
            ], this.frameTypeValidator), 'FrameType')
        .setVisible(false);
    this.appendValueInput('Value')
        .appendField('value')
        .setCheck('Number');
    this.appendValueInput('Thing')
        .appendField('to Eddystone device')
        .setCheck('Thing');
    this.setPreviousStatement(true, null);
    this.setInputsInline(true);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Writes a property to an Eddystone device.');
    this.setHelpUrl('https://github.com/google/eddystone/tree/master/configuration-service');
  },
  propertyValidator: function(property) {
    const block = this.getSourceBlock();
    const frameType = block.getInput('FrameType');
    frameType.setVisible(false);
    if (property == 'advertisementData') {
      frameType.setVisible(true);
    } else {
      block.getInput('Value').setCheck('Number');
    }
  },
  frameTypeValidator: function(frameType) {
    const block = this.getSourceBlock();
    if (frameType === 'UID') {
      block.getInput('Value').setCheck('String');
    } else if (frameType === 'URL') {
      block.getInput('Value').setCheck('URI');
    }
  },
};
  
// Define inner block XML for the write_eddystone_property block.
const WRITE_EDDYSTONE_PROPERTY_XML = `
  <block type="write_eddystone_property">
    <value name="Slot">
      <block type="math_number">
        <field name="NUM">0</field>
      </block>
    </value>
  </block>`;
  
// Add write_eddystone_property block to the toolbox.
addBlock('write_eddystone_property', 'Properties', WRITE_EDDYSTONE_PROPERTY_XML);
  
Blockly.Blocks['read_eddystone_property'] = {
  /**
     * Block for reading a property from an eddystone device.
     * @this {Blockly.Block}
     */
  init: function() {
    this.appendDummyInput('Property')
        .appendField('read')
        .appendField(
            new Blockly.FieldDropdown([
              ['advertised tx power', 'advertisedTxPower'],
              ['advertisement data', 'advertisementData'],
              ['advertising interval', 'advertisingInterval'],
              ['lock state', 'lockState'],
              ['public ECDH key', 'publicECDHKey'],
              ['radio tx power', 'radioTxPower'],
            ]), 'Property')
        .appendField('property');
    this.appendValueInput('Slot')
        .setCheck('Number')
        .appendField('at slot');
    this.appendValueInput('Thing')
        .appendField('of Eddystone device')
        .setCheck('Thing');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setInputsInline(true);
    this.setTooltip('Reads a property from an Eddystone device.');
    this.setHelpUrl('https://github.com/google/eddystone/tree/master/configuration-service');
  },
};
  
// Define inner block XML for the read_eddystone_property block.
const READ_EDDYSTONE_PROPERTY_XML = `
  <block type="read_eddystone_property">
    <value name="Slot">
      <block type="math_number">
        <field name="NUM">0</field>
      </block>
    </value>
  </block>`;
  
// Add read_eddystone_property block to the toolbox.
addBlock('read_eddystone_property', 'Properties', READ_EDDYSTONE_PROPERTY_XML);
  
 
