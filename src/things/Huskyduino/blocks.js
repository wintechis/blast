/**
 * @fileoverview Block definitions for the Huskyduino blocks, see
 * (https://github.com/wintechis/huskyduino) for the interface specification.
 * @author yongxu.ren1996@gmail.com
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['huskylens_choose_algo'] = {
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('write algorithm property')
        .appendField(new Blockly.FieldDropdown([
          ['Face Recognition', 'face_recognition'],
          ['Object Tracking', 'object_tracking'],
          ['Object Recognition', 'object_recognition'],
          ['Line Tracking', 'line_tracking'],
          ['Color Recognition', 'color_recognition'],
          ['Tag Recognition', 'tag_recognition'],
          ['Object Classification', 'object_classification'],
        ]), 'Algorithms')
        .appendField('to Huskyduino');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Choose the algorithm of a HuskyDuino');
    this.setHelpUrl('');
  },

  onchange: function() {
    // on creating this block check webBluetooth availability.
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        Blockly.alert(`Webbluetooth is not supported by this browser.\n
                Upgrade to Chrome version 85 or later.`);
        this.dispose();
      }
    }
  },
};

// Add choose the huskylens_choose_algo to the toolbox.
Blast.Toolbox.addBlock('huskylens_choose_algo', 'Properties');


Blockly.Blocks['huskylens_write_id'] = {
  init: function() {
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
    this.setTooltip('Sets the ID of the object currently on camera. ID shoud be a value between 1 and 255');
    this.setHelpUrl('');
  },

  onchange: function() {
    // on creating this block check webBluetooth availability.
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        Blockly.alert(`Webbluetooth is not supported by this browser.\n
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
// Add the huskylens_write_face_id block to the toolbox.
Blast.Toolbox.addBlock('huskylens_write_id', 'Properties', HUSKYLENS_WRITE_ID_XML);


Blockly.Blocks['huskylens_write_forget_flag'] = {
  init: function() {
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
    
  onchange: function() {
    // on creating this block check webBluetooth availability.
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        Blockly.alert(`Webbluetooth is not supported by this browser.\n
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

// Add the huskylens_write_forget_flag block to the toolbox.
Blast.Toolbox.addBlock('huskylens_write_forget_flag', 'Properties', HUSKYLENS_FORGET_FLAG_XML);


Blockly.Blocks['huskylens_read_id'] = {
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('read ID property of HuskyDuino');
    this.setOutput(true, 'String');
    this.setColour(255);
    this.setTooltip('returns up to 5 IDs of the currently visible to the HuskyLens');
    this.setHelpUrl('');
  },

  onchange: function() {
    // on creating this block check webBluetooth availability.
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        Blockly.alert(`Webbluetooth is not supported by this browser.\n
                Upgrade to Chrome version 85 or later.`);
        this.dispose();
      }
    }
  },
};

// Add the huskylens_read_id block to the toolbox.
Blast.Toolbox.addBlock('huskylens_read_id', 'Properties');
