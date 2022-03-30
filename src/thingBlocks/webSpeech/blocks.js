/**
 * @fileoverview Blocks definitions for the WebSpeech API, see
 * (https://wicg.github.io/speech-api/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {Blocks, dialog} from 'blockly';
import {addBlock} from './../../blast_toolbox.js';

Blocks['text_to_speech'] = {
  /**
   * Block for outputting a string over audio output.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('text')
      .appendField('text to speech')
      .setCheck('String');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

// Add the block to the toolbox.
addBlock('text_to_speech', 'actions');

Blocks['web_speech'] = {
  /**
   * Block converting mic input into a string.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput().appendField('speech to text');
    this.setOutput(true, 'String');
    this.setColour(0);
    this.setTooltip('outputs speech command from microphone as a string');
    this.setHelpUrl('');
    this.firstTime = true;
  },
  onchange: function () {
    // on creating this block check speech API availability
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!('webkitSpeechRecognition' in window)) {
        dialog.alert(`Web Speech API is not supported by this browser.
        Upgrade to <a href="//www.google.com/chrome">Chrome</a>
        version 25 or later.`);
        this.dispose();
      }
    }
  },
};

// Add the block to the toolbox.
addBlock('web_speech', 'actions');
