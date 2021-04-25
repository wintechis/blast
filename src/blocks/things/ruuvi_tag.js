/**
 * @fileoverview Block definitions for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*******************
 * Property blocks.*
 *******************/

Blockly.Blocks['get_temperature'] = {
  /**
   * Block for the temperature property of a Ruuvi Tag.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('MAC')
        .setCheck('mac')
        .appendField('get temperature of Ruuvi Tag with mac');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads the temperature property of a Ruuvi Tag.');
    this.setHelpUrl('');
  },
};
