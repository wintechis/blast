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
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.priority_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.priority_['RuuviTag'] = 'const {RuuviTag} = blastTds;';
  JavaScript.things_['things' + name] =
    `things.set(${name}, await createThing(RuuviTag, ${id}));`;

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

  const eventHandler = JavaScript.provideFunction_(
    'ruuviTagHandler' + block.id,
    [
      'async function ' +
        JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        '(interactionOutput) {',
      '  const responseObj = await interactionOutput.value();',
      `  ${tempVarName} = responseObj['temp'];`,
      `  ${humidityVarName} = responseObj['humidity'];`,
      `  ${pressureVarName} = responseObj['pressure'];`,
      `  ${accelerationXVarName} = responseObj['acc-x'];`,
      `  ${accelerationYVarName} = responseObj['acc-y'];`,
      `  ${accelerationZVarName} = responseObj['acc-z'];`,
      `  ${batteryVarName} = responseObj['power-info'];`,
      `  ${txPowerVarName} = responseObj['power-info'];`,
      `  ${movementCounterVarName} = responseObj['movement-counter'];`,
      `  ${measurementSequenceNumberVarName} = responseObj['measurement-sequence-number'];`,
      `  ${statements.replace(/`/g, '\\`')}`,
      '}',
    ]
  );

  const handler = `await things.get(${thing}).subscribeEvent('UART data', ${eventHandler});\n`;
  JavaScript.handlers['things' + block.id] = handler;

  return '';
};
