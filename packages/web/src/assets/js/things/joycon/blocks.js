/**
 * @fileoverview Blocks definitions for Nintendo JoyCon controllers.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {Blocks, Events, FieldDropdown, FieldTextInput, JavaScript, Names} =
  Blockly;
import {eventsInWorkspace, getWorkspace} from '../../interpreter.ts';
import {implementedThings} from '../../things.js';

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
      category: 'Events',
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
    this.appendValueInput('thing')
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
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('Nintendo JoyCon');
    this.appendDummyInput('dropdowns')
      .appendField(
        new FieldDropdown(
          [
            ['on', 'on'],
            ['while', 'while'],
          ],
          this.onWhileValidator
        ),
        'onWhile'
      )
      .appendField(
        new FieldDropdown([
          ['A', 'A'],
          ['B', 'B'],
          ['X', 'X'],
          ['Y', 'Y'],
          ['up', 'UP'],
          ['left', 'LEFT'],
          ['down', 'DOWN'],
          ['right', 'RIGHT'],
          ['R', 'R'],
          ['L', 'L'],
          ['RT', 'RT'],
          ['LT', 'LT'],
        ]),
        'button'
      )
      .appendField(
        new FieldDropdown([
          ['pressed', 'pressed'],
          ['released', 'released'],
        ]),
        'buttonEvent'
      );
    this.appendStatementInput('statements').appendField('do').setCheck(null);
    this.setInputsInline(false);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
    this.requested = false;
    this.changeListener = null;
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: function () {
    eventsInWorkspace.push(this.id);
    // add change listener to remove block from events array when deleted.
    this.changeListener = getWorkspace()?.addChangeListener(e => {
      if (e.type === Events.BLOCK_DELETE && e.ids.includes(this.id)) {
        this.removeFromEvents();
      }
    });
  },
  onchange: function () {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.requested = true;
      this.addEvent();
    }
  },
  /**
   * Displays the pressed/released dropdown if on is selected.
   * @param {string} onWhile - The selected option.
   * @return {string} - The selected option.
   */
  onWhileValidator: function (onWhile) {
    const input = this.sourceBlock_.getInput('dropdowns');
    if (input) {
      // remove the pressed/released dropdown
      input.removeField('buttonEvent');
    }
    if (onWhile === 'on') {
      // add the pressed/released dropdown
      input.appendField(
        new FieldDropdown([
          ['pressed', 'pressed'],
          ['released', 'released'],
        ]),
        'buttonEvent'
      );
    } else {
      input.appendField('pressed', 'buttonEvent');
    }
    return onWhile;
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

Blocks['things_gamepad_pro'] = {
  /**
   * Block representing a Nintendo Switch Gamepad Pro.
   * @this Blockly.Block
   */
  init: function () {
    this.appendDummyInput()
      .appendField('Gamepad Pro')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput()
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A Nintendo Switch Gamepad Pro.');
    this.setHelpUrl('https://github.com/wintechis/blast/wiki/Nintendo-JoyCon');
    this.getField('name').setEnabled(false);
  },
};

// Add Joy-Con block to list of implemented things.
implementedThings.push({
  id: 'gamepad_pro',
  name: 'Nintendo Switch Gamepad Pro',
  type: 'hid',
  blocks: [
    {
      type: 'gamepad_pro_joystick',
      category: 'Events',
    },
    {
      type: 'gamepad_pro_button',
      category: 'Events',
    },
  ],
  infoUrl: 'https://github.com/wintechis/blast/wiki/Nintendo-JoyCon',
  filters: [
    {
      vendorId: 0x057e,
      productId: 0x2009,
    },
  ],
});

Blocks['gamepad_pro_joystick'] = {
  /**
   * Block to subscribe to Gamepad Joystick events.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('Joystick events of Gamepad Pro');
    this.appendDummyInput()
      .appendField('uses variables')
      .appendField(new FieldTextInput('gp-x'), 'gp-x')
      .appendField(new FieldTextInput('gp-y'), 'gp-y')
      .appendField(new FieldTextInput('gp-angle'), 'gp-angle');
    this.appendDummyInput().appendField('when joystick moves');
    this.appendStatementInput('statements').appendField('do');
    this.setInputsInline(false);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
    this.getField('gp-x').setEnabled(false);
    this.getField('gp-y').setEnabled(false);
    this.getField('gp-angle').setEnabled(false);
    this.xName = '';
    this.yName = '';
    this.angleName = '';
    this.changeListener = null;
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: function () {
    eventsInWorkspace.push(this.id);
    // add change listener to remove block from events array when deleted.
    this.changeListener = getWorkspace()?.addChangeListener(e => {
      if (e.type === Events.BLOCK_DELETE && e.ids.includes(this.id)) {
        this.removeFromEvents();
      }
    });
  },
  onchange: function () {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.requested = true;
      this.addEvent();
      this.createVars();
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
    // Create variable for x coordinate.
    let xName = JavaScript.nameDB_.getName('gp-x', Names.NameType.VARIABLE);
    for (let i = 1; ws.getVariable(xName) !== null; i++) {
      // if variable already exists, append a number.
      xName = JavaScript.nameDB_.getName('gp-x-' + i, Names.NameType.VARIABLE);
    }
    this.xName = ws.createVariable(xName).name;
    this.getField('gp-x').setValue(this.xName);
    // Create variable for y coordinate.
    let yName = JavaScript.nameDB_.getName('gp-y', Names.NameType.VARIABLE);
    for (let i = 1; ws.getVariable(yName) !== null; i++) {
      // if variable already exists, append a number.
      yName = JavaScript.nameDB_.getName('gp-y-' + i, Names.NameType.VARIABLE);
    }
    this.yName = ws.createVariable(yName).name;
    this.getField('gp-y').setValue(this.yName);
    // Create variable for joystick angle.
    let angleName = JavaScript.nameDB_.getName(
      'gp-angle',
      Names.NameType.VARIABLE
    );
    for (let i = 1; ws.getVariable(angleName) !== null; i++) {
      // if variable already exists, append a number.
      angleName = JavaScript.nameDB_.getName(
        'gp-angle-' + i,
        Names.NameType.VARIABLE
      );
    }
    this.angleName = ws.createVariable(angleName).name;
    this.getField('gp-angle').setValue(this.angleName);
  },
};

Blocks['gamepad_pro_button'] = {
  /**
   * Block to subscribe to Gamepad Button events.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('button events of Gamepad Pro');
    this.appendDummyInput()
      .appendField('on button')
      .appendField(
        new FieldDropdown([
          ['A', 'A'],
          ['B', 'B'],
          ['X', 'X'],
          ['Y', 'Y'],
          ['up', 'UP'],
          ['left', 'LEFT'],
          ['down', 'DOWN'],
          ['right', 'RIGHT'],
          ['R', 'R'],
          ['L', 'L'],
          ['RT', 'ZR'],
          ['LT', 'ZL'],
        ]),
        'button'
      )
      .appendField('pressed');
    this.appendStatementInput('statements').appendField('do');
    this.setInputsInline(false);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
    this.requested = false;
    this.changeListener = null;
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: function () {
    eventsInWorkspace.push(this.id);
    // add change listener to remove block from events array when deleted.
    this.changeListener = getWorkspace()?.addChangeListener(e => {
      if (e.type === Events.BLOCK_DELETE && e.ids.includes(this.id)) {
        this.removeFromEvents();
      }
    });
  },
  onchange: function () {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.requested = true;
      this.addEvent();
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
