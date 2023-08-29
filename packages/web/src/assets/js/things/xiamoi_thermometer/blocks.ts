/**
 * @fileoverview Block definitions for the Xiaomi Mijia thermometer.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Blocks, dialog, Events, FieldTextInput, Names} from 'blockly';
import {Abstract} from 'blockly/core/events/events_abstract';
import {BlockDelete} from 'blockly/core/events/events_block_delete';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {eventsInWorkspace, getWorkspace} from '../../interpreter';
import {implementedThings} from '../../things.js';
import {BlockCreate} from 'blockly/core/events/events_block_create';

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
    this.getField('eventType').setEnabled(false);
    this.getField('humidity').setEnabled(false);
    this.getField('temperature').setEnabled(false);
    this.humidityName = '';
    this.temperatureName = '';
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
        this.addEvent();
        this.createVars();
      }
    });
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: function () {
    eventsInWorkspace.push(this.id);
    // add change listener to remove block from events array when deleted.
    this.changeListener = getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_DELETE &&
        (e as BlockDelete).ids?.includes(this.id)
      ) {
        this.removeFromEvents();
      }
    });
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
