/**
 * @fileoverview Code generators for the streamdeck blocks
 * (https://www.elgato.com/de/stream-deck).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
// eslint-disable-next-line node/no-unpublished-import
import Interpreter from 'js-interpreter';
import {addCleanUpFunction, getWorkspace} from './../../blast_interpreter.js';
import {getThingsLog} from './../../blast_things.js';
import {
  apiFunctions,
  asyncApiFunctions,
  getInterpreter,
  setInterrupted,
  throwError,
} from './../../blast_interpreter.js';

const thingsLog = getThingsLog();

/**
 * Generates JavaScript code for the things_streamdeck block.
 * @param {Blockly.Block} block the things_streamdeck block.
 * @returns {String} the generated code.
 */
JavaScript['things_streamdeck'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the streamdeck_button_event block.
 * @param {Blockly.Block} block the streamdeck_button_event block.
 * @returns {String} the generated code.
 */
JavaScript['streamdeck_button_event'] = function (block) {
  const button1 = block.getFieldValue('button1') === 'TRUE' ? 1 : 0;
  const button2 = block.getFieldValue('button2') === 'TRUE' ? 1 : 0;
  const button3 = block.getFieldValue('button3') === 'TRUE' ? 1 : 0;
  const button4 = block.getFieldValue('button4') === 'TRUE' ? 1 : 0;
  const button5 = block.getFieldValue('button5') === 'TRUE' ? 1 : 0;
  const button6 = block.getFieldValue('button6') === 'TRUE' ? 1 : 0;
  const upDown = JavaScript.quote_(block.getFieldValue('upDown'));
  const id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('id')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('id').id);
  }
  const buttons = JavaScript.quote_(
    `${button1}${button2}${button3}${button4}${button5}${button6}`
  );
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );

  const handler = `registerStreamdeckHandler(${blockId}, ${id}, ${buttons}, ${upDown}, ${statements});\n`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Registering event handlers needs to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Generates JavaScript code for the streamdeck_color_buttons block.
 * @param {Blockly.Block} block the streamdeck_button_event block.
 * @returns {String} the generated code.
 */
JavaScript['streamdeck_color_buttons'] = function (block) {
  const button1 = block.getFieldValue('button1') === 'TRUE' ? 1 : 0;
  const button2 = block.getFieldValue('button2') === 'TRUE' ? 1 : 0;
  const button3 = block.getFieldValue('button3') === 'TRUE' ? 1 : 0;
  const button4 = block.getFieldValue('button4') === 'TRUE' ? 1 : 0;
  const button5 = block.getFieldValue('button5') === 'TRUE' ? 1 : 0;
  const button6 = block.getFieldValue('button6') === 'TRUE' ? 1 : 0;
  const color =
    JavaScript.valueToCode(block, 'color', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('#000000');
  const id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('id')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('id').id);
  }
  const buttons = JavaScript.quote_(
    `${button1}${button2}${button3}${button4}${button5}${button6}`
  );

  const code = `streamdeckColorButtons(${blockId}, ${id}, ${buttons}, ${color});\n`;
  return code;
};

/**
 * Handles button pushes on an elGato Stream Deck
 * @param {Blockly.Block.id} blockId the things_streamdeck block's id.
 * @param {String} id identifier of the streamdeck device in {@link Blast.Things.webHidDevices}.
 * @param {String} buttons string containing pushed buttons.
 * @param {String} upDown string containing the direction of the button push.
 * @param {String} statements code to be executed when the buttons are pushed.
 */
const registerStreamdeckHandler = function (
  blockId,
  id,
  buttons,
  upDown,
  statements
) {
  // If no things block is attached, return.
  if (id === null) {
    throwError('No streamdeck block set.');
    return;
  }

  let button;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons.charAt(i) === '1') {
      button = i;
      break;
    }
  }

  if (button === undefined) {
    return;
  }

  const handler = function (data) {
    const keyIndex = data.id;
    thingsLog(
      `Received <code>${data.pressed}</code> event on button <code>${keyIndex}</code>`,
      'hid',
      'Elgato Systems Stream Deck Mini'
    );
    if (keyIndex === button) {
      // interrupt BLAST execution.
      setInterrupted(true);

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
            setInterrupted(false);
          }
        } catch (error) {
          throwError(`Error executing program:\n ${error}`);
          console.error(error);
        }
      };
      interruptRunner_();
    }
  };

  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  thing.subscribeEvent('button' + upDown, handler);

  addCleanUpFunction(() => {
    thing.unsubscribeAll();
  });
};

