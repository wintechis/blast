/**
 * @fileoverview Blocks definitions for Nintendo JoyCon controllers.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {Blocks, Events, FieldDropdown, FieldTextInput} from 'blockly';
import {eventsInWorkspace, getWorkspace} from './../../blast_interpreter.js';
import {implementedThings} from './../../blast_things.js';

Blocks['things_joycon'] = {
  /**
   * Block representing a Nintendo Joy-Con.
   * @this Blockly.Block
   */
  init: function () {
    this.appendDummyInput()
      .appendField('Joy-Con')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput()
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A Nintendo Joy-Con.');
    this.setHelpUrl('https://github.com/wintechis/blast/wiki/Nintendo-JoyCon');
    this.getField('name').setEnabled(false);
    this.firstTime = true;
    this.webHidId = '';
    this.thing = null;
  },
};

// Add Joy-Con block to list of implemented things.
implementedThings.push({
  id: 'joycon',
  name: 'Nintendo Joy-Con',
  type: 'hid',
  blocks: [
    {
      type: 'joycon_read_property',
      category: 'Properties',
    },
    {
      type: 'joycon_button_events',
      category: 'States and Events',
    },
  ],
  infoUrl: 'https://github.com/wintechis/blast/wiki/Nintendo-JoyCon',
  filters: [
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2006, // Joy-Con Left
    },
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2007, // Joy-Con Right
    },
  ],
});

Blocks['joycon_read_property'] = {
  /**
   * Block to read a property of a JoyCon.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput('Thing')
      .setCheck('Thing')
      .appendField('read')
      .appendField(
        new FieldDropdown(
          [
            ['accelerometers', 'accelerometers'],
            ['actual accelerometer', 'actualAccelerometer'],
            ['actual gyroscope', 'actualGyroscope'],
            ['actual orientation', 'actualOrientation'],
            ['actual orientation quaternion', 'actualOrientationQuaternion'],
            ['gyroscopes', 'gyroscopes'],
            ['quaternion', 'quaternion'],
          ],
          this.propertyValidator
        ),
        'property'
      )
      .appendField('property of Nintendo JoyCon');
    this.setInputsInline(false);
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads a property of a Nintendo JoyCon controller.');
    this.setHelpUrl('');
    this.firstTime = true;
  },
  propertyValidator: function (option) {
    this.getSourceBlock().updateInputs(option);
    return option;
  },
  /**
   * Adds dropdowns for property sub values based on the selected property.
   * @param {String} property The property to add dropdowns for.
   */
  updateInputs: function (property) {
    this.removeInput('propertySubValue', true);
    this.removeInput('propertySubValue2', true);
    this.removeInput('propertySubValue3', true);

    if (property === 'accelerometers') {
      this.appendDummyInput('propertySubValue')
        .appendField('accelerometer')
        .appendField(
          new FieldDropdown([
            ['0', '0'],
            ['1', '1'],
            ['2', '2'],
          ]),
          'propertySubValue'
        );
      this.appendDummyInput('propertySubValue2')
        .appendField('axis')
        .appendField(
          new FieldDropdown([
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
          ]),
          'propertySubValue2'
        );
    }
    if (property === 'actualAccelerometer') {
      this.appendDummyInput('propertySubValue')
        .appendField('axis')
        .appendField(
          new FieldDropdown([
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
          ]),
          'propertySubValue'
        );
    }
    if (property === 'actualGyroscope') {
      this.appendDummyInput('propertySubValue')
        .appendField('unit')
        .appendField(
          new FieldDropdown([
            ['rps', 'rps'],
            ['dps', 'dps'],
          ]),
          'propertySubValue'
        );
      this.appendDummyInput('propertySubValue2')
        .appendField('axis')
        .appendField(
          new FieldDropdown([
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
          ]),
          'propertySubValue2'
        );
    }
    if (property === 'actualOrientation') {
      this.appendDummyInput('propertySubValue')
        .appendField('degrees')
        .appendField(
          new FieldDropdown([
            ['alpa', 'alpha'],
            ['beta', 'beta'],
            ['gamma', 'gamma'],
          ]),
          'propertySubValue'
        );
    }
    if (property === 'actualOrientationQuaternion') {
      this.appendDummyInput('propertySubValue')
        .appendField('degrees')
        .appendField(
          new FieldDropdown([
            ['alpa', 'alpha'],
            ['beta', 'beta'],
            ['gamma', 'gamma'],
          ]),
          'propertySubValue'
        );
    }
    if (property === 'gyroscopes') {
      this.appendDummyInput('propertySubValue')
        .appendField('gyroscope')
        .appendField(
          new FieldDropdown([
            ['0', '0'],
            ['1', '1'],
            ['2', '2'],
          ]),
          'propertySubValue'
        );
      this.appendDummyInput('propertySubValue2')
        .appendField('axis')
        .appendField(
          new FieldDropdown([
            ['x', '0'],
            ['y', '1'],
            ['z', '2'],
          ]),
          'propertySubValue2'
        );
      this.appendDummyInput('propertySubValue3')
        .appendField('unit')
        .appendField(
          new FieldDropdown([
            ['dps', 'dps'],
            ['rps', 'rps'],
          ]),
          'propertySubValue3'
        );
    }
    if (property === 'quaternion') {
      this.appendDummyInput('propertySubValue')
        .appendField('axis')
        .appendField(
          new FieldDropdown([
            ['w', 'w'],
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
          ]),
          'propertySubValue'
        );
    }
  },
};

Blocks['joycon_button_events'] = {
  /**
   * Block to read a property of a JoyCon.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput('Thing')
      .setCheck('Thing')
      .appendField('Nintendo JoyCon');
    this.appendDummyInput()
      .appendField(
        new FieldDropdown([
          ['on', 'on'],
          ['while', 'while'],
        ]),
        'onWhile'
      )
      .appendField(
        new FieldDropdown([
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
        ]),
        'button'
      )
      .appendField('pressed');
    this.appendStatementInput('statements').appendField('do').setCheck(null);
    this.setInputsInline(false);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
    this.requested = false;
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: async function () {
    eventsInWorkspace.push(this.id);
    // remove event if block is deleted
    getWorkspace().addChangeListener(event => this.onDispose(event));
  },
  onchange: function () {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
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
