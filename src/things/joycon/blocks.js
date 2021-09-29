/**
 * @fileoverview Blocks definitions for Nintendo JoyCon controllers.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['joycon_read_property'] = {
  /**
     * Block to read a property of a JoyCon.
     * @this Blockly.Block
     */
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('read')
        .appendField(new Blockly.FieldDropdown([
          ['gyroscope', 'Gyroscope'],
        ]), 'property')
        .appendField('property of Nintendo JoyCon');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads a property of a Nintendo JoyCon controller.');
    this.setHelpUrl('');
    this.firstTime = true;
  },
};

// Add joycon_read_property block to the toolbox.
Blast.Toolbox.addBlock('joycon_read_property', 'Properties');
