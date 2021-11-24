/**
 * @fileoverview Blocks definitions for a tulogic BlinkStick, see
 * (https://www.blinkstick.com/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['blinkstick_set_colors'] = {
  init: function() {
    this.appendValueInput('index')
        .setCheck('Number')
        .appendField('write colour property of LED');
    this.appendValueInput('COLOUR')
        .setCheck('Colour');
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

// Define inner blocks XML for the blinkstick_set_colors block.
const BLINKSTICK_SET_COLORS_XML = `
<block type="blinkstick_set_colors">
  <value name="index">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
  </value>
  <value name="COLOUR">
    <block type="colour_picker">
      <field name="COLOUR">#00ff00</field>
    </block>
  </value>
</block>
`;

// Add blinkstick_set_colors block to the toolbox.
Blast.Toolbox.addBlock('blinkstick_set_colors', 'Properties', BLINKSTICK_SET_COLORS_XML);
