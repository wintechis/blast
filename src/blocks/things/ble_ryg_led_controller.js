/**
 * @fileoverview Blocks definitions for a BLE RYG LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*******************
 * Property blocks.*
 *******************/


Blockly.Blocks['switch_lights_ryg'] = {
  /**
    * Block for switchling lights.
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
