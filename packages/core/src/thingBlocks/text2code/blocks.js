'use strict';

import Blockly from 'blockly';
import {addBlock} from './../../blast_toolbox.js';

const {Blocks} = Blockly;

Blocks['text_to_code'] = {
  /**
   * Block for converting a text input into js code.
   */
  init: function () {
    this.appendValueInput('text')
      .setCheck('String')
      .appendField('generate code from text');
    this.setOutput(true, null);
    this.setColour(160);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

// Add the block to the toolbox.
addBlock('text_to_code', 'Text Interface');
