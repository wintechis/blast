/**
 * @fileoverview Block definitions for the Xiaomi Mijia thermometer.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['read_mijia_property'] = {
  /**
   * Block for reading a property of a Xiaomi Mijia thermometer.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('get')
        .appendField(new Blockly.FieldDropdown(
            [
              ['temperature', 'temperature'],
              ['humidity', 'humidity'],
            ],
        ), 'measurement')
        .appendField('property of Xiaomi Mijia');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads the selected property of a Xiaomi Mijia Thermometer.');
    this.setHelpUrl('');
  },
};

// add read_mijia_property block to the toolbox.
Blast.Toolbox.addBlock('read_mijia_property', 'Properties');
