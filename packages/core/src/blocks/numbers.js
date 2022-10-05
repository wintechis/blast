/**
 * @fileoverview Number blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {Blocks} = Blockly;
import {addBlock} from './../blast_toolbox.js';

// Remap blockly blocks to improve naming in xml.
Blocks['number_value'] = Blocks['math_number'];
Blocks['number_arithmetic'] = Blocks['math_arithmetic'];
Blocks['number_single'] = Blocks['math_single'];
Blocks['number_trig'] = Blocks['math_trig'];
Blocks['number_constant'] = Blocks['math_constant'];
Blocks['number_property'] = Blocks['math_number_property'];
Blocks['number_round'] = Blocks['math_round'];
Blocks['number_on_list'] = Blocks['math_on_list'];
Blocks['number_modulo'] = Blocks['math_modulo'];
Blocks['number_constrain'] = Blocks['math_constrain'];
Blocks['number_random'] = Blocks['math_random_int'];
Blocks['number_random_float'] = Blocks['math_random_float'];
Blocks['number_atan2'] = Blocks['math_atan2'];

Blocks['parse_int'] = {
  /**
   * Block parsing a string to an integer.
   */
  init: function () {
    this.appendValueInput('number')
      .setCheck('String')
      .appendField('convert text');
    this.appendDummyInput().appendField('to number');
    this.setOutput(true, 'Number');
    this.setColour(230);
    this.setTooltip('Parses a string to an integer.');
    this.setHelpUrl(
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt'
    );
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
