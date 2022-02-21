/**
 * @fileoverview Javascript generators for BLAST's properties, actions and events Blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import urdf from 'urdf';
import {apiFunctions} from './../../blast_interpreter.js';
import {asyncApiFunctions} from './../../blast_interpreter.js';
import {getInterpreter} from './../../blast_interpreter.js';
import {getStdOut} from './../../blast_interpreter.js';
import {throwError} from './../../blast_interpreter.js';


/*****************
 * Action blocks.*
 *****************/
 
/**
 * Generates JavaScript code for the http_request block.
 * @param {Blockly.Block} block the http_request block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['http_request'] = function(block) {
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'uri',
      Blockly.JavaScript.ORDER_NONE,
  ) || null;
  const method = block.getFieldValue('METHOD');
  const headers = Blockly.JavaScript.valueToCode(
      block,
      'header',
      Blockly.JavaScript.ORDER_NONE,
  );
  const output = block.getFieldValue('OUTPUT');
  const body = Blockly.JavaScript.valueToCode(
      block,
      'body',
      Blockly.JavaScript.ORDER_NONE,
  );
    
  const code = `sendHttpRequest(${uri},'${method}', 
      '{${headers}}', ${body}, '${output}')\n`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Sends a HTTP request to URI returning the status or the response
 * depending on the output parameter.
 * @param {string} uri URI to request.
 * @param {string} method HTTP request method.
 * @param {string} headersString JSON string containing headers.
 * @param {string=} body JSON string containing body, optional.
 * Not needed when method is GET.
 * @param {string} output Output can be status or response.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @returns {string} the response status code or body, depending on output parameter.
 * @private
 */
const sendHttpRequest = async function(
    uri, method, headersString, body, output, callback) {
  if (uri == null || uri == undefined || uri == '') {
    throwError('URI input of HttpRequest blocks must not be empty');
  }

  const headersJSON = JSON.parse(headersString);
  const requestOptions = {
    method: method,
    headers: new Headers(headersJSON),
  };

  if (method !== 'GET' && body) {
    requestOptions.body = body;
  }

  try {
    const res = await fetch(uri, requestOptions);

    if (!res.ok) {
      throwError(`Failed to get ${uri}, Error: ${res.status} ${res.statusText}`);
      return;
    }

    if (output == 'status') {
      callback(res.status);
      return;
    }

    const response = await res.text();
    callback(response);
  } catch (error) {
    throwError(`Failed to get ${uri}, Error: ${error.message}`);
  }
};
// add sendHTTPRequest method to the interpreter's API.
asyncApiFunctions.push(['sendHttpRequest', sendHttpRequest]);

/**
 * Generates JavaScript code for the sparql_query block.
 * @param {Blockly.Block} block the sparql_query block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['sparql_query'] = function(block) {
  let query = block.getFieldValue('query');
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'uri',
      Blockly.JavaScript.ORDER_NONE,
  );
  const format = Blockly.JavaScript.quote_(block.getFieldValue('format')) || '';
    
  // escape " quotes and replace linebreaks (\n) with \ in query
  query = query.replace(/"/g, '\\"').replace(/[\n\r]/g, ' ');
    
  const code = `urdfQueryWrapper(${uri}, ${format}, '${query}')`;
    
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the sparql_ask block.
 * @param {Blockly.Block} block the sparql_ask block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['sparql_ask'] = function(block) {
  let query = block.getFieldValue('query');
  const format = Blockly.JavaScript.quote_(block.getFieldValue('format')) || '';
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'uri',
      Blockly.JavaScript.ORDER_NONE,
  );
    
  // escape " quotes and replace linebreaks (\n) with \ in query
  query = query.replace(/"/g, '\\"').replace(/[\n\r]/g, ' ');
    
  const code = `urdfQueryWrapper(${uri}, ${format}, '${query}')`;
    
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Wrapper for urdf's query function.
 * @param {String} uri URI to query.
 * @param {String} format format of the resource to query
 * @param {String} query Query to execute.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const urdfQueryWrapper = async function(uri, format, query, callback) {
  let res;
  
  try {
    res = await fetch(uri);
      
    if (!res.ok) {
      throwError(`Failed to get ${uri}, Error: ${res.status} ${res.statusText}`);
      return;
    }

    const response = await res.text();

    urdf.clear();
    const opts = {format: format};
    await urdf.load(response, opts);
    res = await urdf.query(query);
  } catch (error) {
    throwError(`Failed to get ${uri}, Error: ${error.message}`);
  }

  // if result is a boolean, return it.
  if (typeof res === 'boolean') {
    callback(res);
    return;
  }

  // Convert result from array of objects to array of arrays.
  const resultArray = new Array(res.length);
  for (const obj of res) {
    const resultArrayRow = new Array(Object.keys(obj).length);
    for (const value of Object.values(obj)) {
      resultArrayRow.push(value.value);
    }
    resultArray.push(resultArrayRow);
  }

  const interpreterObj = getInterpreter().nativeToPseudo(resultArray);

  callback(interpreterObj);
};
// add urdfQueryWrapper method to the interpreter's API.
asyncApiFunctions.push(['urdfQueryWrapper', urdfQueryWrapper]);

/**
 * Generates JavaScript code for the display_text block.
 * @param {Blockly.Block} block the display_text block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['display_text'] = function(block) {
  const message =
        Blockly.JavaScript.valueToCode(
            block,
            'text',
            Blockly.JavaScript.ORDER_NONE,
        ) || '\'\'';
    
  const code = `displayText(${message});\n`;
  return code;
};

/**
 * Add a text message to the {@link Blast.Ui.messageOutputContainer}.
 * @param {string} text text message to output.
 * @public
 */
const displayText = function(text) {
  const stdOut = getStdOut();
  stdOut(text);
};
// Add displayText method to the interpreter's API.
apiFunctions.push(['displayText', displayText]);
    
/**
 * Generates JavaScript code for the play_audio block.
 * @param {Blockly.Block} block the play_audio block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['play_audio'] = function(block) {
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'URI',
      Blockly.JavaScript.ORDER_NONE,
  );
  const code = `playAudio(${uri});\n`;
  return code;
};

/**
 * Plays an audio file provided by URI.
 * @param {string} uri URI of the audio file to play.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const playAudio = async function(uri, callback) {
  await new Promise((resolve, reject) => {
    const audio = new Audio(uri);
    audio.preload = 'auto';
    audio.autoplay = true;
    audio.onerror = ((error) => {
      throwError(
          `Error trying to play audio from \n${uri}\n See console for details`);
      console.error(error);
      reject(error);
    });
    audio.onended = resolve;
  });
  callback();
};
// add playAudio method to the interpreter's API.
asyncApiFunctions.push(['playAudio', playAudio]);

/**
 * Generates JavaScript code for the capture_image block.
 * @param {Blockly.Block} block the play_audio block.
 * @returns {String} the generated code.
 */
// eslint-disable-next-line no-unused-vars
Blockly.JavaScript['capture_image'] = function(block) {
  const code = 'captureImage()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Captures a snapshot from camera and returns it as a base64 encoded string.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const captureImage = async function(callback) {
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
    videoElem.onerror = ((error) => {
      throwError('Error trying to capture image from camera. See console for details');
      console.error(error);
      reject(error);
    });
  });
  const data = canvas.toDataURL('image/png');

  // remove canvas and video element
  videoElem.srcObject.getTracks().forEach((track) => track.stop());
  videoElem.remove();
  canvas.remove();

  callback(data);
};

// add capture_image method to the interpreter's API.
asyncApiFunctions.push(['captureImage', captureImage]);
