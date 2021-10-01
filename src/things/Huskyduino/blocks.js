/**
 * @fileoverview Block definitions for Huskyduino
 *
 * @author yongxu.ren1996@gmail.com
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['huskylens_choosealgo'] = {
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

// Add write_huskylens_algo block to the toolbox.
Blast.Toolbox.addBlock('huskylens_choosealgo', 'Properties');


Blockly.Blocks['huskylens_learnid'] = {
  init: function() {
    this.appendValueInput('Thing')
        .setCheck(null)
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

// Add write_huskylens_faceid block to the toolbox.
Blast.Toolbox.addBlock('huskylens_learnid', 'Properties');


Blockly.Blocks['huskylens_forgetall'] = {
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

// Add write_huskylens_forget_flag block to the toolbox.
Blast.Toolbox.addBlock('huskylens_forgetall', 'Properties');
