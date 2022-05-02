/**
 * @fileoverview Code generators for the joycon blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
// eslint-disable-next-line node/no-unpublished-import
import Interpreter from 'js-interpreter';
import {
  addCleanUpFunction,
  apiFunctions,
  asyncApiFunctions,
  continueRunner,
  getInterpreter,
  getWorkspace,
  interruptRunner,
  throwError,
} from './../../blast_interpreter.js';

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
  const property = block.getFieldValue('property');
  const sub = block.getFieldValue('propertySubValue') || '';
  const sub2 = block.getFieldValue('propertySubValue2') || '';
  const sub3 = block.getFieldValue('propertySubValue3') || '';
  const id = JavaScript.valueToCode(block, 'Thing', JavaScript.ORDER_NONE);
  let blockId = "''";
  if (block.getInputTargetBlock('Thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('Thing').id);
  }

  const code = `readJoyConProperty(${blockId}, ${id}, '${property}', '${sub}', '${sub2}', '${sub3}')`;
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
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @returns {string} the value of the property.
 * @private
 */
const readJoyConProperty = async function (
  blockId,
  id,
  property,
  subValue,
  subValue2,
  subValue3,
  callback
) {
  // If no things block is attached, return.
  if (!id) {
    throwError('No Joy-Con block set.');
    callback();
    return;
  }

  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  const packet = await thing.readProperty(property);
  if (subValue2 !== '') {
    if (property === 'accelerometers') {
      callback(packet[subValue][subValue2]['acc']);
    } else if (property === 'gyroscopes') {
      callback(packet[subValue][subValue2][subValue3]);
    } else {
      callback(packet[subValue][subValue2]);
    }
  } else {
    callback(packet[subValue]);
  }
};

// add joycon_read_property function to the interpreter's API.
asyncApiFunctions.push(['readJoyConProperty', readJoyConProperty]);

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
  let blockId = "''";
  if (block.getInputTargetBlock('Thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('Thing').id);
  }

  const handler = `handleJoyConButtons(${blockId}, ${thing}, ${onWhile}, ${button}, ${statements});\n`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Handles button pushed on a Nintendo JoyCon.
 * @param {Blockly.Block.id} blockId the things_joycon block's id.
 * @param {string} id identifier of the JoyCon device in {@link Blast.Things.webHidDevices}.
 * @param {string} onWhile whether the statement should be executed continously while the button is pressed or only once.
 * @param {string} button the button to handle.
 * @param {string} statements the statements to execute when the button is pushed.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const handleJoyConButtons = async function (
  blockId,
  id,
  onWhile,
  button,
  statements
) {
  let interval;

  // Mapping button index to each button
  // Each joycon contains 16 buttons indexed
  const buttonMapping = {
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

  if (!('ongamepadconnected' in window)) {
    // No gamepad events available, poll instead.
    interval = setInterval(pollGamepads, 100);
  }

  let lastPressed = [];
  let pressed = [];

  function pollGamepads() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gamepadArray = [];
    for (let i = 0; i < gamepads.length; i++) {
      gamepadArray.push(gamepads[i]);
    }
    const orderedGamepads = [];
    orderedGamepads.push(
      gamepadArray.find(g => g && g.id.indexOf('Joy-Con (R)') > -1)
    );
    orderedGamepads.push(
      gamepadArray.find(g => g && g.id.indexOf('Joy-Con (L)') > -1)
    );

    lastPressed = pressed;
    pressed = [];

    for (let g = 0; g < orderedGamepads.length; g++) {
      const gp = orderedGamepads[g];
      if (gp) {
        for (let i = 0; i < gp.buttons.length; i++) {
          if (gp.buttons[i].pressed) {
            const id = g * 15 + i + g;
            const button = buttonMapping[id] || id;
            pressed.push(button);
          }
        }
      }
    }
    if (
      pressed.indexOf(button) > -1 &&
      (onWhile === 'while' || lastPressed.indexOf(button) === -1)
    ) {
      // interrupt BLAST execution
      interruptRunner();

      const interpreter = new Interpreter('');
      interpreter.getStateStack()[0].scope = getInterpreter().getGlobalScope();
      interpreter.appendCode(statements);

      const interruptRunner_ = function () {
        try {
          const hasMore = interpreter.step();
          if (hasMore) {
            setTimeout(interruptRunner_, 5);
          } else {
            // Continue BLAST execution.
            continueRunner();
          }
        } catch (error) {
          throwError(`Error executing program:\n ${error}`);
          console.error(error);
        }
      };
      interruptRunner_();
    }
  }

  addCleanUpFunction(() => {
    if (interval) {
      clearInterval(interval);
    }
  });
};

// add joycon_button_events function to the interpreter's API.
apiFunctions.push(['handleJoyConButtons', handleJoyConButtons]);
