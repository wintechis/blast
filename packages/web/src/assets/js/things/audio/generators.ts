/**
 * @fileoverview Generates JavaScript for the audio blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the things_audioOutput block.
 */
JavaScript['things_audioOutput'] = function (block: Block): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the play_audio block.
 */
JavaScript['audioOutput_playFileFromUrl'] = function (block: Block): string {
  const uri = JavaScript.valueToCode(block, 'URI', JavaScript.ORDER_NONE);
  const deviceId =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('default');

  const playAudio = JavaScript.provideFunction_('audioOutput_playFileFromUrl', [
    'async function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(deviceId, uri) {',
    '  return new Promise((resolve, reject) => {',
    '    const audio = new Audio(uri);',
    '    // set audio output device',
    '    audio.setSinkId(deviceId).catch(error => {',
    '      console.error(error);',
    '      reject(error);',
    '    });',
    "    audio.preload = 'auto';",
    '    audio.autoplay = true;',
    '    audio.onerror = error => {',
    '      console.error(',
    '       `Error trying to play audio from \\n${uri}\\n See console for details`',
    '     );',
    '     reject(error);',
    '    };',
    '    audio.onended = resolve;',
    '  });',
    '}',
  ]);

  const code = `await ${playAudio}(${deviceId}, ${uri});\n`;
  return code;
};
