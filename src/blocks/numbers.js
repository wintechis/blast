/**
 * @fileoverview Number blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {addBlock} from './../blast_toolbox.js';

// Remap blockly blocks to improve naming in xml.
Blockly.Blocks['number_value'] = Blockly.Blocks['math_number'];
Blockly.Blocks['number_arithmetic'] = Blockly.Blocks['math_arithmetic'];
Blockly.Blocks['number_single'] = Blockly.Blocks['math_single'];
Blockly.Blocks['number_trig'] = Blockly.Blocks['math_trig'];
Blockly.Blocks['number_constant'] = Blockly.Blocks['math_constant'];
Blockly.Blocks['number_property'] = Blockly.Blocks['math_number_property'];
Blockly.Blocks['number_round'] = Blockly.Blocks['math_round'];
Blockly.Blocks['number_on_list'] = Blockly.Blocks['math_on_list'];
Blockly.Blocks['number_modulo'] = Blockly.Blocks['math_modulo'];
Blockly.Blocks['number_constrain'] = Blockly.Blocks['math_constrain'];
Blockly.Blocks['number_random'] = Blockly.Blocks['math_random_int'];
Blockly.Blocks['number_random_float'] = Blockly.Blocks['math_random_float'];
Blockly.Blocks['number_atan2'] = Blockly.Blocks['math_atan2'];

Blockly.Blocks['parse_int'] = {
  /**
     * Block parsing a string to an integer.
     */
  init: function() {
    this.appendValueInput('number')
        .setCheck('String')
        .appendField('Conver text');
    this.appendDummyInput()
        .appendField('to number');
    this.setOutput(true, 'Number');
    this.setColour(230);
    this.setTooltip('Parses a string to an integer.');
    this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt');
  },
};

const PARSE_INT_XML = `
<block type="parse_int">
  <value name="number">
    <block type="text">
      <field name="TEXT">42</field>
    </block>
  </value>
</block>
`;

addBlock('parse_int', 'Numbers', PARSE_INT_XML);
