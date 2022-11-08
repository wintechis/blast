import {Blocks, FieldDropdown, FieldMultilineInput} from 'blockly';
import {addBlock} from '../../blast_toolbox.js';

Blocks['audio_to_text'] = {
  /**
   * Block converting mic input into a string.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput().appendField('audio to text');
    this.appendDummyInput('en');
    this.setOutput(true, 'String');
    this.setColour(230);
    this.setTooltip('outputs speech command from microphone as a string');
    this.setHelpUrl('');
  },
};
// Add the block to the toolbox.
addBlock('audio_to_text', 'actions');
