/**
 * @fileoverview Block definitions for the blocks in the `display` category.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
import {addBlock} from './../blast_toolbox.js';

const {Blocks} = Blockly;

Blocks['display_text'] = {
  /**
   * Block for outputting text.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('text')
      .setCheck(['String', 'Number', 'Boolean', 'URI', 'Thing', 'Array'])
      .appendField('display text');
    this.setColour(0);
    this.setTooltip('Add text output to the container on the right.');
    this.setHelpUrl('');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};
// Add display_text block to the toolbox.
addBlock('display_text', 'Display');
