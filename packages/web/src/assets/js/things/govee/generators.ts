/**
 * @fileoverview Generates JavaScript for the Govee LED bulb
 * (https://www.govee.com/products/govee-led-light-bulb).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the things_govee block.
 */
JavaScript.forBlock['things_govee'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.browser.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.priority_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.priority_['GoveeLedBulb'] = 'const {GoveeLedBulb} = blastTds;';
  JavaScript.things_['things' + name] =
    `things.set(${name}, await createThing(GoveeLedBulb, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the govee_set_power block.
 */
JavaScript.forBlock['govee_set_power'] = function (block: Block): string {
  const power =
    JavaScript.valueToCode(block, 'power', JavaScript.ORDER_NONE) || 'false';
  const name = JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE);

  const generateChecksum = JavaScript.provideFunction_('generateChecksum', [
    'const generateChecksum = (data) => {',
    '  let sum = 0;',
    '  for (const byte of data) {',
    '    sum = sum ^ byte;',
    '  }',
    '  return sum;',
    '};',
  ]);

  const code = `
await things.get(${name})
  .writeProperty('power', {power: ${power}, checksum: ${generateChecksum}([0x33, 0x01, ${power}])});\n`;
  return code;
};

/**
 * Generates JavaScript code for the govee_set_colour block.
 */
JavaScript.forBlock['govee_set_colour'] = function (block: Block): string {
  const colour =
    JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('#000000');
  // Colour is a hex string in quotes, e.g. '#ff0000', convert to rgb.
  const r = parseInt(colour.slice(2, 4), 16);
  const g = parseInt(colour.slice(4, 6), 16);
  const b = parseInt(colour.slice(6, 8), 16);

  const name = JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE);

  const generateChecksum = JavaScript.provideFunction_('generateChecksum', [
    'const generateChecksum = (data) => {',
    '  let sum = 0;',
    '  for (const byte of data) {',
    '    sum = sum ^ byte;',
    '  }',
    '  return sum;',
    '};',
  ]);

  const code = `
await things.get(${name})
  .writeProperty('colour', {
    red: ${r}, green: ${g}, blue: ${b}, checksum: ${generateChecksum}([0x33, 0x05, 0x02, ${r}, ${g}, ${b}])
  });\n`;
  return code;
};

/**
 * Generates JavaScript code for the govee_set_brightness block.
 */
JavaScript.forBlock['govee_set_brightness'] = function (block: Block): string {
  const brightness =
    JavaScript.valueToCode(block, 'brightness', JavaScript.ORDER_NONE) || '100';
  const name = JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE);

  const generateChecksum = JavaScript.provideFunction_('generateChecksum', [
    'const generateChecksum = (data) => {',
    '  let sum = 0;',
    '  for (const byte of data) {',
    '    sum = sum ^ byte;',
    '  }',
    '  return sum;',
    '};',
  ]);

  const code = `
await things.get(${name})
  .writeProperty('brightness', {
    brightness: ${brightness}, checksum: ${generateChecksum}([0x33, 0x04, ${brightness}])
  });\n`;
  return code;
};

const generateChecksum = (data: number[]): number => {
  let sum = 0;
  for (const byte of data) {
    sum = sum ^ byte;
  }
  return sum;
};
