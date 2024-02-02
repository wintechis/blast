/**
 * @fileoverview Generates JavaScript for the Philips Hue.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the things_hue block.
 */
JavaScript.forBlock['things_hue'] = function (block: Block): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.browser.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.priority_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.priority_['PhilipsHue'] = 'const {PhilipsHue} = blastTds;';
  JavaScript.things_['things' + name] =
    `things.set(${name}, await createThing(PhilipsHue, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the hue_colour block.
 */
JavaScript.forBlock['hue_colour'] = function (block: Block): string {
  const colour =
    JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('#000000');
  // Colour is a hex string in quotes, e.g. '#ff0000', convert to rgb.
  const r = parseInt(colour.slice(2, 4), 16);
  const g = parseInt(colour.slice(4, 6), 16);
  const b = parseInt(colour.slice(6, 8), 16);

  const name = JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE);

  const code = `
await things.get(${name}).writeProperty('colour', {red: ${r}, green: ${g}, blue: ${b}});\n`;
  return code;
};

/**
 * Generates JavaScript code for the hue_power block.
 */
JavaScript.forBlock['hue_power'] = function (block: Block): string {
  const power = JavaScript.valueToCode(block, 'power', JavaScript.ORDER_NONE);
  const name = JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE);

  const code = `
await things.get(${name}).writeProperty('power', ${power});\n`;
  return code;
};

/**
 * Generates JavaScript code for the hue_brightness block.
 */
JavaScript.forBlock['hue_brightness'] = function (block: Block): string {
  const brightness =
    JavaScript.valueToCode(block, 'brightness', JavaScript.ORDER_NONE) || 0;
  if (brightness < 0 || brightness > 254) {
    console.error('Brightness must be between 0 and 254.');
    if (brightness < 0) {
      block.getInput('brightness')?.connection?.disconnect();
    } else {
      block.getInput('brightness')?.connection?.disconnect();
    }
  }
  const name = JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE);

  const code = `
await things.get(${name}).writeProperty('brightness', ${brightness});\n`;
  return code;
};
