/**
 * @fileoverview Generates JavaScript for the audio blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
import {throwError} from '../../interpreter.js';

const {JavaScript} = Blockly;

/**
 * Generates JavaScript code for the things_audioOutput block.
 * @param {Blockly.Block} block the things_audioOutput block.
 * @returns {String} the generated code.
 */
JavaScript['things_audioOutput'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the play_audio block.
 * @param {Blockly.Block} block the play_audio block.
 * @returns {String} the generated code.
 */
JavaScript['audioOutput_playFileFromUrl'] = function (block) {
  const uri = JavaScript.valueToCode(block, 'URI', JavaScript.ORDER_NONE);
  const deviceId =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('default');

  const code = `await audioOutput_playFileFromUrl(${deviceId}, ${uri});\n`;
  return code;
};

/**
 * Plays an audio file provided by URI.
 * @param {MediaDeviceInfo.deviceId} deviceId the desired audio output device.
 * @param {string} uri URI of the audio file to play.
 * @returns {Promise<void>}.
 */
globalThis['audioOutput_playFileFromUrl'] = async function (deviceId, uri) {
  await new Promise((resolve, reject) => {
    const audio = new Audio(uri);
    // set audio output device
    audio.setSinkId(deviceId).catch(error => {
      throwError(error);
    });
    audio.preload = 'auto';
    audio.autoplay = true;
    audio.onerror = error => {
      throwError(
        `Error trying to play audio from \n${uri}\n See console for details`
      );
      console.error(error);
      reject(error);
    };
    audio.onended = resolve;
  });
};
