/**
 * @fileoverview Blocks definitions for the audio blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
import {implementedThings} from '../../blast_things.js';

const {Blocks, FieldTextInput} = Blockly;

Blocks['things_audioOutput'] = {
  /**
   * Block representing an audio output device.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput('name')
      .appendField('Audio output', 'label')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput('id')
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('An audio output device.');
    this.getField('name').setEnabled(false);
  },
};

Blocks['play_audio'] = {
  /**
   * Block for playing audio from URIs.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('URI')
      .appendField('play audio from URI')
      .setCheck('URI');
    this.appendValueInput('thing')
      .appendField('on audio output')
      .setCheck('Thing');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Plays an audio file from URI.');
    this.setHelpUrl('');
  },
};

implementedThings.push({
  id: 'audioOutput',
  name: 'Audio Output Device',
  description: 'Plays an audio file from URI.',
  type: 'audio',
  blocks: [
    {
      type: 'play_audio',
      category: 'Actions',
    },
  ],
});
