'use strict';

import {Blocks} from 'blockly';
import {addBlock} from './../../blast_toolbox.js';

Blocks['text_to_code'] = {
  /**
   * Block for converting a text input into js code.
   */
  init: function () {
    this.appendValueInput('text')
      .setCheck('String')
      .appendField('generate code from text');
    this.setOutput(true, null);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

// Add the block to the toolbox.
addBlock('text_to_code', 'actions');
