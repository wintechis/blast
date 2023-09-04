/**
 * @fileoverview Block definitions for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 */

import {Blocks, dialog, Events, FieldTextInput, Names} from 'blockly';
import {Abstract} from 'blockly/core/events/events_abstract';
import {BlockDelete} from 'blockly/core/events/events_block_delete';
import {BlockCreate} from 'blockly/core/events/events_block_create';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {eventsInWorkspace, getWorkspace} from '../../interpreter';
import {implementedThings} from '../../things.js';

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

Blocks['ruuviTag_event'] = {
  /**
   * Block for reading a property of a Ruuvi Tag.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('on')
      .appendField(
        new FieldTextInput('characteristicvaluechanged'),
        'eventType'
      )
      .appendField('events of Ruuvi Tag');
    this.appendDummyInput()
      .appendField('uses variables')
      .appendField(new FieldTextInput('temperature'), 'temperature')
      .appendField(new FieldTextInput('humidity'), 'humidity')
      .appendField(new FieldTextInput('pressure'), 'pressure');
    this.appendDummyInput()
      .appendField(new FieldTextInput('accelerationX'), 'accelerationX')
      .appendField(new FieldTextInput('accelerationY'), 'accelerationY')
      .appendField(new FieldTextInput('accelerationZ'), 'accelerationZ');
    this.appendDummyInput()
      .appendField(new FieldTextInput('batteryVoltage'), 'batteryVoltage')
      .appendField(new FieldTextInput('movementCounter'), 'movementCounter')
      .appendField(new FieldTextInput('txPower'), 'txPower');
    this.appendDummyInput().appendField(
      new FieldTextInput('measurementSequenceNumber'),
      'measurementSequenceNumber'
    );
    this.appendStatementInput('statements').appendField('do');
    this.setInputsInline(false);
    this.setColour(180);
    this.setTooltip(
      "Handles 'advertisementreceived' events of a Xiaomi Thermometer."
    );
    this.setHelpUrl('');
    this.getField('eventType').setEnabled(false);
    this.getField('temperature').setEnabled(false);
    this.getField('humidity').setEnabled(false);
    this.getField('pressure').setEnabled(false);
    this.getField('accelerationX').setEnabled(false);
    this.getField('accelerationY').setEnabled(false);
    this.getField('accelerationZ').setEnabled(false);
    this.getField('batteryVoltage').setEnabled(false);
    this.getField('movementCounter').setEnabled(false);
    this.getField('measurementSequenceNumber').setEnabled(false);
    this.getField('txPower').setEnabled(false);
    this.changeListener = null;
    getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_CREATE &&
        this.isInFlyout === false &&
        this.rendered === true &&
        this.childBlocks_.length === 0 &&
        (e as BlockCreate).ids?.includes(this.id)
      ) {
        if (!navigator.bluetooth) {
          dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
          this.dispose();
          return;
        }
        this.addEvent();
        this.createVars();
      } else if (
        e.type === Events.BLOCK_DELETE &&
        (e as BlockDelete).ids?.includes(this.id)
      ) {
        this.deleteVars();
        JavaScript.handlers['things' + this.id] = undefined;
        this.removeFromEvents();
      }
    });
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: function () {
    eventsInWorkspace.push(this.id);
  },
  /**
   * Remove this block's id from the events array.
   */
  removeFromEvents: function () {
    // remove this block from the events array.
    const index = eventsInWorkspace.indexOf(this.id);
    if (index !== -1) {
      eventsInWorkspace.splice(index, 1);
    }
  },
  createVars: function () {
    const ws = getWorkspace();
    if (ws === null) {
      return;
    }
    const varNames = [
      'temperature',
      'humidity',
      'pressure',
      'accelerationX',
      'accelerationY',
      'accelerationZ',
      'batteryVoltage',
      'movementCounter',
      'measurementSequenceNumber',
      'txPower',
    ];
    for (const varName of varNames) {
      // create legal variable name
      let legalName = JavaScript.nameDB_.getName(
        varName,
        Names.NameType.VARIABLE
      );
      for (let i = 1; ws.getVariable(legalName) !== null; i++) {
        // if name already exists, append a number
        legalName = JavaScript.nameDB_.getName(
          varName + '-' + i,
          Names.NameType.VARIABLE
        );
      }
      // create variable
      legalName = ws.createVariable(legalName).name;
      // set field value
      this.getField(varName)?.setValue(legalName);
    }
  },
};

// Add Ruuvi Tag to the list implemented things.
implementedThings.push({
  id: 'ruuviTag',
  name: 'Ruuvi Tag',
  type: 'bluetooth',
  blocks: [
    {
      type: 'ruuviTag_event',
      category: 'Events',
    },
  ],
  filters: [
    {
      manufacturerData: [{companyIdentifier: 1177}],
    },
  ],
  optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'],
  infoUrl: 'https://github.com/wintechis/blast/wiki/RuuviTag',
});
