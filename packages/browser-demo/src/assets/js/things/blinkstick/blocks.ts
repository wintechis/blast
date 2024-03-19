/**
 * @fileoverview Blocks definitions for a tulogic BlinkStick, see
 * (https://www.blinkstick.com/).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Blocks, FieldTextInput} from 'blockly';
import {implementedThings} from '../../../../ThingsStore/things';

Blocks['things_blinkstick'] = {
  /**
   * Block representing a BlinkStick.
   * @this Blockly.Block
   */
  init: function () {
    this.appendDummyInput('name')
      .appendField('BlinkStick', 'label')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput('id')
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A Tulogic BlinkStick.');
    this.setHelpUrl('https://github.com/wintechis/blast/wiki/BlinkStick');
    this.getField('name').setEnabled(false);
  },
};

Blocks['blinkstick_set_colors'] = {
  /**
   * Block for setting the colors of a BlinkStick.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput('colour')
      .appendField('write colour property', 'label')
      .setCheck('Colour');
    this.appendValueInput('index')
      .appendField('of LED #', 'label')
      .setCheck('Number');
    this.appendValueInput('thing')
      .appendField('to BlinkStick', 'label')
      .setCheck('Thing');
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
    <block type="number_value">
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

// Add blinkstick block to the list of implemented things.
implementedThings.push({
  id: 'blinkstick',
  name: 'BlinkStick',
  type: 'hid',
  blocks: [
    {
      type: 'blinkstick_set_colors',
      category: 'Properties',
      XML: BLINKSTICK_SET_COLORS_XML,
    },
  ],
  infoUrl: 'https://github.com/wintechis/blast/wiki/BlinkStick',
  filters: [
    {
      vendorId: 0x20a0,
      productId: 0x41e5,
    },
  ],
});
