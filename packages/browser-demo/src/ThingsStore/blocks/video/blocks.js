/**
 * @fileoverview Blocks definitions for the video blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
import {implementedThings} from '../../things.ts';

const {Blocks, FieldTextInput} = Blockly;

Blocks['things_videoInput'] = {
  /**
   * Block representing a video input device.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput('name')
      .appendField('Video input', 'label')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput('id')
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A video input device.');
    this.getField('name').setEnabled(false);
  },
};

Blocks['videoInput_getFrame'] = {
  /**
   * Block for getting a frame from a video input device.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('thing')
      .appendField('get frame from video input')
      .setCheck('Thing');
    this.setOutput(true, 'Image');
    this.setColour(0);
    this.setTooltip('Gets a frame from a video input device.');
    this.setHelpUrl('');
  },
};

implementedThings.push({
  id: 'videoInput',
  name: 'Video Input Device',
  type: 'videoinput',
  blocks: [
    {
      type: 'videoInput_getFrame',
      category: 'Actions',
    },
  ],
});