// Add streamdeck function to the Interpreter's API
apiFunctions.push(['registerStreamdeckHandler', registerStreamdeckHandler]);

/**
 * Fills the buttons of a Stream Deck with a color.
 * @param {Blockly.Block.id} blockId the things_streamdeck block's id.
 * @param {String} id identifier of the streamdeck device in {@link Blast.Things.webHidDevices}.
 * @param {String} buttons string containing pushed buttons.
 * @param {String} color color to fill the buttons with, as hex value.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const streamdeckColorButtons = async function (
  blockId,
  id,
  buttons,
  color,
  callback
) {
  // If no things block is attached, return.
  if (id === null) {
    throwError('No streamdeck block set.');
    callback();
    return;
  }

  // generate array of buttons to be filled with color (Array<{id: number, color: string}>)
  const buttonsToColor = [];
  for (let i = 0; i < buttons.length; i++) {
    if (buttons.charAt(i) === '1') {
      buttonsToColor.push({id: i, color: color});
    }
  }

  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  await thing.writeProperty('buttonColors', buttonsToColor);

  callback();
};

// Add streamdeckColorButtons function to the Interpreter's API
asyncApiFunctions.push(['streamdeckColorButtons', streamdeckColorButtons]);

/**
 * Displays a value on a Stream Deck's buttons.
 * @param {Blockly.Block} block the streamdeck_button_event block.
 * @returns {String} the generated code.
 */
JavaScript['streamdeck_write_on_buttons'] = function (block) {
  const button1 = block.getFieldValue('button1') === 'TRUE' ? 1 : 0;
  const button2 = block.getFieldValue('button2') === 'TRUE' ? 1 : 0;
  const button3 = block.getFieldValue('button3') === 'TRUE' ? 1 : 0;
  const button4 = block.getFieldValue('button4') === 'TRUE' ? 1 : 0;
  const button5 = block.getFieldValue('button5') === 'TRUE' ? 1 : 0;
  const button6 = block.getFieldValue('button6') === 'TRUE' ? 1 : 0;
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('');
  const id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('id')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('id').id);
  }
  const buttons = JavaScript.quote_(
    `${button1}${button2}${button3}${button4}${button5}${button6}`
  );

  const code = `streamdeckWriteOnButtons(${blockId}, ${id}, ${buttons}, ${value});\n`;
  return code;
};

/**
 * Displays a value on a Stream Deck's buttons.
 * @param {String} id identifier of the streamdeck device in {@link Blast.Things.webHidDevices}.
 * @param {String} buttons string containing pushed buttons.
 * @param {String} value value to display on the buttons.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const streamdeckWriteOnButtons = async function (
  blockId,
  id,
  buttons,
  value,
  callback
) {
  // If no things block is attached, return.
  if (id === null) {
    throwError('No streamdeck block set.');
    callback();
    return;
  }

  // generate array of buttons to write text on (Array<{id: number, text: string}>)
  const buttonsToWrite = [];
  for (let i = 0; i < buttons.length; i++) {
    if (buttons.charAt(i) === '1') {
      buttonsToWrite.push({id: i, text: value});
    }
  }

  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  await thing.writeProperty('buttonText', buttonsToWrite);

  callback();
};

// Add streamdeckWriteOnButtons function to the Interpreter's API
asyncApiFunctions.push(['streamdeckWriteOnButtons', streamdeckWriteOnButtons]);

JavaScript['streamdeck_set_brightness'] = function (block) {
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('100');
  const id = JavaScript.valueToCode(block, 'id', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('id')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('id').id);
  }
  const code = `streamdeckSetBrightness(${blockId}, ${id}, ${value});\n`;
  return code;
};

const streamdeckSetBrightness = async function (blockId, id, value, callback) {
  // If no things block is attached, return.
  if (id === null) {
    throwError('No streamdeck block set.');
    callback();
    return;
  }

  if (value < 1 || value > 100) {
    throwError('Brightness must be between 1 and 100.');
    callback();
    return;
  }

  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  await thing.writeProperty('brightness', value);

  callback();
};

// Add streamdeckSetBrightness function to the Interpreter's API
asyncApiFunctions.push(['streamdeckSetBrightness', streamdeckSetBrightness]);
