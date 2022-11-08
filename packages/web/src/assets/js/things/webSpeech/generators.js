/**
 * @fileoverview Block generators for the the WebSpeech API, see
 * (https://wicg.github.io/speech-api/).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';

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

  const code = `await textToSpeech(${text}, ${lang});\n`;

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
  const code = `await speechToText(${lang})`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Outputs speech input as string.
 * @param {Blockly.Block.id} blockId id of the speechToText block.
 */
globalThis['speechToText'] = async function (lang) {
  return new Promise(resolve => {
    // eslint-disable-next-line no-undef
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = lang;
    let finalTranscript = '';

    recognition.onresult = function (event) {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onend = function () {
      resolve(finalTranscript);
    };

    recognition.start();
  });
};

/**
 * Invokes a SpeechSynthesisUtterance to read out a text.
 * @param {string} text text that will be synthesised when the utterance is spoken.
 * @param {string} lang language of the utterance.
 * TODO #53 Add the following parameters (#53)
 * @param {SpeechSynthesisVoice=} voice voice that will be used to speak the utterance.
 * @param {Number=} rate speed at which the utterance will be spoken at
 * @param {Number=} volume volume that the utterance will be spoken at.
 * @param {Number=} pitch pitch at which the utterance will be spoken at
 */
globalThis['textToSpeech'] = async function (text, lang) {
  // eslint-disable-next-line no-undef
  const speech = new SpeechSynthesisUtterance();
  speech.text = text;
  speech.lang = lang;
  window.speechSynthesis.speak(speech);
  // return after speaking has ended
  await new Promise(resolve => {
    speech.onend = resolve;
  });
};
