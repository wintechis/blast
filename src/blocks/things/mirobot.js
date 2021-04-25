/**
 * @fileoverview Block definitions for the miroBot
 * (https://www.wlkata.com/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*******************
 * Property blocks.*
 *******************/

Blockly.Blocks['mirobot_pickup'] = {
  /**
    * Block for picking up boxes from pre-defined locations.
    * @this {Blockly.Block}
    */
  init: function() {
    this.appendDummyInput()
        .appendField('Robot-arm, pick up')
        .appendField(
            new Blockly.FieldDropdown([
              ['blue', 'BLUE'],
              ['red', 'RED'],
              ['yellow', 'YELLOW'],
              ['green', 'GREEN'],
            ]),
            'box',
        )
        .appendField('box');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Invokes pick-up action for the selected box.');
    this.setHelpUrl('');
  },
};
 
