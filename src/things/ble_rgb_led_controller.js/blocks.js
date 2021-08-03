/**
 * @fileoverview Blocks definitions for a BLE RGB LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';
 
Blockly.Blocks['switch_lights_rgb'] = {
  /**
     * Block for switchling rgb lights.
     * @this {Blockly.Block}
     */
  init: function() {
    this.appendDummyInput()
        .appendField('switch RGB lights of');
    this.appendValueInput('mac')
        .setCheck('Thing');
    this.appendDummyInput()
        .appendField('red')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'cb_red')
        .appendField('green')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'cb_green')
        .appendField('blue')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'cb_blue');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Switches checked lights on and unchecked ones off.');
    this.setHelpUrl('');
    this.firstTime = true;
  },
  onchange: function() {
    // on creating this block check webBluetooth availability
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

// Add switch_lights_rgb block to the toolbox.
Blast.Toolbox.addBlock('switch_lights_rgb', 'Properties');

Blockly.Blocks['switch_lights_ryg'] = {
  /**
    * Block for switchling ryg lights.
    * @this {Blockly.Block}
    */
  init: function() {
    this.appendDummyInput()
        .appendField('switch RYG lights of');
    this.appendValueInput('mac')
        .setCheck('Thing');
    this.appendDummyInput()
        .appendField('red')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'cb_red')
        .appendField('yellow')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'cb_yellow')
        .appendField('green')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'cb_green');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Swichtes checked lights on and unchecked ones off.');
    this.setHelpUrl('');
  },
};

// Add switch_lights_ryg block to the toolbox.
Blast.Toolbox.addBlock('switch_lights_ryg', 'Properties');
