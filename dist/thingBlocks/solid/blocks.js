/**
 * @fileoverview Blocks definitions for blocks interacting with solid pods.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {Blocks} from 'blockly';
import {addBlock} from './../../../src/blast_toolbox.js';

Blocks['upload_image'] = {
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
addBlock('upload_image', 'Actions');
