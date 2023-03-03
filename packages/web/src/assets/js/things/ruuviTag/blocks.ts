/**
 * @fileoverview Block definitions for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 */

import Blockly from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
const {Blocks, Events, FieldTextInput, Names} = Blockly;
import {eventsInWorkspace, getStdWarn, getWorkspace} from '../../interpreter';
import {implementedThings} from '../../things.js';
import {blocksRequiringScan} from '../../webBluetooth.js';

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
      .appendField(new FieldTextInput('advertisementreceived'), 'eventType')
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
    this.changeListener = null;
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
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: async function () {
    eventsInWorkspace.push(this.id);
    // remove event if block is deleted
    this.changeListener = getWorkspace()?.addChangeListener((event: Event) =>
      this.onDispose(event)
    );
  },
  onchange: function () {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.checkCompatibility();
      this.requested = true;
      this.addEvent();
      blocksRequiringScan.push(this.id);
      this.createVars();
    }
  },
  checkCompatibility: function () {
    const isWindows = navigator.platform.toLowerCase().indexOf('win') >= 0;
    const isAndroid = navigator.userAgent.toLowerCase().indexOf('android') >= 0;

    if (!isWindows && !isAndroid) {
      const stdWarn = getStdWarn();
      stdWarn(
        'Reading from the Ruuvi Tag is only supported on Windows and Android'
      );
    }
  },
  onDispose: function (event: Event) {
    if (event.type === Events.BLOCK_DELETE) {
      if (
        event.type === Events.BLOCK_DELETE &&
        (event as any).ids.indexOf(this.id) !== -1
      ) {
        // Block is being deleted
        this.removeFromEvents();
        getWorkspace()?.removeChangeListener(this.changeListener);
      }
    }
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
          legalName + '-' + i,
          Names.NameType.VARIABLE
        );
      }
      // create variable
      legalName = ws.createVariable(legalName).name;
      // set field value
      this.getField(varName).setValue(legalName);
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
  infoUrl: 'https://github.com/wintechis/blast/wiki/RuuviTag',
  filters: [
    {
      manufacturerData: [{companyIdentifier: 1177}],
    },
  ],
});
