/**
 * @fileoverview Block definitions for the Xiaomi Mijia thermometer.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Blocks, Events, FieldTextInput, Names} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {eventsInWorkspace, getWorkspace} from '../../interpreter';
import {implementedThings} from '../../things.js';

Blocks['things_xiaomiThermometer'] = {
  /**
   * Block representing a BLE RGB LED controller.
   * @this {Blockly.Block}
   * @return {null}.
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
  },
  /**
   * Add this block's id to the events array.
   * @return {null}.
   */
  addEvent: async function () {
    eventsInWorkspace.push(this.id);
  },
  onchange: function (event: Event) {
    // on creating this block initialize new instance of BleRgbController
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      this.addEvent();
    }
    if (event.type === Events.BLOCK_DELETE) {
      // Block is being deleted
      this.removeFromEvents();
      getWorkspace()?.removeChangeListener(this.changeListener);
    }
  },
  /**
   * Remove this block's id from the events array.
   * @return {null}.
   */
  removeFromEvents: function () {
    // remove this block from the events array.
    const index = eventsInWorkspace.indexOf(this.id);
    if (index !== -1) {
      eventsInWorkspace.splice(index, 1);
    }
  },
};

Blocks['xiaomiThermometer_event'] = {
  /**
   * Block for reading a property of a Xiaomi Mijia thermometer.
   * @this {Blockly.Block}
   * @return {null}.
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
   * @return {null}.
   */
  addEvent: async function () {
    eventsInWorkspace.push(this.id);
  },
  onchange: function (event: Event) {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.requested = true;
      this.addEvent();
      this.createVars();
    }
    if (event.type === Events.BLOCK_DELETE) {
      // Block is being deleted
      this.removeFromEvents();
      getWorkspace()?.removeChangeListener(this.changeListener);
    }
  },
  /**
   * Remove this block's id from the events array.
   * @return {null}.
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
    // create variable for humidity value
    let humidityname = JavaScript.nameDB_.getName(
      'humidity',
      Names.NameType.VARIABLE
    );
    for (let i = 1; ws.getVariable(humidityname) !== null; i++) {
      // if variable already exists, append a number to it.
      humidityname = JavaScript.nameDB_.getName(
        'humidity-' + i,
        Names.NameType.VARIABLE
      );
    }
    this.humidityName = ws.createVariable(humidityname).name;
    this.getField('humidity').setValue(this.humidityName);
    // create variable for temperature value
    let temperaturename = JavaScript.nameDB_.getName(
      'temperature',
      Names.NameType.VARIABLE
    );
    for (let i = 1; ws.getVariable(temperaturename) !== null; i++) {
      // if variable already exists, append a number to it.
      temperaturename = JavaScript.nameDB_.getName(
        'temperature-' + i,
        Names.NameType.VARIABLE
      );
    }
    this.temperatureName = ws.createVariable(temperaturename).name;
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
      type: 'xiaomiThermometer_event',
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
