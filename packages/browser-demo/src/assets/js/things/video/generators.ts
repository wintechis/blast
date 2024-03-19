/**
 * @fileoverview Generates JavaScript code for the video blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the things_videoInput block.
 */
JavaScript.forBlock['things_videoInput'] = function (block: Block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the videoInput_getFrame block.
 */
JavaScript.forBlock['videoInput_getFrame'] = function (block: Block) {
  const deviceId = JavaScript.valueToCode(
    block,
    'thing',
    JavaScript.ORDER_NONE
  );

  JavaScript.provideFunction_('videoInput_getFrame', [
    'async function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(deviceId) {',
    '  // Create video element.',
    '  const videoElem = document.createElement("video");',
    '  videoElem.id = "video";',
    '  videoElem.setAttribute("autoplay", "autoplay");',
    '  videoElem.setAttribute("muted", true);',
    '  videoElem.style.display = "none";',
    '  document.body.appendChild(videoElem);',
    '  // Select video input device with deviceId.',
    '  const constraints = {',
    '    video: {',
    '      deviceId: deviceId,',
    '    },',
    '  };',
    '  // Get stream from video input device.',
    '  const stream = await navigator.mediaDevices.getUserMedia(constraints);',
    '',
    '  videoElem.srcObject = stream;',
    '  // create canvas to draw video on',
    '  const canvas = document.createElement("canvas");',
    '  const context = canvas.getContext("2d");',
    '  // wait for video to start',
    '  await new Promise((resolve, reject) => {',
    '    videoElem.onloadedmetadata = () => {',
    '     canvas.width = videoElem.videoWidth;',
    '     canvas.height = videoElem.videoHeight;',
    '     context.drawImage(videoElem, 0, 0, canvas.width, canvas.height);',
    '     resolve();',
    '    };',
    '    videoElem.onerror = error => {',
    '      console.error(error);',
    '      reject(error);',
    '    };',
    '  });',
    '  const data = canvas.toDataURL("image/png");',
    '  // stop video stream',
    '  stream.getTracks().forEach(track => track.stop());',
    '  // remove canvas and video element',
    '  videoElem.remove();',
    '  canvas.remove();',
    '  return data;',
    '}',
  ]);

  const code = `await videoInput_getFrame(${deviceId})`;
  return [code, JavaScript.ORDER_NONE];
};
