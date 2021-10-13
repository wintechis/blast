/**
 * @fileoverview Block definitions for [Huskyduino](https://github.com/wintechis/huskyduino)
 * @author yongxu.ren1996@gmail.com
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['huskylens_choose_algo'] = {
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('write')
        .appendField(new Blockly.FieldDropdown([
          ['Face Recognition', 'face_recognition'],
          ['Object Tracking', 'object_tracking'],
          ['Object Recognition', 'object_recognition'],
          ['Line Tracking', 'line_tracking'],
          ['Color Recognition', 'color_recognition'],
          ['Tag Recognition', 'tag_recognition'],
          ['Object Classification', 'object_classification'],
        ]), 'Algorithms')
        .appendField('Algorithm to Huskyduino');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Choose the algorithm for Huskylens');
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

// Add choose algorithm block to the toolbox.
Blast.Toolbox.addBlock('huskylens_choose_algo', 'Properties');


Blockly.Blocks['huskylens_learn_id'] = {
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('learning a face with ID')
        .appendField(new Blockly.FieldNumber(0, 1, 255, 1), 'ID');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('ID shoud be a value between 1 and 255');
    this.setHelpUrl('');
  },

  onchange: function() {
    // on creating this block check webBluetooth availability, then request LEScan.
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

// Add learn face id block to the toolbox.
Blast.Toolbox.addBlock('huskylens_learn_id', 'Properties');


Blockly.Blocks['huskylens_forget_all'] = {
  init: function() {
    this.appendValueInput('Thing')
        .setCheck(null)
        .appendField('write a forget flag to Huskyduino')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'ForgetFlag');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('forget all learned knowledge under this algorithm');
    this.setHelpUrl('');
  },
    
  onchange: function() {
    // on creating this block check webBluetooth availability, then request LEScan.
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

// Add forget all knowledge block to the toolbox.
Blast.Toolbox.addBlock('huskylens_forget_all', 'Properties');


Blockly.Blocks['huskylens_read_id'] = {
  init: function() {
    this.appendValueInput('Thing')
        .setCheck(null)
        .appendField('read face IDs out from Huskyduino');
    this.setOutput(true, 'String');
    this.setColour(255);
    this.setTooltip('read maximal 10 IDs out');
    this.setHelpUrl('');
  },

  onchange: function() {
    // on creating this block check webBluetooth availability, then request LEScan.
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

// Add read face IDs block to the toolbox.
Blast.Toolbox.addBlock('huskylens_read_id', 'Properties');
