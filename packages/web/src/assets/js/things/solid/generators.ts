/**
 * @fileoverview Javascript generators for solid Blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {saveFileInContainer} from '@inrupt/solid-client';

/**
 * Generates Javascript code for the solid_upload_image block.
 * @param {Blockly.Block} block the solid_upload_image block.
 * @returns {String} the generated code.
 */
JavaScript.forBlock['solid_upload_image'] = function (block: Block): string {
  const image = JavaScript.valueToCode(block, 'image', JavaScript.ORDER_NONE);
  const url = JavaScript.valueToCode(block, 'url', JavaScript.ORDER_NONE);

  const code = `solid_uploadImage(${image}, ${url});\n`;
  return code;
};

/**
 * Uploads an image to a solid container.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any)['solid_uploadImage'] = async function (
  image: string,
  url: string
) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  // eslint-disable-next-line no-undef
  const byteString = atob(image.split(',')[1]);

  // seperate out the mime component
  const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  // eslint-disable-next-line no-undef
  const blob = new Blob([ia], {type: mimeString});

  try {
    await saveFileInContainer(url, blob);
  } catch (e) {
    console.error(e);
  }
};
