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
    this.appendValueInput('colour')
        .setCheck('Colour')
        .appendField('write colour property: ');
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
  <value name="colour">
    <block type="colour_picker">
      <field name="COLOUR">#ff0000</field>
    </block>
  </value>
</block>`;

// Add switch_lights_rgb block to the toolbox.
Blast.Toolbox.addBlock('switch_lights_rgb', 'Properties', SWITCH_LIGHTS_RGB_XML);
