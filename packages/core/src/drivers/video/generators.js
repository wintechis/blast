/**
 * @fileoverview Generates JavaScript code for the video blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
import {throwError} from '../../blast_interpreter.js';

const {JavaScript} = Blockly;

/**
 * Generates JavaScript code for the things_videoInput block.
 * @param {Blockly.Block} block the things_videoInput block.
 * @returns {String} the generated code.
 */
JavaScript['things_videoInput'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the things_videoInput block.
 * @param {Blockly.Block} block the things_videoInput block.
 * @returns {String} the generated code.
 */
JavaScript['things_videoInput'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the videoInput_getFrame block.
 * @param {Blockly.Block} block the videoInput_getFrame block.
 * @returns {String} the generated code.
 */
JavaScript['videoInput_getFrame'] = function (block) {
  const deviceId = JavaScript.valueToCode(
    block,
    'thing',
    JavaScript.ORDER_NONE
  );
  const code = `await videoInput_getFrame(${deviceId})`;
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Gets a frame from a video input device.
 * @param {MediaDeviceInfo.deviceId} deviceId the desired video input device.
 * @returns {Promise<Image>} the captured image.
 */
globalThis['videoInput_getFrame'] = async function (deviceId) {
  // Create video element.
  const videoElem = document.createElement('video');
  videoElem.id = 'video';
  videoElem.setAttribute('autoplay', 'autoplay');
  videoElem.setAttribute('muted', true);
  videoElem.style.display = 'none';
  document.body.appendChild(videoElem);
  // Select video input device with deviceId.
  const constraints = {
    video: {
      deviceId: deviceId,
    },
  };
  // Get stream from video input device.
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
