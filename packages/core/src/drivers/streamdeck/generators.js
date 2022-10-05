/**
 * @fileoverview Code generators for the streamdeck blocks
 * (https://www.elgato.com/de/stream-deck).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import StreamDeck from '@elgato-stream-deck/webhid';
// eslint-disable-next-line node/no-unpublished-import
import {
  addCleanUpFunction,
  getWorkspace,
  throwError,
} from './../../blast_interpreter.js';
import {getThingsLog, getWebHidDevice} from './../../blast_things.js';

const thingsLog = getThingsLog();
// Add StreamDeck lib to the global scope
globalThis['StreamDeck'] = StreamDeck;

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
  const id =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const buttons = JavaScript.quote_(
    `${button1}${button2}${button3}${button4}${button5}${button6}`
  );
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );

  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const handler = `handleStreamdeck(${blockId}, ${id}, ${buttons}, ${upDown}, ${statements});\n`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Handles button pushes on an elGato Stream Deck
 * @param {Blockly.Block.id} blockId the things_streamdeck block's id.
 * @param {String} id identifier of the streamdeck device in {@link Blast.Things.webHidDevices}.
 * @param {String} buttons string containing pushed buttons.
 * @param {String} upDown string containing the direction of the button push.
 * @param {String} statements code to be executed when the buttons are pushed.
 */
globalThis['handleStreamdeck'] = async function (
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

  const device = getWebHidDevice(id);

  if (!device) {
    throwError(
      'Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID'
    );
    return;
  }

  const block = getWorkspace().getBlockById(blockId);
  const streamdeck = block.thing;

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

  streamdeck.on(upDown, keyIndex => {
    thingsLog(
      `Received <code>${upDown}</code> event on button <code>${keyIndex}</code>`,
      'hid',
      device.productName
    );
    if (keyIndex === button) {
      eval(`(async () => {${statements}})();`);
    }
  });

  addCleanUpFunction(() => {
    thingsLog('Removing all listeners', 'hid', device.productName);
    streamdeck.close();
    streamdeck.removeAllListeners();
  });
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
  const id =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const buttons = JavaScript.quote_(
    `${button1}${button2}${button3}${button4}${button5}${button6}`
  );

  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `await streamdeckColorButtons(${blockId}, ${id}, ${buttons}, ${color});\n`;
  return code;
};

/**
 * Fills the buttons of a Stream Deck with a color.
 * @param {Blockly.Block.id} blockId the things_streamdeck block's id.
 * @param {String} id identifier of the streamdeck device in {@link Blast.Things.webHidDevices}.
 * @param {String} buttons string containing pushed buttons.
 * @param {String} color color to fill the buttons with, as hex value.
 */
globalThis['streamdeckColorButtons'] = async function (
  blockId,
  id,
  buttons,
  color
) {
  // If no things block is attached, return.
  if (id === null) {
    throwError('No streamdeck block set.');
    return;
  }

  const device = getWebHidDevice(id);

  if (!device) {
    throwError(
      'Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID'
    );
    return;
  }

  const block = getWorkspace().getBlockById(blockId);
  const streamdeck = block.thing;

  // convert color to rgb
  const red = parseInt(color.substring(1, 3), 16);
  const green = parseInt(color.substring(3, 5), 16);
  const blue = parseInt(color.substring(5, 7), 16);

  // fill selected buttons with color
  for (let i = 0; i < buttons.length; i++) {
    if (buttons.charAt(i) === '1') {
      thingsLog(
        `Invoke <code>fillKeyColor</code> with value <code>${[
          i,
          red,
          green,
          blue,
        ].toString()}</code>`,
        'hid',
        device.productName
      );
      await streamdeck.fillKeyColor(i, red, green, blue);
      thingsLog(
        'Finished <code>fillKeyColor</code>',
        'hid',
        device.productName
      );
    }
  }
};

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
  const id =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const buttons = JavaScript.quote_(
    `${button1}${button2}${button3}${button4}${button5}${button6}`
  );

  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `await streamdeckWriteOnButtons(${blockId}, ${id}, ${buttons}, ${value});\n`;
  return code;
};

/**
 * Displays a value on a Stream Deck's buttons.
 * @param {Blockly.Block.id} blockId the things_streamdeck block's id.
 * @param {String} id identifier of the streamdeck device in {@link Blast.Things.webHidDevices}.
 * @param {String} buttons string containing pushed buttons.
 * @param {String} value value to display on the buttons.
 */
globalThis['streamdeckWriteOnButtons'] = async function (
  blockId,
  id,
  buttons,
  value
) {
  // If no things block is attached, return.
  if (id === null) {
    throwError('No streamdeck block set.');
    return;
  }

  const device = getWebHidDevice(id);

  if (!device) {
    throwError(
      'Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID'
    );
    return;
  }

  const block = getWorkspace().getBlockById(blockId);
  const streamdeck = block.thing;

  const ps = [];

  const canvas = document.createElement('canvas');
  canvas.width = streamdeck.ICON_SIZE;
  canvas.height = streamdeck.ICON_SIZE;

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = canvas.height * 0.8 + 'px Arial';
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 1;
  ctx.strokeText(value.toString(), 8, 60, canvas.width * 0.8);
  ctx.fillStyle = 'white';
  ctx.fillText(value.toString(), 8, 60, canvas.width * 0.8);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < buttons.length; i++) {
    if (buttons.charAt(i) === '1') {
      thingsLog(
        `Invoke <code>fillKeyImageData</code> with value <code>${[
          i,
          imageData,
        ].toString()}</code>`,
        'hid',
        device.productName
      );
      ps.push(
        streamdeck.fillKeyBuffer(i, Buffer.from(imageData.data), {
          format: 'rgba',
        })
      );
      thingsLog(
        'Finished <code>fillKeyImageData</code>',
        'hid',
        device.productName
      );
    }
  }

  ctx.restore();

  await Promise.all(ps);
};

JavaScript['streamdeck_set_brightness'] = function (block) {
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('100');
  const id =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `await streamdeckSetBrightness(${blockId}, ${id}, ${value});\n`;
  return code;
};

globalThis['streamdeckSetBrightness'] = async function (blockId, id, value) {
  // If no things block is attached, return.
  if (id === null) {
    throwError('No streamdeck block set.');
    return;
  }

  const device = getWebHidDevice(id);

  if (!device) {
    throwError(
      'Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID'
    );
    return;
  }

  const block = getWorkspace().getBlockById(blockId);
  const streamdeck = block.thing;

  thingsLog(
    `Invoke <code>setBrightness</code> with value <code>${value}</code>`,
    'hid',
    device.productName
  );
  await streamdeck.setBrightness(value);
  thingsLog('Finished <code>setBrightness</code>', 'hid', device.productName);
};
