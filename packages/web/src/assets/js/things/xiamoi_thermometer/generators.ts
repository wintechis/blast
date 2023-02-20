/**
 * @fileoverview JavaScript code generators for the Xiaomi Mijia thermometer.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the things_xiaomiThermometer block.
 */
JavaScript['things_xiaomiThermometer'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.web.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.definitions_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.definitions_['XiaomiThermometer'] =
    'const {XiaomiThermometer} = blastTds;';
  JavaScript.definitions_['things'] = 'const things = new Map();';
  JavaScript.definitions_[
    'things' + name
  ] = `things.set(${name}, await createThing(XiaomiThermometer, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the get_mijia_property block.
 */
JavaScript['xiaomiThermometer_event'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.statementToCode(block, 'statements');
  const tempVarName = block.getFieldValue('temperature');
  const humidityVarName = block.getFieldValue('humidity');

  const eventHandler = JavaScript.provideFunction_('xiaomiThermometerHandler', [
    'async function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(interactionOutput) {',
    '  const arr = await interactionOutput.arrayBuffer();',
    '  const data = new DataView(arr.buffer)',
    '  if (data) {',
    '    const sign = data.getUint8(1) & (1 << 7);',
    '    let temp = ((data.getUint8(1) & 0x7f) << 8) + data.getUint8(0);',
    '    if (sign) {',
    '      temp = temp - 32767;',
    '    }',
    `    ${tempVarName} = temp / 100;`,
    `    ${humidityVarName} = data.getUint8(2);`,
    `    ${statements.replace(/`/g, '\\`')}`,
    '  }',
    '}',
  ]);

  const handler = `await things.get(${thing}).subscribeEvent('measurements', ${eventHandler});`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};
