/**
 * @fileoverview Blocks handling thing instances for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {Blocks} = Blockly;

Blocks['generic_thing'] = {
  init: function () {
    this.appendDummyInput().appendField('generic thing');
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
