/**
 * @fileoverview Blocks definitions for Nintendo JoyCon controllers.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {addBlock} from './../../blast_toolbox.js';
import {eventsInWorkspace} from './../../blast_interpreter.js';
import {getWorkspace} from './../../blast_interpreter.js';


Blockly.Blocks['joycon_read_property'] = {
  /**
     * Block to read a property of a JoyCon.
     * @this Blockly.Block
     */
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('read')
        .appendField(new Blockly.FieldDropdown([
          ['accelerometers', 'accelerometers'],
          ['actual accelerometer', 'actualAccelerometer'],
          ['actual gyroscope', 'actualGyroscope'],
          ['actual orientation', 'actualOrientation'],
          ['actual orientation quaternion', 'actualOrientationQuaternion'],
          ['gyroscopes', 'gyroscopes'],
          ['quaternion', 'quaternion'],
        ], this.propertyValidator), 'property')
        .appendField('property of Nintendo JoyCon');
    this.setInputsInline(false);
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads a property of a Nintendo JoyCon controller.');
    this.setHelpUrl('');
    this.firstTime = true;
  },
  propertyValidator: function(option) {
    this.getSourceBlock().updateInputs(option);
    return option;
  },
  /**
   * Adds dropdowns for property sub values based on the selected property.
   * @param {String} property The property to add dropdowns for.
   */
  updateInputs: function(property) {
    this.removeInput('propertySubValue', true);
    this.removeInput('propertySubValue2', true);
    this.removeInput('propertySubValue3', true);

    if (property === 'accelerometers') {
      this.appendDummyInput('propertySubValue')
          .appendField('accelerometer')
          .appendField(new Blockly.FieldDropdown([
            ['0', '0'],
            ['1', '1'],
            ['2', '2'],
          ]), 'propertySubValue');
      this.appendDummyInput('propertySubValue2')
          .appendField('axis')
          .appendField(new Blockly.FieldDropdown([
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
          ]), 'propertySubValue2');
    }
    if (property === 'actualAccelerometer') {
      this.appendDummyInput('propertySubValue')
          .appendField('axis')
          .appendField(new Blockly.FieldDropdown([
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
          ]), 'propertySubValue');
    }
    if (property === 'actualGyroscope') {
      this.appendDummyInput('propertySubValue')
          .appendField('unit')
          .appendField(new Blockly.FieldDropdown([
            ['rps', 'rps'],
            ['dps', 'dps'],
          ]), 'propertySubValue');
      this.appendDummyInput('propertySubValue2')
          .appendField('axis')
          .appendField(new Blockly.FieldDropdown([
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
          ]), 'propertySubValue2');
    }
    if (property === 'actualOrientation') {
      this.appendDummyInput('propertySubValue')
          .appendField('degrees')
          .appendField(new Blockly.FieldDropdown([
            ['alpa', 'alpha'],
            ['beta', 'beta'],
            ['gamma', 'gamma'],
          ]), 'propertySubValue');
    }
    if (property === 'actualOrientationQuaternion') {
      this.appendDummyInput('propertySubValue')
          .appendField('degrees')
          .appendField(new Blockly.FieldDropdown([
            ['alpa', 'alpha'],
            ['beta', 'beta'],
            ['gamma', 'gamma'],
          ]), 'propertySubValue');
    }
    if (property === 'gyroscopes') {
      this.appendDummyInput('propertySubValue')
          .appendField('gyroscope')
          .appendField(new Blockly.FieldDropdown([
            ['0', '0'],
            ['1', '1'],
            ['2', '2'],
          ]), 'propertySubValue');
      this.appendDummyInput('propertySubValue2')
          .appendField('axis')
          .appendField(new Blockly.FieldDropdown([
            ['x', '0'],
            ['y', '1'],
            ['z', '2'],
          ]), 'propertySubValue2');
      this.appendDummyInput('propertySubValue3')
          .appendField('unit')
          .appendField(new Blockly.FieldDropdown([
            ['dps', 'dps'],
            ['rps', 'rps'],
          ]), 'propertySubValue3');
    }
    if (property === 'quaternion') {
      this.appendDummyInput('propertySubValue')
          .appendField('axis')
          .appendField(new Blockly.FieldDropdown([
            ['w', 'w'],
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
          ]), 'propertySubValue');
    }
  },
};

// Add joycon_read_property block to the toolbox.
addBlock('joycon_read_property', 'Properties');

Blockly.Blocks['joycon_button_events'] = {
  /**
   * Block to read a property of a JoyCon.
   * @this Blockly.Block
   */
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('Nintendo JoyCon');
    this.appendDummyInput()
        .appendField('when')
        .appendField(new Blockly.FieldDropdown(
            [
              ['A', 'a'],
              ['B', 'b'],
              ['X', 'x'],
              ['Y', 'y'],
              ['up', 'up'],
              ['left', 'left'],
              ['down', 'down'],
              ['right', 'right'],
              ['R', 'r'],
              ['L', 'l'],
              ['ZR', 'zr'],
              ['ZL', 'zl'],
            ],
        ), 'button')
        .appendField('pressed');
    this.appendStatementInput('statements')
        .setCheck(null);
    this.setInputsInline(false);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
    this.requested = false;
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: async function() {
    eventsInWorkspace.push(this.id);
    // remove event if block is deleted
    getWorkspace().addChangeListener((event) => this.onDispose(event));
  },
  onchange: function() {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.addEvent();
    }
  },
  onDispose: function(event) {
    if (event.type === Blockly.Events.BLOCK_DELETE) {
      if (event.type === Blockly.Events.BLOCK_DELETE && event.ids.indexOf(this.id) !== -1) {
        // Block is being deleted
        this.removeFromEvents();
      }
    }
  },
  /**
   * Remove this block's id from the events array.
   */
  removeFromEvents: function() {
    // remove this block from the events array.
    const index = eventsInWorkspace.indexOf(this.id);
    if (index !== -1) {
      eventsInWorkspace.splice(index, 1);
    }
  },
};

// Add joycon_button_events block to the toolbox.
addBlock('joycon_button_events', 'States and Events');
