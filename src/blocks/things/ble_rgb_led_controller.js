/**
 * @fileoverview Blocks definitions for a BLE RGB LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*******************
 * Property blocks.*
 *******************/


Blockly.Blocks['switch_lights_rgb'] = {
  /**
    * Block for switchling lights.
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
    this.setTooltip('Swichtes checked lights on and unchecked ones off.');
    this.setHelpUrl('');
  },
};
