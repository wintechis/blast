/**
 * @fileoverview Blocks definitions for Nintendo JoyCon controllers.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Blocks, Events, FieldDropdown, FieldTextInput, Names} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {eventsInWorkspace, getWorkspace} from '../../interpreter';
import {implementedThings} from '../../things.js';
import {BlockDelete} from 'blockly/core/events/events_block_delete';
import {Abstract} from 'blockly/core/events/events_abstract';

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
        new FieldDropdown([
          ['accelerometers', 'accelerometers'],
          ['actual accelerometer', 'actualAccelerometer'],
          ['actual gyroscope', 'actualGyroscope'],
          ['actual orientation', 'actualOrientation'],
          ['actual orientation quaternion', 'actualOrientationQuaternion'],
          ['gyroscopes', 'gyroscopes'],
          ['quaternion', 'quaternion'],
        ]),
        'property'
      )
      .appendField('property of Nintendo JoyCon');
    this.setInputsInline(false);
    this.setOutput(true, ['String', 'Number']);
    this.setCommentText(
      'Structure of returned value:\n' +
        '{\n' +
        '  "accelerometers": [\n' +
        '    {\n' +
        '      "x": number,\n' +
        '      "y": number,\n' +
        '      "z": number\n' +
        '    },\n' +
        '    {\n' +
        '      "x": number,\n' +
        '      "y": number,\n' +
        '      "z": number\n' +
        '    },\n' +
        '    {\n' +
        '      "x": number,\n' +
        '      "y": number,\n' +
        '      "z": number\n' +
        '    }\n' +
        '  ],\n' +
        '  "actualAccelerometer": {\n' +
        '    "x": number,\n' +
        '    "y": number,\n' +
        '    "z": number\n' +
        '  },\n' +
        '  "actualGyroscope": {\n' +
        '    "rps": {\n' +
        '      "x": number,\n' +
        '      "y": number,\n' +
        '      "z": number\n' +
        '    },\n' +
        '    "dps": {\n' +
        '      "x": number,\n' +
        '      "y": number,\n' +
        '      "z": number\n' +
        '    },\n' +
        '  },\n' +
        '  "actualOrientation": {\n' +
        '    "alpha": number,\n' +
        '    "beta": number,\n' +
        '    "gamma": number\n' +
        '  },\n' +
        '  "actualOrientationQuaternion": {\n' +
        '    "alpha": number,\n' +
        '    "beta": number,\n' +
        '    "gamma": number\n' +
        '  },\n' +
        '  "gyroscopes": [\n' +
        '    {\n' +
        '      "x": {\n' +
        '        "dps": number,\n' +
        '        "rps": number\n' +
        '      },\n' +
        '      "y": {\n' +
        '        "dps": number,\n' +
        '        "rps": number\n' +
        '      },\n' +
        '      "z": {\n' +
        '        "dps": number,\n' +
        '        "rps": number\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "x": {\n' +
        '        "dps": number,\n' +
        '        "rps": number\n' +
        '      },\n' +
        '      "y": {\n' +
        '        "dps": number,\n' +
        '        "rps": number\n' +
        '      },\n' +
        '      "z": {\n' +
        '        "dps": number,\n' +
        '        "rps": number\n' +
        '      }\n' +
        '    },\n' +
        '    {\n' +
        '      "x": {\n' +
        '        "dps": number,\n' +
        '        "rps": number\n' +
        '      },\n' +
        '      "y": {\n' +
        '        "dps": number,\n' +
        '        "rps": number\n' +
        '      },\n' +
        '      "z": {\n' +
        '        "dps": number,\n' +
        '        "rps": number\n' +
        '      }\n' +
        '    },\n' +
        '  ],\n' +
        '  "quaternion": {\n' +
        '    "w": number,\n' +
        '    "x": number,\n' +
        '    "y": number,\n' +
        '    "z": number\n' +
        '  }\n' +
        '}'
    );
    this.setColour(255);
    this.setTooltip('Reads a property of a Nintendo JoyCon controller.');
    this.setHelpUrl('');
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
      .appendField('button events of Nintendo JoyCon');
    this.appendDummyInput('dropdowns')
      .appendField('on button')
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
          ['L', 'r'],
          ['RT', 'rt'],
          ['LT', 'lt'],
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
    this.changeListener = getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_DELETE &&
        (e as BlockDelete).ids?.includes(this.id)
      ) {
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
      .appendField(new FieldTextInput('gp-x'), 'gp-xName')
      .appendField(new FieldTextInput('gp-y'), 'gp-yName')
      .appendField(new FieldTextInput('gp-angle'), 'gp-angleName');
    this.appendDummyInput().appendField('when joystick moves');
    this.appendStatementInput('statements').appendField('do');
    this.setInputsInline(false);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
    this.getField('gp-xName').setEnabled(false);
    this.getField('gp-yName').setEnabled(false);
    this.getField('gp-angleName').setEnabled(false);
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
    this.changeListener = getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_DELETE &&
        (e as BlockDelete).ids?.includes(this.id)
      ) {
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
    if (ws === null) {
      return;
    }
    // Create variable for x coordinate.
    let xName = JavaScript.nameDB_.getName('gp-x', Names.NameType.VARIABLE);
    for (let i = 1; ws.getVariable(xName) !== null; i++) {
      // if variable already exists, append a number.
      xName = JavaScript.nameDB_.getName('gp-x-' + i, Names.NameType.VARIABLE);
    }
    this.xName = ws.createVariable(xName).name;
    this.getField('gp-xName').setValue(this.xName);
    // Create variable for y coordinate.
    let yName = JavaScript.nameDB_.getName('gp-y', Names.NameType.VARIABLE);
    for (let i = 1; ws.getVariable(yName) !== null; i++) {
      // if variable already exists, append a number.
      yName = JavaScript.nameDB_.getName('gp-y-' + i, Names.NameType.VARIABLE);
    }
    this.yName = ws.createVariable(yName).name;
    this.getField('gp-yName').setValue(this.yName);
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
    this.getField('gp-angleName').setValue(this.angleName);
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
    this.changeListener = getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_DELETE &&
        (e as BlockDelete).ids?.includes(this.id)
      ) {
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
