/**
 * @fileoverview Blocks definitions for blocks interacting with solid pods.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {Blocks} = Blockly;
import {addBlock} from '../../../BlocklyWorkspace/toolbox.ts';

Blocks['solid_upload_image'] = {
  /**
   * Block for uploading an image to a solid container.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('image')
      .setCheck('Image')
      .appendField('upload image');
    this.appendValueInput('url')
      .setCheck('URI')
      .appendField('to solid container');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Uploads an image to a solid pod.');
    this.setHelpUrl('');
  },
};

// Add display_image block to the toolbox.
addBlock('solid_upload_image', 'Requests');
