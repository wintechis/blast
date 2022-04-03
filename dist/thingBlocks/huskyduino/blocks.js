/**
 * @fileoverview Block definitions for the Huskyduino blocks, see
 * (https://github.com/wintechis/huskyduino) for the interface specification.
 * @author yongxu.ren1996@gmail.com
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {Blocks, dialog, FieldDropdown, FieldTextInput} from 'blockly';
import {implementedThings} from '../../blast_things.js';
// eslint-disable-next-line node/no-missing-import
import HuskyDuino from './../../things/huskyDuino/HuskyDuino.js';

Blocks['things_huskylens'] = {
  /**
   * Block representing a BLE RGB LED controller.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput()
      .appendField('HuskyDuino')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput()
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A HuskyDuino.');
    this.setHelpUrl('');
    this.getField('name').setEnabled(false);
    this.firstTime = true;
    this.webBluetoothId = '';
    this.thing = null;
  },
  onchange: function () {
    // on creating this block initialize new instance of BleRgbController
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.webBluetoothId = this.getFieldValue('id');
      this.thing = new HuskyDuino(this.webBluetoothId);
      this.firstTime = false;
    }
  },
};

Blocks['huskylens_choose_algo'] = {
  init: function () {
    this.appendValueInput('Thing')
      .setCheck('Thing')
      .appendField('write algorithm property')
      .appendField(
        new FieldDropdown([
          ['Face Recognition', 'face_recognition'],
          ['Object Tracking', 'object_tracking'],
          ['Object Recognition', 'object_recognition'],
          ['Line Tracking', 'line_tracking'],
          ['Color Recognition', 'color_recognition'],
          ['Tag Recognition', 'tag_recognition'],
          ['Object Classification', 'object_classification'],
        ]),
        'Algorithms'
      )
      .appendField('to HuskyDuino');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Choose the algorithm of a HuskyDuino');
    this.setHelpUrl('');
  },

  onchange: function () {
    // on creating this block check webBluetooth availability.
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        dialog.alert(`Webbluetooth is not supported by this browser.\n
                Upgrade to Chrome version 85 or later.`);
        this.dispose();
      }
    }
  },
};

Blocks['huskylens_write_id'] = {
  init: function () {
    this.appendValueInput('ID')
      .setCheck('Number')
      .appendField('write ID property');
    this.appendValueInput('Thing')
      .setCheck('Thing')
      .appendField('to HuskyDuino');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip(
      'Sets the ID of the object currently on camera. ID shoud be a value between 1 and 255'
    );
    this.setHelpUrl('');
  },

  onchange: function () {
    // on creating this block check webBluetooth availability.
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        dialog.alert(`Webbluetooth is not supported by this browser.\n
                Upgrade to Chrome version 85 or later.`);
        this.dispose();
      }
    }
  },
};

// Define inner blocks XML for the huskylens_write_face_id block.
const HUSKYLENS_WRITE_ID_XML = `
<block type="huskylens_write_id">
  <value name="ID">
    <block type="math_number">
      <field name="NUM">1</field>
    </block>
  </value>
</block>
`;

Blocks['huskylens_write_forget_flag'] = {
  init: function () {
    this.appendValueInput('forgetFlag')
      .setCheck('Boolean')
      .appendField('write forget flag property');
    this.appendValueInput('Thing')
      .setCheck('Thing')
      .appendField('to HuskyDuino');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('forget all values of the currently selected algorithm');
    this.setHelpUrl('');
  },

  onchange: function () {
    // on creating this block check webBluetooth availability.
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        dialog.alert(`Webbluetooth is not supported by this browser.\n
                Upgrade to Chrome version 85 or later.`);
        this.dispose();
      }
    }
  },
};

// Define inner blocks XML for the huskylens_write_forget_flag block.
const HUSKYLENS_FORGET_FLAG_XML = `
<block type="huskylens_write_forget_flag">
  <value name="forgetFlag">
    <block type="logic_boolean">
      <field name="BOOL">TRUE</field>
    </block>
  </value>
</block>
`;

Blocks['huskylens_read_id'] = {
  init: function () {
    this.appendValueInput('Thing')
      .setCheck('Thing')
      .appendField('read ID property of HuskyDuino');
    this.setOutput(true, 'String');
    this.setColour(255);
    this.setTooltip(
      'returns up to 5 IDs of the objects currently visible to the HuskyLens'
    );
    this.setHelpUrl('');
  },

  onchange: function () {
    // on creating this block check webBluetooth availability.
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        dialog.alert(`Webbluetooth is not supported by this browser.\n
                Upgrade to Chrome version 85 or later.`);
        this.dispose();
      }
    }
  },
};

// Add HuskyDuino to the list of implemented things.
implementedThings.push({
  id: 'HuskyDuino',
  name: 'HuskyDuino',
  type: 'bluetooth',
  blocks: [
    {
      type: 'huskylens_choose_algo',
      category: 'Properties',
    },
    {
      type: 'huskylens_write_id',
      category: 'Properties',
      XML: HUSKYLENS_WRITE_ID_XML,
    },
    {
      type: 'huskylens_write_forget_flag',
      category: 'Properties',
      XML: HUSKYLENS_FORGET_FLAG_XML,
    },
    {
      type: 'huskylens_read_id',
      category: 'Properties',
    },
  ],
  optionalServices: ['5be35d20-f9b0-11eb-9a03-0242ac130003'],
});
