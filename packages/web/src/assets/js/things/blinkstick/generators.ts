/**
 * @fileoverview Generates JavaScript for tulogic BlinkStick, see
 * (https://www.blinkstick.com).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the things_blinkstick block.
 */
JavaScript.forBlock['things_blinkstick'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.browser.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.priority_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.priority_['Blinkstick'] = 'const {Blinkstick} = blastTds;';
  JavaScript.things_['things' + name] =
    `things.set(${name}, await createThing(Blinkstick, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the blinkstick_set_colors block.
 * @param block The block to generate code for
 * @returns The generated code
 */
JavaScript.forBlock['blinkstick_set_colors'] = function (block: Block): string {
  const colour =
    JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('#000000');
  const index =
    JavaScript.valueToCode(block, 'index', JavaScript.ORDER_NONE) || '0';
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const r = parseInt(colour.substring(2, 4), 16);
  const g = parseInt(colour.substring(4, 6), 16);
  const b = parseInt(colour.substring(6, 8), 16);

  const code = `await things.get(${thing}).writeProperty('color', [
    ${5},
    ${index},
    ${r},
    ${g},
    ${b}
  ]);\n`;
  return code;
};
