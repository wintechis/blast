/**
 * @fileoverview Blocks definitions for a tulogic BlinkStick, see
 * (https://www.blinkstick.com/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['blinkstick_set_colors'] = {
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
        .appendField('to BlinkStick');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Set the color properties of a tulogic BlinkStick.');
    this.setHelpUrl('https://www.blinkstick.com/');
  },
};

// Add blinkstick_set_colors block to the toolbox.
Blast.Toolbox.addBlock('blinkstick_set_colors', 'Properties');
