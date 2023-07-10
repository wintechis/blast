/**
 * @fileoverview Code generators for the joycon blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import * as WoT from 'wot-typescript-definitions';
import {addCleanUpFunction, getWorkspace} from '../../interpreter';
import SwitchPro from './switchPro/SwitchPro.js';

JavaScript.forBlock['things_joycon'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
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
  const sub = JavaScript.quote_(block.getFieldValue('propertySubValue') || '');
  const sub2 = JavaScript.quote_(
    block.getFieldValue('propertySubValue2') || ''
  );
  const sub3 = JavaScript.quote_(
    block.getFieldValue('propertySubValue3') || ''
  );
  const id =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing')?.id);
  }

  const code = `joyCon_readProperty(${blockId}, ${id}, ${property}, ${sub}, ${sub2}, ${sub3})`;
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Reads a property of a Joy-Con.
 */
(globalThis as any)['joyCon_readProperty'] = async function (
  blockId: string,
  id: string,
  property: string,
  subValue: string,
  subValue2: string,
  subValue3: string
) {
  // If no things block is attached, return.
  if (!id) {
    console.error('No Joy-Con block set.');
    return;
  }

  const block = getWorkspace()?.getBlockById(blockId);
  const thing = (block as any).thing;
  const packet = await thing.readProperty(property);
  if (subValue2 !== '') {
    if (property === 'accelerometers') {
      return packet[subValue][subValue2]['acc'];
    } else if (property === 'gyroscopes') {
      return packet[subValue][subValue2][subValue3];
    } else {
      return packet[subValue][subValue2];
    }
  } else {
    return packet[subValue];
  }
};

/**
 * Generates JavaScript code for the joycon_button_events block.
 */
JavaScript.forBlock['joycon_button_events'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'Thing', JavaScript.ORDER_NONE) || null;
  const onWhile = JavaScript.quote_(block.getFieldValue('onWhile'));
  const button = JavaScript.quote_(block.getFieldValue('button'));
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );
  const released = block.getFieldValue('released') === 'released';
  let blockId = "''";
  if (block.getInputTargetBlock('Thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('Thing')?.id);
  }

  const handler = `joyCon_handleButtons(${blockId}, ${thing}, ${onWhile}, ${button}, ${released}, ${statements});\n`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Handles button pushed on a Nintendo JoyCon.
 */
(globalThis as any)['joyCon_handleButtons'] = async function (
  blockId: string,
  id: string,
  onWhile: string,
  button: string,
  released: string,
  statements: string
) {
  let interval: NodeJS.Timer;

  // Mapping button index to each button
  // Each joycon contains 16 buttons indexed
  const buttonMappingSingle = {
    0: 'A',
    1: 'X',
    2: 'B',
    3: 'Y',
    4: 'RSL',
    5: 'RSR',
    9: 'PLUS',
    11: 'RA',
    12: 'HOME',
    14: 'R',
    15: 'RT',
    16: 'LEFT',
    17: 'DOWN',
    18: 'UP',
    19: 'RIGHT',
    20: 'LSL',
    21: 'LSR',
    24: 'MINUS',
    26: 'LA',
    29: 'CAPTURE',
    30: 'L',
    31: 'LT',
  };

  const buttonMappingDual = {
    4: 'RSL',
    5: 'RSR',
    6: 'B',
    7: 'A',
    8: 'Y',
    9: 'X',
    10: 'L',
    11: 'R',
    12: 'LT',
    13: 'RT',
    14: 'MINUS',
    15: 'PLUS',
    16: 'LA',
    17: 'RA',
    18: 'UP',
    19: 'DOWN',
    20: 'LEFT',
    21: 'RIGHT',
    23: 'HOME',
    24: 'LSL',
    25: 'LSR',
  };

  if (!('ongamepadconnected' in window)) {
    // No gamepad events available, poll instead.
    interval = setInterval(pollGamepads, 100);
  }

  let lastPressed = [];
  let pressed: string[] = [];

  async function pollGamepads() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gamepadArray = [];
    for (const gamepad of gamepads) {
      gamepadArray.push(gamepad);
    }
    const orderedGamepads = [];
    orderedGamepads.push(
      gamepadArray.find(g => g && g.id.indexOf('Joy-Con') > -1)
    );

    let type = (orderedGamepads[0] as any).id.indexOf('L+R') > -1 ? 'L+R' : 'L';
    type = (orderedGamepads[0] as any).id.indexOf('(R)') > -1 ? 'R' : type;

    lastPressed = pressed;
    pressed = [];

    for (const gamepad of orderedGamepads) {
      if (gamepad) {
        for (let i = 0; i < gamepad.buttons.length; i++) {
          if (gamepad.buttons[i].pressed) {
            let id, button;
            if (type === 'R') {
              id = i;
              button = (buttonMappingSingle as any)[id] || id;
            } else if (type === 'L') {
              id = i + 16;
              button = (buttonMappingSingle as any)[id] || id;
            } else if (type === 'L+R') {
              id = i + 6;
              button = (buttonMappingSingle as any)[id] || id;
            }
            pressed.push(button);
          }
        }
      }
    }

    if (
      (!released &&
        pressed.indexOf(button) > -1 && // button is pressed
        (onWhile === 'while' || lastPressed.indexOf(button) === -1)) || // while selected or button was not pressed before
      (released && // release selected
        pressed.indexOf(button) === -1 && // button is not pressed
        lastPressed.indexOf(button) > -1) // and was pressed before
    ) {
      try {
        eval(`(async () => {${statements}})();`);
      } catch (e: any) {
        console.error(e);
      }
    }
  }

  addCleanUpFunction(() => {
    if (interval) {
      clearInterval(interval);
    }
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
