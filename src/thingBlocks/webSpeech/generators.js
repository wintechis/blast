/**
 * @fileoverview Block generators for the the WebSpeech API, see
 * (https://wicg.github.io/speech-api/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
// eslint-disable-next-line node/no-missing-import
import SpeechApiService from '../../things/speechApi/SpeechApiService.js';
import {asyncApiFunctions} from './../../blast_interpreter.js';

/**
 * Generates JavaScript code for the play_audio block.
 * @param {Blockly.Block} block the play_audio block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['text_to_speech'] = function (block) {
  const text =
    Blockly.JavaScript.valueToCode(
      block,
      'text',
      Blockly.JavaScript.ORDER_ATOMIC
    ) || Blockly.JavaScript.quote_('');
  let lang = block.getFieldValue('language');
  if (lang.length < 4) {
    lang = block.getFieldValue(lang);
  }
  lang = Blockly.JavaScript.quote_(lang);

  const code = `textToSpeech(${text}, ${lang});\n`;

  return code;
};

/**
 * Generates Javascript code for the web_speech block.
 * Outputs speech command from microphone as a string.
 * @param {Blockly.Block} block the web_speech block.
 * @returns {String} the speech command.
 */
// eslint-disable-next-line no-unused-vars
Blockly.JavaScript['web_speech'] = function (block) {
  let lang = block.getFieldValue('language');
  if (lang.length < 4) {
    lang = block.getFieldValue(lang);
  }
  lang = Blockly.JavaScript.quote_(lang);
  const code = `speechToText(${lang})`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Outputs speech input as string.
 * @param {string} lang language of the utterance.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const speechToText = async function (lang, callback) {
  const thing = new SpeechApiService();
  const result = await thing.invokeAction('recognizeSpeech', {lang: lang});
  callback(result);
};
// add block webSpeech to the interpreter's API.
asyncApiFunctions.push(['speechToText', speechToText]);

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
const textToSpeech = async function (text, lang, callback) {
  // eslint-disable-next-line no-undef
  const options = {
    text: text,
    lang: lang,
    pitch: 1,
    rate: 1,
    volume: 1,
  };

  const thing = new SpeechApiService();
  await thing.invokeAction('synthesizeText', options);
  callback();
};
// add textToSpeech function to the interpreter's API.
asyncApiFunctions.push(['textToSpeech', textToSpeech]);
