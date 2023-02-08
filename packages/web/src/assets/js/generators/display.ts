/**
 * @fileoverview Javascript generators for `display` Blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the display_text block.
 */
JavaScript['display_text'] = function (block: Block): string {
  const message =
    JavaScript.valueToCode(block, 'text', JavaScript.ORDER_NONE) || "''";

  const code = `console.log(${message});\n`;
  return code;
};

/**
 * Generates JavaScript code for the capture_image block.
 */
JavaScript['display_image'] = function (block: Block): string {
  const image = JavaScript.valueToCode(block, 'image', JavaScript.ORDER_NONE);

  const code = `console.log(${image}, 'image');\n`;
  return code;
};

/**
 * Generates JavaScript code for the display_table block.
 */
JavaScript['display_table'] = function (block: Block): string {
  const table = JavaScript.valueToCode(block, 'table', JavaScript.ORDER_NONE);

  const code = `console.log(${table}, 'table');\n`;
  return code;
};
