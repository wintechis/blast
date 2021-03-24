/**
 * @fileoverview Number blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

// Remap blockly blocks to improve naming in xml.
Blockly.Blocks['number_value'] = Blockly.Blocks['math_number'];
Blockly.Blocks['number_random'] = Blockly.Blocks['math_random_int'];
Blockly.Blocks['number_arithmetic'] = Blockly.Blocks['math_arithmetic'];
Blockly.Blocks['number_modulo'] = Blockly.Blocks['math_modulo'];
 
Blockly.Blocks['number_infinity'] = {
  /**
   * Block reporesenting inifinty.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField('infinity');
    this.setOutput(true, 'Number');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
