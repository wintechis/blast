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
    this.appendValueInput('red')
        .setCheck('Number')
        .appendField('write color properties: red ');
    this.appendValueInput('green')
        .setCheck('Number')
        .appendField('green');
    this.appendValueInput('blue')
        .setCheck('Number')
        .appendField('blue');
    this.appendValueInput('thing')
        .setCheck('Thing')
        .appendField('to LED controller');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
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
        Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
        this.dispose();
      }
    }
  },
};

// Define inner block XML for the switch_lights_rgb block.
const SWITCH_LIGHTS_RGB_XML = `
<block type="switch_lights_rgb">
  <value name="red">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
  </value>
  <value name="green">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
  </value>
  <value name="blue">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
  </value>
</block>`;

// Add switch_lights_rgb block to the toolbox.
Blast.Toolbox.addBlock('switch_lights_rgb', 'Properties', SWITCH_LIGHTS_RGB_XML);

Blockly.Blocks['switch_lights_ryg'] = {
  /**
    * Block for switchling ryg lights.
    * @this {Blockly.Block}
    */
  init: function() {
    this.appendValueInput('red')
        .setCheck('Number')
        .appendField('write color properties: red ');
    this.appendValueInput('yellow')
        .setCheck('Number')
        .appendField('yellow');
    this.appendValueInput('green')
        .setCheck('Number')
        .appendField('green');
    this.appendValueInput('thing')
        .setCheck('Thing')
        .appendField('to LED controller');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Swichtes checked lights on and unchecked ones off.');
    this.setHelpUrl('');
    this.firstTime = true;
  },
  onchange: function() {
    // on creating this block check webBluetooth availability
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        Blockly.alert(`Webbluetooth is not supported by this browser.\n
        Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
        this.dispose();
      }
    }
  },
};

// Define inner block XML for the switch_lights_ryg block.
const SWITCH_LIGHTS_RYG_XML = `
<block type="switch_lights_ryg">
  <value name="red">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
  </value>
  <value name="yellow">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
  </value>
  <value name="green">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
  </value>
</block>`;

// Add switch_lights_ryg block to the toolbox.
Blast.Toolbox.addBlock('switch_lights_ryg', 'Properties', SWITCH_LIGHTS_RYG_XML);
