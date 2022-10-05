/**
 * @fileoverview Blocks definitions for BLAST (as a thing) properties, actions and events.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
import {addBlock} from './../../blast_toolbox.js';

const {Blocks} = Blockly;

Blocks['play_audio'] = {
  /**
   * Block for playing audio from URIs.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('URI')
      .appendField('play audio from URI')
      .setCheck('URI');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Plays an audio file from URI.');
    this.setHelpUrl('');
  },
};
// Add play_audio block to the toolbox.
addBlock('play_audio', 'Actions');

Blocks['capture_image'] = {
  /**
   * Block for capturing an image from a camera.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput().appendField('capture image from camera');
    this.setOutput(true, 'Image');
    this.setColour(0);
    this.setTooltip('Captures an image from a camera.');
    this.setHelpUrl('');
  },
  onChange: function () {
    // Check if browser supports camera.
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.setWarningText('Your browser does not support mediaDevices.');
    }
  },
};

// Add capture_image block to the toolbox.
addBlock('capture_image', 'Actions');
