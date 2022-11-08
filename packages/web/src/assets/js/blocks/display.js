/**
 * @fileoverview Block definitions for the blocks in the `display` category.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
import {addBlock} from '../toolbox.js';

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

Blocks['display_table'] = {
  /**
   * Block for outputting data tables (rdf graphs).
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('table')
      .setCheck(['Array'])
      .appendField('display table');
    this.setColour(0);
    this.setTooltip('Add data output to the container on the right.');
    this.setHelpUrl('');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};
// Add display_table block to the toolbox.
addBlock('display_table', 'Display');

Blocks['display_image'] = {
  /**
   * Block for displaying an image.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('image')
      .setCheck('Image')
      .appendField('display image');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Displays an image.');
    this.setHelpUrl('');
  },
};

// Add display_image block to the toolbox.
addBlock('display_image', 'Display');
