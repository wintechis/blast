/**
 * @fileoverview Code generators for the joycon blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {addCleanUpFunction, getWorkspace} from '../../interpreter';
import SwitchPro from './switchPro/SwitchPro.js';

JavaScript['things_joycon'] = function (block: Block): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the joycon_read_property block.
 */
JavaScript['joycon_read_property'] = function (block: Block): [string, number] {
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
JavaScript['joycon_button_events'] = function (block: Block): string {
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

JavaScript['things_gamepad_pro'] = function (block: Block): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the gamepad_pro_joystick block.
 */
JavaScript['gamepad_pro_joystick'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing')?.id);
  }
  const ownId = JavaScript.quote_(block.id);

  const handler = `gamepad_handleJoystick(${ownId}, ${blockId}, ${thing}, ${statements});\n`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Handles gamepad joystick events.
 */
(globalThis as any)['gamepad_handleJoystick'] = function (
  ownId: string,
  blockId: string,
  id: string,
  statements: string
) {
  const switchPro = new SwitchPro();
  (switchPro as any).interval = setInterval(
    switchPro.pollGamepads.bind(switchPro),
    200
  );

  const ws = getWorkspace();
  const self = ws?.getBlockById(ownId);
  if (self === null || self === undefined) {
    return;
  }
  const xName = (self as any).xName;
  const yName = (self as any).yName;
  const angleName = (self as any).angleName;

  (globalThis as any)[xName] = 0;
  (globalThis as any)[yName] = 0;
  (globalThis as any)[angleName] = 0;

  const handleJoystick = function (joystick: any) {
    (globalThis as any)[xName] = joystick['x'] || 0;
    (globalThis as any)[yName] = joystick['y'] || 0;
    (globalThis as any)[angleName] = joystick['angle'] || 0;

    try {
      eval(`(async () => {${statements}})();`);
    } catch (e: any) {
      console.error(e);
    }
  };

  switchPro.addListener(handleJoystick);

  addCleanUpFunction(() => {
    clearInterval((switchPro as any).interval);
  });
};

/**
 * Generates JavaScript code for the gamepad_pro_button block.
 */
JavaScript['gamepad_pro_button'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const button = JavaScript.quote_(block.getFieldValue('button'));
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing')?.id);
  }

  const handler = `gamepad_handleButton(${blockId}, ${thing}, ${button}, ${statements});\n`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Handles gamepad button events.
 * @param {Blockly.Block.id} blockId the things_joycon block's id.
 */
(globalThis as any)['gamepad_handleButton'] = async function (
  blockId: string,
  id: string,
  button: number,
  statements: string
) {
  const switchPro = new SwitchPro();
  (switchPro as any).interval = setInterval(
    switchPro.pollGamepads.bind(switchPro),
    200
  );

  const handleButton = async function (pressed: string[]) {
    if (pressed[button]) {
      try {
        eval(`(async () => {${statements}})();`);
      } catch (e: any) {
        console.error(e);
      }
    }
  };

  switchPro.addListener(handleButton);

  addCleanUpFunction(() => {
    clearInterval((switchPro as any).interval);
  });
};
