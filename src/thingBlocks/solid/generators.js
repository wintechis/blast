/**
 * @fileoverview Javascript generators for solid Blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

// eslint-disable-next-line node/no-missing-import
import SolidService from '../../things/solid/SolidService.js';
import {JavaScript} from 'blockly';
import {asyncApiFunctions} from './../../blast_interpreter.js';

/**
 * Generates Javascript code for the upload_image block.
 * @param {Blockly.Block} block the upload_image block.
 * @returns {String} the generated code.
 */
JavaScript['upload_image'] = function (block) {
  const image = JavaScript.valueToCode(block, 'image', JavaScript.ORDER_NONE);
  const url = JavaScript.valueToCode(block, 'url', JavaScript.ORDER_NONE);

  const code = `uploadImage(${image}, ${url});\n`;
  return code;
};

/**
 * Uploads an image to a solid container.
 * @param {string} image the image to upload as data URI.
 * @param {string} url the url of the solid container.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const uploadImage = async function (image, url, callback) {
  const service = new SolidService();
  await service.invokeAction('uploadImage', {image, url});
  callback();
};

// Add uploadImage method to the interpreter's API.
asyncApiFunctions.push(['uploadImage', uploadImage]);
