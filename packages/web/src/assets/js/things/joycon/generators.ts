/**
 * @fileoverview Code generators for the joycon blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import * as WoT from 'wot-typescript-definitions';
import {addCleanUpFunction} from '../../interpreter';
import SwitchPro from './switchPro/SwitchPro.js';
import JoyCon from './switchPro/JoyCon';

JavaScript.forBlock['things_joycon'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.web.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.definitions_['createThingWithHandlers'] =
    'const {createThingWithHandlers} = blastCore;';
  JavaScript.definitions_['JoyCon'] = 'const {JoyCon} = blastTds;';
  JavaScript.definitions_['things'] = 'const things = new Map();';
  JavaScript.definitions_[
    'things' + name
  ] = `things.set(${name}, await createThingWithHandlers(JoyCon, ${id}, addJoyConHandlers));`;

  return [name, JavaScript.ORDER_NONE];
};

type Joystick = {
  x: number;
  y: number;
  angle: number;
};

/**
 * Generates JavaScript code for the joycon_read_property block.
 */
JavaScript.forBlock['joycon_read_property'] = function (
  block: Block
): [string, number] {
  const property = JavaScript.quote_(block.getFieldValue('property'));
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const code = `await (await things.get(${thing}).readProperty(${property})).value()`;
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the joycon_button_events block.
 */
JavaScript.forBlock['joycon_button_events'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.statementToCode(block, 'statements');
  const button = JavaScript.quote_(block.getFieldValue('button'));

  const eventHandler = JavaScript.provideFunction_('joycon_buttonHandler', [
    'async function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(interactionOutput) {',
    '  const pressed = await interactionOutput.value();',
    `  if (pressed[${button}]) {`,
    `${statements.replace(/`/g, '\\`')}`,
    '  }',
    '}',
  ]);
  const handler = `await things.get(${thing}).subscribeEvent('button', ${eventHandler});`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Adds WoT event handlers to the JoyCon's ExposedThing instance.
 */
(globalThis as any)['addJoyConHandlers'] = function (
  exposedThing: WoT.ExposedThing
) {
  const joyCon = new JoyCon();
  (joyCon as any).interval = setInterval(joyCon.pollGamepads.bind(joyCon), 200);

  const handleButton = function (pressed: string[]) {
    exposedThing.emitEvent('button', pressed);
  };

  joyCon.addListener(handleButton);

  addCleanUpFunction(() => {
    if ((joyCon as any).interval) {
      clearInterval((joyCon as any).interval);
    }
  });

  exposedThing.setPropertyReadHandler('accelerometers', async () => {
    return 'eest';
  });
};

JavaScript.forBlock['things_gamepad_pro'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.web.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.definitions_['createThingWithHandlers'] =
    'const {createThingWithHandlers} = blastCore;';
  JavaScript.definitions_['GamepadPro'] = 'const {GamepadPro} = blastTds;';
  JavaScript.definitions_['things'] = 'const things = new Map();';
  JavaScript.definitions_[
    'things' + name
  ] = `things.set(${name}, await createThingWithHandlers(GamepadPro, ${id}, addGamepadHandlers));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the gamepad_pro_joystick block.
 */
JavaScript.forBlock['gamepad_pro_joystick'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.statementToCode(block, 'statements');
  const xName = block.getFieldValue('gp-xName');
  const yName = block.getFieldValue('gp-yName');
  const angleName = block.getFieldValue('gp-angleName');

  const eventHandler = JavaScript.provideFunction_('gamepad_joystickHandler', [
    'async function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(interactionOutput) {',
    '  const joystick = await interactionOutput.value();',
    `  ${xName} = joystick['x'] || 0;`,
    `  ${yName} = joystick['y'] || 0;`,
    `  ${angleName} = joystick['angle'] || 0;`,
    `${statements.replace(/`/g, '\\`')}`,
    '}',
  ]);

  const handler = `await things.get(${thing}).subscribeEvent('joystick', ${eventHandler});`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Generates JavaScript code for the gamepad_pro_button block.
 */
JavaScript.forBlock['gamepad_pro_button'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.statementToCode(block, 'statements');
  const button = JavaScript.quote_(block.getFieldValue('button'));

  const eventHandler = JavaScript.provideFunction_('gamepad_buttonHandler', [
    'async function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(interactionOutput) {',
    '  const pressed = await interactionOutput.value();',
    `  if (pressed[${button}]) {`,
    `${statements.replace(/`/g, '\\`')}`,
    '  }',
    '}',
  ]);

  const handler = `await things.get(${thing}).subscribeEvent('button', ${eventHandler});`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Adds WoT event handlers to the gamepad's ExposedThing instance.
 */
(globalThis as any)['addGamepadHandlers'] = function (
  gamepad: WoT.ExposedThing
) {
  const switchPro = new SwitchPro();
  (switchPro as any).interval = setInterval(
    switchPro.pollGamepads.bind(switchPro),
    200
  );

  const handleJoystick = function (joystick: Joystick) {
    gamepad.emitEvent('joystick', joystick);
  };

  const handleButton = function (pressed: string[]) {
    gamepad.emitEvent('button', pressed);
  };

  switchPro.addListener(handleJoystick);
  switchPro.addListener(handleButton);

  addCleanUpFunction(() => {
    if ((switchPro as any).interval) {
      clearInterval((switchPro as any).interval);
    }
  });
};
