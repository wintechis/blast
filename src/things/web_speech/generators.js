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

/**
 * Plays an audio file provided by URI.
 * @param {string} uri URI of the audio file to play.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const textToSpeech = async function(uri, callback) {
  await Blast.Things.ConsumedThing.Blast.blast.invokeAction(
      'textToSpeech', [uri],
  );
  callback();
};

// add block functions to the interpreter's API
// TODO implement persing this in initAPI
Blast.asyncApiFunction.push(textToSpeech);

/**
 * Outputs speech input as string.
 * @param {Blockly.Block.id} blockId id of the webSpeech block.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const webSpeech = async function(blockId, callback) {
  const block = Blast.workspace.getBlockById(blockId);
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

// add block functions to the interpreter's API
// TODO implement persing this in initAPI
Blast.asyncApiFunction.push(webSpeech);
