/**
 * @fileoverview Block generators for the the WebSpeech API, see
 * (https://wicg.github.io/speech-api/).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the play_audio block.
 */
JavaScript.forBlock['text_to_speech'] = function (block: Block): string {
  const text =
    JavaScript.valueToCode(block, 'text', JavaScript.ORDER_ATOMIC) ||
    JavaScript.quote_('');
  let lang = block.getFieldValue('language');
  if (lang.length < 4) {
    lang = block.getFieldValue(lang);
  }
  lang = JavaScript.quote_(lang);

  const textToSpeech = JavaScript.provideFunction_('textToSpeech', [
    'async function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(text, lang) {',
    '  const speech = new SpeechSynthesisUtterance();',
    '  speech.text = text;',
    '  speech.lang = lang;',
    '  window.speechSynthesis.speak(speech);',
    '  // return after speech has ended.',
    '  return new Promise(resolve => {',
    '    speech.onend = resolve;',
    '  });',
    '}',
  ]);

  const code = `await ${textToSpeech}(${text}, ${lang});\n`;

  return code;
};

/**
 * Generates Javascript code for the web_speech block.
 * Outputs speech command from microphone as a string.
 */
JavaScript.forBlock['web_speech'] = function (block: Block): [string, number] {
  let lang = block.getFieldValue('language');
  if (lang.length < 4) {
    lang = block.getFieldValue(lang);
  }
  lang = JavaScript.quote_(lang);

  const speechToText = JavaScript.provideFunction_('speechToText', [
    'async function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(lang) {',
    '  return new Promise(resolve => {',
    '  const recognition = new webkitSpeechRecognition();',
    '  recognition.continuous = false;',
    '  recognition.lang = lang;',
    '  let finalTranscript = "";',
    '',
    '  recognition.onresult = function(event) {',
    '    for (let i = event.resultIndex; i < event.results.length; ++i) {',
    '      if (event.results[i].isFinal) {',
    '        finalTranscript += event.results[i][0].transcript;',
    '      }',
    '    }',
    '  };',
    '',
    '  recognition.onend = function() {',
    '    resolve(finalTranscript);',
    '  };',
    '',
    '  recognition.start();',
    '  });',
    '}',
  ]);

  const code = `await ${speechToText}(${lang})`;

  return [code, JavaScript.ORDER_NONE];
};
