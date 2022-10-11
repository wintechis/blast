/**
 * @fileoverview Code generators for the joycon blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import {
  addCleanUpFunction,
  getWorkspace,
  throwError,
} from './../../blast_interpreter.js';
import SwitchPro from './switchPro/SwitchPro.js';

JavaScript['things_joycon'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the joycon_read_property block.
 * @param {Blockly.Block} block the joycon_read_property block.
 * @returns {String} the generated code.
 */
JavaScript['joycon_read_property'] = function (block) {
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
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `joyCon_readProperty(${blockId}, ${id}, ${property}, ${sub}, ${sub2}, ${sub3})`;
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Reads a property of a Joy-Con.
 * @param {Blockly.Block.id} blockId the things_joycon block's id.
 * @param {string} id the id of the Joy-Con.
 * @param {string} property the property to read.
 * @param {string} subValue first sub level of the property.
 * @param {string} subValue2 second sub level of the property.
 * @param {string} subValue3 third sub level of the property.
 * @returns {string} the value of the property.
 * @private
 */
globalThis['joyCon_readProperty'] = async function (
  blockId,
  id,
  property,
  subValue,
  subValue2,
  subValue3
) {
  // If no things block is attached, return.
  if (!id) {
    throwError('No Joy-Con block set.');
    return;
  }

  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
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
 * @param {Blockly.Block} block the joycon_button_events block.
 * @returns {String} the generated code.
 */
JavaScript['joycon_button_events'] = function (block) {
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
    blockId = JavaScript.quote_(block.getInputTargetBlock('Thing').id);
  }

  const handler = `joyCon_handleButtons(${blockId}, ${thing}, ${onWhile}, ${button}, ${released}, ${statements});\n`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Handles button pushed on a Nintendo JoyCon.
 * @param {Blockly.Block.id} blockId the things_joycon block's id.
 * @param {string} id identifier of the JoyCon device in {@link Blast.Things.webHidDevices}.
 * @param {string} onWhile determines whether the statements are executed while the button is pressed or only once.
 * @param {string} button the button to handle.
 * @param {boolean} released whether the statements should be executed on release or on press.
 * @param {string} statements the statements to execute when the button is pushed.
 */
globalThis['joyCon_handleButtons'] = async function (
  blockId,
  id,
  onWhile,
  button,
  released,
  statements
) {
  let interval;

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
  let pressed = [];

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

    let type = orderedGamepads[0].id.indexOf('L+R') > -1 ? 'L+R' : 'L';
    type = orderedGamepads[0].id.indexOf('(R)') > -1 ? 'R' : type;

    lastPressed = pressed;
    pressed = [];

    for (const gamepad of orderedGamepads) {
      if (gamepad) {
        for (let i = 0; i < gamepad.buttons.length; i++) {
          if (gamepad.buttons[i].pressed) {
            let id, button;
            if (type === 'R') {
              id = i;
              button = buttonMappingSingle[id] || id;
            } else if (type === 'L') {
              id = i + 16;
              button = buttonMappingSingle[id] || id;
            } else if (type === 'L+R') {
              id = i + 6;
              button = buttonMappingDual[id] || id;
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
      } catch (e) {
        throwError(e);
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

JavaScript['things_gamepad_pro'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the gamepad_pro_joystick block.
 * @param {Blockly.Block} block the gamepad_pro_joystick block.
 * @returns {String} the generated code.
 */
JavaScript['gamepad_pro_joystick'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
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
 * @param {string} ownId the block id of this event block.
 * @param {string} blockId the block id of the thing_gamepad block connected this event block.
 * @param {string} id the id of the gamepad.
 * @param {string} statements the statements to execute.
 */
globalThis['gamepad_handleJoystick'] = function (
  ownId,
  blockId,
  id,
  statements
) {
  const switchPro = new SwitchPro();
  switchPro.interval = setInterval(switchPro.pollGamepads.bind(switchPro), 200);

  const self = getWorkspace().getBlockById(ownId);
  const xName = self.xName;
  const yName = self.yName;
  const angleName = self.angleName;

  globalThis[xName] = 0;
  globalThis[yName] = 0;
  globalThis[angleName] = 0;

  const handleJoystick = function (joystick) {
    globalThis[xName] = joystick['x'] || 0;
    globalThis[yName] = joystick['y'] || 0;
    globalThis[angleName] = joystick['angle'] || 0;

    try {
      eval(`(async () => {${statements}})();`);
    } catch (e) {
      throwError(e);
      console.error(e);
    }
  };

  switchPro.addListener(handleJoystick);

  addCleanUpFunction(() => {
    clearInterval(switchPro.interval);
  });
};

/**
 * Generates JavaScript code for the gamepad_pro_button block.
 * @param {Blockly.Block} block the gamepad_pro_button block.
 */
JavaScript['gamepad_pro_button'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const button = JavaScript.quote_(block.getFieldValue('button'));
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
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
 * @param {string} id identifier of the JoyCon device in {@link Blast.Things.webHidDevices}.
 * @param {string} button the button to handle.
 * @param {string} statements the statements to execute when the button is pushed.
 */
globalThis['gamepad_handleButton'] = async function (
  blockId,
  id,
  button,
  statements
) {
  const switchPro = new SwitchPro();
  switchPro.interval = setInterval(switchPro.pollGamepads.bind(switchPro), 200);

  const handleButton = async function (pressed) {
    if (pressed[button]) {
      try {
        eval(`(async () => {${statements}})();`);
      } catch (e) {
        throwError(e);
        console.error(e);
      }
    }
  };

  switchPro.addListener(handleButton);

  addCleanUpFunction(() => {
    clearInterval(switchPro.interval);
  });
};
