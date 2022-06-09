'use strict';

import {Blocks, FieldDropdown, FieldMultilineInput} from 'blockly';
import {addBlock} from './../../blast_toolbox.js';


Blocks['text_to_code'] = {
    /**
     * Block for convertubf a text input into js code
     */
  init: function() {
    this.appendValueInput("text")
        .setCheck('String')
        .appendField("text_to_code");
    this.setOutput(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

// Add the block to the toolbox.
addBlock("text_to_code", "actions");