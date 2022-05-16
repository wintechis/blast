/**
 * @fileoverview Blocks definitions for a tulogic BlinkStick, see
 * (https://www.blinkstick.com/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {Blocks, FieldTextInput} = Blockly;
// eslint-disable-next-line node/no-missing-import
import Blinkstick from './../../things/Blinkstick.js';
import {implementedThings} from '../../blast_things.js';

const blinkstickInstances = new Map();

/**
 * Keeps singleton instances of Blinkstick instantiated by BLAST.
 * @param {string} id The id of the Blinkstick.
 */
const getBlinkstick = function (id) {
  if (blinkstickInstances.has(id)) {
    return blinkstickInstances.get(id);
  } else {
    const thing = new Blinkstick();
    blinkstickInstances.set(id, thing);
    return thing;
  }
};

/**
 * Generates JavaScript code for the things_blinkstick block.
 * @param {Blockly.Block} block the things_blinkstick block.
 * @returns {String} the generated code.
 */
Blocks['things_blinkstick'] = {
  /**
   * Block representing a BlinkStick.
   * @this Blockly.Block
   */
  init: function () {
    this.appendDummyInput()
      .appendField('BlinkStick')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput()
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A Tulogic BlinkStick.');
    this.setHelpUrl('https://github.com/wintechis/blast/wiki/BlinkStick');
    this.getField('name').setEnabled(false);
    this.firstTime = true;
    this.webHidId = '';
    this.thing = null;
  },
  onchange: function () {
    // on creating this block initialize new instance of BlinkStick
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.webHidId = this.getFieldValue('id');
      this.firstTime = false;
      getBlinkstick(this.webHidId)
        .init(this.webHidId)
        .then(thing => {
          this.thing = thing;
        });
    }
  },
};

Blocks['blinkstick_set_colors'] = {
  /**
   * Block for setting the colors of a BlinkStick.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput('COLOUR')
      .setCheck('Colour')
      .appendField('write colour property');
    this.appendValueInput('index').setCheck('Number').appendField('of LED #');
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
