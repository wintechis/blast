/**
 * @fileoverview Javascript generators for BLAST's properties, actions and events Blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {throwError} from './../../blast_interpreter.js';

const {JavaScript} = Blockly;

/**
 * Generates JavaScript code for the play_audio block.
 * @param {Blockly.Block} block the play_audio block.
 * @returns {String} the generated code.
 */
JavaScript['play_audio'] = function (block) {
  const uri = JavaScript.valueToCode(block, 'URI', JavaScript.ORDER_NONE);
  const code = `await playAudio(${uri});\n`;
  return code;
};

/**
 * Plays an audio file provided by URI.
 * @param {string} uri URI of the audio file to play.
 * @public
 */
globalThis['playAudio'] = async function (uri) {
  await new Promise((resolve, reject) => {
    const audio = new Audio(uri);
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

/**
 * Generates JavaScript code for the capture_image block.
 * @param {Blockly.Block} block the play_audio block.
 * @returns {String} the generated code.
 */
// eslint-disable-next-line no-unused-vars
JavaScript['capture_image'] = function (block) {
  const code = 'await captureImage()';
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Captures a snapshot from camera and returns it as a base64 encoded string.
 * @returns {string} base64 encoded string of the image.
 */
globalThis['captureImage'] = async function () {
  // Create video element.
  const videoElem = document.createElement('video');
  videoElem.id = 'video';
  videoElem.setAttribute('autoplay', 'autoplay');
  videoElem.setAttribute('muted', true);
  videoElem.style.display = 'none';
  document.body.appendChild(videoElem);
  // Request access to the camera.
  const constraints = {
    video: true,
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  videoElem.srcObject = stream;
  // draw stream to canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  // wait for video to load
  await new Promise((resolve, reject) => {
    videoElem.onloadedmetadata = () => {
      canvas.width = videoElem.videoWidth;
      canvas.height = videoElem.videoHeight;
      context.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
      resolve();
    };
    videoElem.onerror = error => {
      throwError(
        'Error trying to capture image from camera. See console for details'
      );
      console.error(error);
      reject(error);
    };
  });
  const data = canvas.toDataURL('image/png');

  // remove canvas and video element
  videoElem.srcObject.getTracks().forEach(track => track.stop());
  videoElem.remove();
  canvas.remove();

  return data;
};
