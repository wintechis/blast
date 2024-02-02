/**
 * @fileoverview JavaScript code generators for the Xiaomi Mijia thermometer.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the things_xiaomiThermometer block.
 */
JavaScript.forBlock['things_xiaomiThermometer'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.browser.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.priority_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.priority_['XiaomiThermometer'] =
    'const {XiaomiThermometer} = blastTds;';
  JavaScript.things_[
    'things' + name
  ] = `things.set(${name}, await createThing(XiaomiThermometer, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the get_mijia_property block.
 */
JavaScript.forBlock['xiaomiThermometer_event'] = function (
  block: Block
): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.statementToCode(block, 'statements');
  const tempVarName = block.getFieldValue('temperature');
  const humidityVarName = block.getFieldValue('humidity');

  const eventHandler = JavaScript.provideFunction_(
    'xiaomiThermometerHandler' + block.id,
    [
      'async function ' +
        JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        '(interactionOutput) {',
      '  const responseArr = await interactionOutput.value();',
      `  ${tempVarName} = responseArr[0];`,
      `  ${humidityVarName} = responseArr[1];`,
      `  ${statements.replace(/`/g, '\\`')}`,
      '}',
    ]
  );

  const handler = `await things.get(${thing}).subscribeEvent('measurements', ${eventHandler});`;
  JavaScript.handlers['things' + block.id] = handler;

  return '';
};
