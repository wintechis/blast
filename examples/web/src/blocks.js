/**
 * @fileoverview Additional Blocks definitions for BLAST web example.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
       
'use strict';

import Blockly from 'blockly';
import {addBlock} from './../../../dist/blast_toolbox.js';


Blockly.Blocks['display_table'] = {
  /**
          * Block for outputting data tables (rdf graphs).
          * @this {Blockly.Block}
          */
  init: function() {
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

Blockly.Blocks['display_image'] = {
  /**
     * Block for displaying an image.
     * @this {Blockly.Block}
     */
  init: function() {
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
