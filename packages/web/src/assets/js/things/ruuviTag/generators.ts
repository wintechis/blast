/**
 * @fileoverview JavaScript code generators for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the things_ruuviTag block.
 */
JavaScript.forBlock['things_ruuviTag'] = function (block: Block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.browser.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.cjs');";

  JavaScript.priority_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.priority_['RuuviTag'] = 'const {RuuviTag} = blastTds;';
  JavaScript.things_[
    'things' + name
  ] = `things.set(${name}, await createThing(RuuviTag, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the ruuviTag_event block.
 */
JavaScript.forBlock['ruuviTag_event'] = function (block: Block) {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.statementToCode(block, 'statements');
  const tempVarName = block.getFieldValue('temperature');
  const humidityVarName = block.getFieldValue('humidity');
  const pressureVarName = block.getFieldValue('pressure');
  const accelerationXVarName = block.getFieldValue('accelerationX');
  const accelerationYVarName = block.getFieldValue('accelerationY');
  const accelerationZVarName = block.getFieldValue('accelerationZ');
  const batteryVarName = block.getFieldValue('batteryVoltage');
  const txPowerVarName = block.getFieldValue('txPower');
  const movementCounterVarName = block.getFieldValue('movementCounter');
  const measurementSequenceNumberVarName = block.getFieldValue(
    'measurementSequenceNumber'
  );

  const eventHandler = JavaScript.provideFunction_('ruuviTagHandler', [
    'async function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(interactionOutput) {',
    '  const responseArr = await interactionOutput.value();',
    `  ${tempVarName} = responseArr[1];`,
    `  ${humidityVarName} = responseArr[2];`,
    `  ${pressureVarName} = responseArr[3];`,
    `  ${accelerationXVarName} = responseArr[4];`,
    `  ${accelerationYVarName} = responseArr[5];`,
    `  ${accelerationZVarName} = responseArr[6];`,
    `  ${batteryVarName} = responseArr[7];`,
    `  ${txPowerVarName} = responseArr[7];`,
    `  ${movementCounterVarName} = responseArr[8];`,
    `  ${measurementSequenceNumberVarName} = responseArr[9];`,
    `  ${statements.replace(/`/g, '\\`')}`,
    '}',
  ]);

  const handler = `await things.get(${thing}).subscribeEvent('UART data', ${eventHandler});\n`;
  JavaScript.handlers['things' + block.id] = handler;

  return '';
};
