/**
 * @fileoverview Block definitions for the Xiaomi Mijia thermometer.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {Blocks, Events, FieldTextInput, JavaScript, Names} = Blockly;
import {eventsInWorkspace, getWorkspace} from '../../interpreter.js';
import {implementedThings} from '../../things.js';

const {XiaomiThermometer} = tds;

const xiaomiThermometerInstances = new Map();

/**
 * Keeps singleton instances of XiaomiThermometers instantiated by BLAST.
 * @param {string} id the id of the XiaomiThermometer.
 * @return {XiaomiThermometer} the instance.
 */
const getXiaomiThermometer = async function (id) {
  if (xiaomiThermometerInstances.has(id)) {
    return xiaomiThermometerInstances.get(id);
  } else {
    const thing = await createThing(XiaomiThermometer, id);
    xiaomiThermometerInstances.set(id, thing);
    return thing;
  }
};

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
    this.thing = null;
  },
  /**
   * Add this block's id to the events array.
   * @return {null}.
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
  },
  /**
   * Add this block's id to the events array.
   * @return {null}.
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
    const varNames = ['humidity', 'temperature'];
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
