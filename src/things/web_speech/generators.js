/**
 * @fileoverview Block definitions for the the WebSpeech API, see
 * (https://wicg.github.io/speech-api/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/**
 * Generates JavaScript code for the play_audio block.
 * @param {Blockly.Block} block the play_audio block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['text_to_speech'] = function(block) {
  const text = Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `textToSpeech(${text});\n`;
  
  return code;
};
  
/**
   * Outputs speech command from microphone as a string.
   * @param {Blockly.Block} block the web_speech block.
   * @returns {String} the speech command.
   */
Blockly.JavaScript['web_speech'] = function(block) {
  const code = `webSpeech('${block.id}')`;
  
  return [code, Blockly.JavaScript.ORDER_NONE];
};
  
