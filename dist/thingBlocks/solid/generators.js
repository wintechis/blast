/**
 * @fileoverview Javascript generators for solid Blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';
import Blockly from 'blockly';
import { saveFileInContainer } from '@inrupt/solid-client';
import { asyncApiFunctions } from './../../blast_interpreter.js';
import { throwError } from './../../blast_interpreter.js';
/**
 * Generates Javascript code for the upload_image block.
 * @param {Blockly.Block} block the upload_image block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['upload_image'] = function (block) {
    const image = Blockly.JavaScript.valueToCode(block, 'image', Blockly.JavaScript.ORDER_NONE);
    const url = Blockly.JavaScript.valueToCode(block, 'url', Blockly.JavaScript.ORDER_NONE);
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
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (image.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(image.split(',')[1]);
    }
    else {
        byteString = unescape(dataURI.split(',')[1]);
    }
    // seperate out the mime component
    const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ia], { type: mimeString });
    try {
        await saveFileInContainer(url, blob);
    }
    catch (e) {
        throwError(e);
        console.error(e);
    }
    callback();
};
// Add uploadImage method to the interpreter's API.
asyncApiFunctions.push(['uploadImage', uploadImage]);
//# sourceMappingURL=generators.js.map