/**
 * @fileoverview Block definitions for the Xiaomi Mijia thermometer.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {Blocks, Events, FieldTextInput, JavaScript, Names} = Blockly;
import {eventsInWorkspace, getWorkspace} from './../../blast_interpreter.js';
import {implementedThings} from '../../blast_things.js';
// eslint-disable-next-line node/no-missing-import
import XiaomiThermometer from './../../things/XiaomiThermometer.js';

const xiaomiThermometerInstances = new Map();

/**
 * Keeps singleton instances of XiaomiThermometers instantiated by BLAST.
 * @param {string} id the id of the XiaomiThermometer.
 */
const getXiaomiThermometer = function (id) {
  if (xiaomiThermometerInstances.has(id)) {
    return xiaomiThermometerInstances.get(id);
  } else {
    const thing = new XiaomiThermometer();
    xiaomiThermometerInstances.set(id, thing);
    return thing;
  }
};

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
    this.thing = null;
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: async function () {
    eventsInWorkspace.push(this.id);
    // remove event if block is deleted
    this.changeListener = getWorkspace().addChangeListener(event =>
      this.onDispose(event)
    );
  },
  onchange: function () {
    // on creating this block initialize new instance of BleRgbController
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      const webBluetoothId = this.getFieldValue('id');
      this.firstTime = false;
      getXiaomiThermometer(webBluetoothId)
        .init(webBluetoothId)
        .then(thing => {
          this.thing = thing;
        });
      this.addEvent();
    }
  },
  onDispose: function (event) {
    if (event.type === Events.BLOCK_DELETE) {
      if (
        event.type === Events.BLOCK_DELETE &&
        event.ids.indexOf(this.id) !== -1
      ) {
        // Block is being deleted
        this.removeFromEvents();
        getWorkspace().removeChangeListener(this.changeListener);
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
};

Blocks['xiaomi_thermometer_event'] = {
  /**
   * Block for reading a property of a Xiaomi Mijia thermometer.
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
      .appendField('events of Xiaomi Thermometer');
    this.appendDummyInput()
      .appendField('uses variables')
      .appendField(new FieldTextInput('humidity'), 'humidity')
      .appendField(new FieldTextInput('temperature'), 'temperature');
    this.appendStatementInput('statements').appendField('do');
    this.setInputsInline(false);
    this.setColour(180);
    this.setTooltip(
      "Handles 'characteristicvaluechanged' events of a Xiaomi Thermometer."
    );
    this.setHelpUrl('');
    this.changeListener = null;
    this.getField('eventType').setEnabled(false);
    this.getField('humidity').setEnabled(false);
    this.getField('temperature').setEnabled(false);
    this.humidityName = '';
    this.temperatureName = '';
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: async function () {
    eventsInWorkspace.push(this.id);
    // remove event if block is deleted
    this.changeListener = getWorkspace().addChangeListener(event =>
      this.onDispose(event)
    );
  },
  onchange: function () {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.requested = true;
      this.addEvent();
      this.createVars();
    }
  },
  onDispose: function (event) {
    if (event.type === Events.BLOCK_DELETE) {
      if (
        event.type === Events.BLOCK_DELETE &&
        event.ids.indexOf(this.id) !== -1
      ) {
        // Block is being deleted
        this.removeFromEvents();
        getWorkspace().removeChangeListener(this.changeListener);
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
    // Create variable for humidity value.
    let humidityName = JavaScript.nameDB_.getName(
      'humidity',
      Names.NameType.VARIABLE
    );
    for (let i = 1; ws.getVariable(humidityName) !== null; i++) {
      // if variable already exists, append a number.
      humidityName = JavaScript.nameDB_.getName(
        'humidity-' + i,
        Names.NameType.VARIABLE
      );
    }
    this.humidityName = ws.createVariable(humidityName).name;
    this.getField('humidity').setValue(this.humidityName);
    // Create variable for temperature value.
    let temperatureName = JavaScript.nameDB_.getName(
      'temperature',
      Names.NameType.VARIABLE
    );
    for (let i = 1; ws.getVariable(temperatureName) !== null; i++) {
      // if variable already exists, append a number.
      temperatureName = JavaScript.nameDB_.getName(
        'temperature-' + i,
        Names.NameType.VARIABLE
      );
    }
    this.temperatureName = ws.createVariable(temperatureName).name;
    this.getField('temperature').setValue(this.temperatureName);
  },
};

// Add Xiamoi Thermometer to the list of implemented things.
implementedThings.push({
  id: 'xiaomiThermometer',
  name: 'Xiaomi Thermometer',
  type: 'bluetooth',
  blocks: [
    {
      type: 'xiaomi_thermometer_event',
      category: 'Events',
    },
  ],
  filters: [
    {
      name: 'LYWSD03MMC',
    },
  ],
  optionalServices: ['ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6'],
  infoUrl: 'https://github.com/wintechis/blast/wiki/Xiaomi-Thermometer',
});
