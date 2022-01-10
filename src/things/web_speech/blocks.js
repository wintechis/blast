/**
 * @fileoverview Blocks definitions for the WebSpeech API, see
 * (https://wicg.github.io/speech-api/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

goog.module('Blast.blocks.web_speech');

const {addBlock} = goog.require('Blast.Toolbox');

Blockly.Blocks['text_to_speech'] = {
  /**
   * Block for outputting a string over audio output.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('text')
        .appendField('Text to Speech')
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

Blockly.Blocks['web_speech'] = {
  /**
   * Block converting mic input into a string.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField('speech to text');
    this.setOutput(true, 'String');
    this.setColour(0);
    this.setTooltip('outputs speech command from microphone as a string');
    this.setHelpUrl('');
    this.firstTime = true;
    this.recognition = null;
  },
  onchange: function() {
    // on creating this block check speech API availability
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!('webkitSpeechRecognition' in window)) {
        Blockly.alert(`Web Speech API is not supported by this browser.
        Upgrade to <a href="//www.google.com/chrome">Chrome</a>
        version 25 or later.`);
        this.dispose();
      } else {
        // eslint-disable-next-line new-cap
        this.recognition = new webkitSpeechRecognition();
      }
    }
  },
};

// Add the block to the toolbox.
addBlock('web_speech', 'actions');
