/**
 * @fileoverview Generates JavaScript for the BLE RGB LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the things_bleLedController block.
 */
JavaScript.forBlock['things_bleLedController'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.browser.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.priority_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.priority_['BleRgbController'] =
    'const {BleRgbController} = blastTds;';
  JavaScript.things_['things' + name] =
    `things.set(${name}, await createThing(BleRgbController, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the bleLedController_switch_lights block.
 */
JavaScript.forBlock['bleLedController_switch_lights'] = function (
  block: Block
): string {
  const colour =
    JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('#000000');
  // Colour is a hex string in quotes, e.g. '#ff0000', convert to rgb.
  const r = parseInt(colour.slice(2, 4), 16);
  const g = parseInt(colour.slice(4, 6), 16);
  const b = parseInt(colour.slice(6, 8), 16);

  const name = JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE);

  const code = `
await things.get(${name}).writeProperty('colour', {R: ${r}, G: ${g}, B: ${b}});\n`;
  return code;
};
