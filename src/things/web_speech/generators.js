/**
 * @fileoverview Block generators for the the WebSpeech API, see
 * (https://wicg.github.io/speech-api/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

goog.module('Blast.generators.web_speech');

const {asyncApiFunctions} = goog.require('Blast.Interpreter');
const {getWorkspace} = goog.require('Blast.Interpreter');

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
   * Generates Javascript code for the web_speech block.
   * Outputs speech command from microphone as a string.
   * @param {Blockly.Block} block the web_speech block.
   * @returns {String} the speech command.
   */
Blockly.JavaScript['web_speech'] = function(block) {
  const code = `webSpeech('${block.id}')`;
  
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Outputs speech input as string.
 * @param {Blockly.Block.id} blockId id of the webSpeech block.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const webSpeech = async function(blockId, callback) {
  const block = getWorkspace().getBlockById(blockId);
  const recognition = block.recognition;
  recognition.continuous = false;
  recognition.lang = 'en-US';
  let finalTranscript = '';

  recognition.onresult = function(event) {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      }
    }
  };

  recognition.onend = function() {
    callback(finalTranscript);
  };

  recognition.start();
};
// add block webSpeech to the interpreter's API.
asyncApiFunctions.push(['webSpeech', webSpeech]);

/**
 * Invokes a SpeechSynthesisUtterance to read out a text.
 * @param {string} text text that will be synthesised when the utterance is spoken.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * TODO #53 Add the following parameters (#53)
 * @param {SpeechSynthesisVoice=} voice voice that will be used to speak the utterance.
 * @param {Number=} rate speed at which the utterance will be spoken at
 * @param {Number=} volume volume that the utterance will be spoken at.
 * @param {Number=} pitch pitch at which the utterance will be spoken at
 * @param {string} lang language of the utterance.
 */
const textToSpeech = async function(text, callback) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = text;
  window.speechSynthesis.speak(speech);
  // return after speaking has ended
  await new Promise((resolve) => {
    speech.onend = resolve;
  });
  callback();
};
// add textToSpeech function to the interpreter's API.
asyncApiFunctions.push(['textToSpeech', textToSpeech]);
