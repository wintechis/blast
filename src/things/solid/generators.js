/**
 * @fileoverview Javascript generators for solid Blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {asyncApiFunctions} from './../../blast_interpreter.js';
import {saveFileInContainer} from '@inrupt/solid-client';
import {throwError} from './../../blast_interpreter.js';

/**
 * Generates Javascript code for the upload_image block.
 * @param {Blockly.Block} block the upload_image block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['upload_image'] = function(block) {
  const image = Blockly.JavaScript.valueToCode(
      block,
      'image',
      Blockly.JavaScript.ORDER_NONE,
  );
  const url = Blockly.JavaScript.valueToCode(
      block,
      'url',
      Blockly.JavaScript.ORDER_NONE,
  );

  const code = `uploadImage(${image}, ${url});\n`;
  return code;
};

/**
 * Uploads an image to a solid container.
 * @param {string} image base64 encoded image.
 * @param {string} url the url of the solid container.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const uploadImage = async function(image, url, callback) {
  const file = new File([image], 'image.png', {type: 'image/png'});
  try {
    await saveFileInContainer(url, file);
  } catch (e) {
    throwError(e);
    console.error(e);
  }
  callback();
};

// Add uploadImage method to the interpreter's API.
asyncApiFunctions.push(['uploadImage', uploadImage]);
