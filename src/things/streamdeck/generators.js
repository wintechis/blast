/**
 * @fileoverview Code generators for the streamdeck blocks
 * (https://www.elgato.com/de/stream-deck).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

goog.module('Blast.generators.streamdeck');

const {addCleanUpFunction} = goog.require('Blast.Interpreter');
const {addToLog} = goog.require('Blast.Ui');
const {apiFunctions} = goog.require('Blast.Interpreter');
const {asyncApiFunctions} = goog.require('Blast.Interpreter');
const {getInterpreter} = goog.require('Blast.Interpreter');
const {getWebHidDevice} = goog.require('Blast.Things');
const {setInterrupted} = goog.require('Blast.Interpreter');
const {throwError} = goog.require('Blast.Interpreter');
 
/**
  * Generates JavaScript code for the streamdeck_button_event block.
  * @param {Blockly.Block} block the streamdeck_button_event block.
  * @returns {String} the generated code.
  */
Blockly.JavaScript['streamdeck_button_event'] = function(block) {
  const button1 = block.getFieldValue('button1') == 'TRUE' ? 1 : 0;
  const button2 = block.getFieldValue('button2') == 'TRUE' ? 1 : 0;
  const button3 = block.getFieldValue('button3') == 'TRUE' ? 1 : 0;
  const button4 = block.getFieldValue('button4') == 'TRUE' ? 1 : 0;
  const button5 = block.getFieldValue('button5') == 'TRUE' ? 1 : 0;
  const button6 = block.getFieldValue('button6') == 'TRUE' ? 1 : 0;
  const upDown = Blockly.JavaScript.quote_(block.getFieldValue('upDown'));
  const id = Blockly.JavaScript.valueToCode(
      block,
      'id',
      Blockly.JavaScript.ORDER_NONE,
  ) || null;
    
  const buttons = Blockly.JavaScript.quote_(
      `${button1}${button2}${button3}${button4}${button5}${button6}`,
  );
  const statements = Blockly.JavaScript.quote_(Blockly.JavaScript.statementToCode(block, 'statements'));

  const handler = `handleStreamdeck(${id}, ${buttons}, ${upDown}, ${statements});\n`;
  const handlersList = Blockly.JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  Blockly.JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Generates JavaScript code for the streamdeck_color_buttons block.
  * @param {Blockly.Block} block the streamdeck_button_event block.
  * @returns {String} the generated code.
 */
Blockly.JavaScript['streamdeck_color_buttons'] = function(block) {
  const button1 = block.getFieldValue('button1') == 'TRUE' ? 1 : 0;
  const button2 = block.getFieldValue('button2') == 'TRUE' ? 1 : 0;
  const button3 = block.getFieldValue('button3') == 'TRUE' ? 1 : 0;
  const button4 = block.getFieldValue('button4') == 'TRUE' ? 1 : 0;
  const button5 = block.getFieldValue('button5') == 'TRUE' ? 1 : 0;
  const button6 = block.getFieldValue('button6') == 'TRUE' ? 1 : 0;
  const color = Blockly.JavaScript.valueToCode(
      block,
      'color',
      Blockly.JavaScript.ORDER_NONE,
  ) || Blockly.JavaScript.quote_('#000000');
  const id = Blockly.JavaScript.valueToCode(
      block,
      'id',
      Blockly.JavaScript.ORDER_NONE,
  ) || null;

  const buttons = Blockly.JavaScript.quote_(
      `${button1}${button2}${button3}${button4}${button5}${button6}`,
  );

  const code = `streamdeckColorButtons(${id}, ${buttons}, ${color});\n`;
  return code;
};

/**
 * Handles button pushes on an elGato Stream Deck
 * @param {String} id identifier of the streamdeck device in {@link Blast.Things.webHidDevices}.
 * @param {String} buttons string containing pushed buttons.
 * @param {String} upDown string containing the direction of the button push.
 * @param {String} statements code to be executed when the buttons are pushed.
 */
const handleStreamdeck = async function(id, buttons, upDown, statements) {
  // If no things block is attached, return.
  if (id === null) {
    throwError('No streamdeck block set.');
    return;
  }


  const device = getWebHidDevice(id);

  if (!device) {
    throwError('Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID');
    return;
  }

  let streamdeck;
  
  try {
    streamdeck = await StreamDeck.openDevice(device);
  } catch (e) {
    // if InvalidStateError error, device is probably already opened
    if (e.name == 'InvalidStateError') {
      device.close();
      streamdeck = await StreamDeck.openDevice(device);
    } else {
      throwError(e);
      return;
    }
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

  streamdeck.on(upDown, (keyIndex) => {
    addToLog(`Received <code>${upDown}</code> event on button <code>${keyIndex}</code>`, 'hid', device.productName);
    if (keyIndex === button) {
      // interrupt BLAST execution.
      setInterrupted(true);
        
      const interpreter = new Interpreter('');
      interpreter.stateStack[0].scope = getInterpreter().globalScope;
      interpreter.appendCode(statements);

      const interruptRunner_ = function() {
        try {
          const hasMore = interpreter.step();
          if (hasMore) {
            setTimeout(interruptRunner_, 5);
          } else {
            // Continue BLAST execution.
            setInterrupted(false);
          }
        } catch (error) {
          throwError(`Error executing program:\n ${e}`);
          console.error(error);
        }
      };
      interruptRunner_();
    }
  });

  addCleanUpFunction(() => {
    addToLog('Removing all listeners', 'hid', device.productName);
    streamdeck.close();
    streamdeck.removeAllListeners();
  },
  );
};

// Add streamdeck function to the Interpreter's API
apiFunctions.push(['handleStreamdeck', handleStreamdeck]);

/**
 * Fills the buttons of a Stream Deck with a color.
 * @param {String} id identifier of the streamdeck device in {@link Blast.Things.webHidDevices}.
 * @param {String} buttons string containing pushed buttons.
 * @param {String} color color to fill the buttons with, as hex value.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const streamdeckColorButtons = async function(id, buttons, color, callback) {
  // If no things block is attached, return.
  if (id === null) {
    throwError('No streamdeck block set.');
    callback();
    return;
  }
  
  
  const device = getWebHidDevice(id);
  
  if (!device) {
    throwError('Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID');
    callback();
    return;
  }
  
  let streamdeck;
    
  try {
    streamdeck = await StreamDeck.openDevice(device);
  } catch (e) {
    // if InvalidStateError error, device is probably already opened
    if (e.name == 'InvalidStateError') {
      device.close();
      streamdeck = await StreamDeck.openDevice(device);
    } else {
      throwError(e);
      callback();
      return;
    }
  }

  // convert color to rgb
  const red = parseInt(color.substring(1, 3), 16);
  const green = parseInt(color.substring(3, 5), 16);
  const blue = parseInt(color.substring(5, 7), 16);

  // fill selected buttons with color
  for (let i = 0; i < buttons.length; i++) {
    if (buttons.charAt(i) === '1') {
      addToLog(`Invoke <code>fillKeyColor</code> with value <code>${[i, red, green, blue].toString()}</code>`, 'hid', device.productName);
      await streamdeck.fillKeyColor(i, red, green, blue);
      addToLog('Finished <code>fillKeyColor</code>', 'hid', device.productName);
    }
  }

  callback();
};

// Add streamdeckColorButtons function to the Interpreter's API
asyncApiFunctions.push(['streamdeckColorButtons', streamdeckColorButtons]);


/**
 * Displays a value on a Stream Deck's buttons.
  * @param {Blockly.Block} block the streamdeck_button_event block.
  * @returns {String} the generated code.
 */
Blockly.JavaScript['streamdeck_write_on_buttons'] = function(block) {
  const button1 = block.getFieldValue('button1') == 'TRUE' ? 1 : 0;
  const button2 = block.getFieldValue('button2') == 'TRUE' ? 1 : 0;
  const button3 = block.getFieldValue('button3') == 'TRUE' ? 1 : 0;
  const button4 = block.getFieldValue('button4') == 'TRUE' ? 1 : 0;
  const button5 = block.getFieldValue('button5') == 'TRUE' ? 1 : 0;
  const button6 = block.getFieldValue('button6') == 'TRUE' ? 1 : 0;
  const value = Blockly.JavaScript.valueToCode(
      block,
      'value',
      Blockly.JavaScript.ORDER_NONE,
  ) || Blockly.JavaScript.quote_('');
  const id = Blockly.JavaScript.valueToCode(
      block,
      'id',
      Blockly.JavaScript.ORDER_NONE,
  ) || null;

  const buttons = Blockly.JavaScript.quote_(
      `${button1}${button2}${button3}${button4}${button5}${button6}`,
  );

  const code = `streamdeckWriteOnButtons(${id}, ${buttons}, ${value});\n`;
  return code;
};

/**
 * Displays a value on a Stream Deck's buttons.
 * @param {String} id identifier of the streamdeck device in {@link Blast.Things.webHidDevices}.
 * @param {String} buttons string containing pushed buttons.
 * @param {String} value value to display on the buttons.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const streamdeckWriteOnButtons = async function(id, buttons, value, callback) {
  // If no things block is attached, return.
  if (id === null) {
    throwError('No streamdeck block set.');
    callback();
    return;
  }
  
  
  const device = getWebHidDevice(id);
  
  if (!device) {
    throwError('Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID');
    callback();
    return;
  }
  
  let streamdeck;
    
  try {
    streamdeck = await StreamDeck.openDevice(device);
  } catch (e) {
    // if InvalidStateError error, device is probably already opened
    if (e.name == 'InvalidStateError') {
      device.close();
      streamdeck = await StreamDeck.openDevice(device);
    } else {
      throwError(e);
      callback();
      return;
    }
  }

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
      addToLog(`Invoke <code>fillKeyImageData</code> with value <code>${[i, imageData].toString()}</code>`, 'hid', device.productName);
      ps.push(streamdeck.fillKeyBuffer(i, buffer.Buffer.from(imageData.data), {format: 'rgba'}));
      addToLog('Finished <code>fillKeyImageData</code>', 'hid', device.productName);
    }
  }

  ctx.restore();

  await Promise.all(ps);
  callback();
};

// Add streamdeckWriteOnButtons function to the Interpreter's API
asyncApiFunctions.push(['streamdeckWriteOnButtons', streamdeckWriteOnButtons]);

Blockly.JavaScript['streamdeck_set_brightness'] = function(block) {
  const value = Blockly.JavaScript.valueToCode(
      block,
      'value',
      Blockly.JavaScript.ORDER_NONE,
  ) || Blockly.JavaScript.quote_('100');
  const id = Blockly.JavaScript.valueToCode(
      block,
      'id',
      Blockly.JavaScript.ORDER_NONE,
  ) || null;
  
  const code = `streamdeckSetBrightness(${id}, ${value});\n`;
  return code;
};

const streamdeckSetBrightness = async function(id, value, callback) {
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
  
  
  const device = getWebHidDevice(id);
  
  if (!device) {
    throwError('Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID');
    callback();
    return;
  }
  
  let streamdeck;
    
  try {
    streamdeck = await StreamDeck.openDevice(device);
  } catch (e) {
    // if InvalidStateError error, device is probably already opened
    if (e.name == 'InvalidStateError') {
      device.close();
      streamdeck = await StreamDeck.openDevice(device);
    } else {
      throwError(e);
      callback();
      return;
    }
  }

  addToLog(`Invoke <code>setBrightness</code> with value <code>${value}</code>`, 'hid', device.productName);
  await streamdeck.setBrightness(value);
  addToLog('Finished <code>setBrightness</code>', 'hid', device.productName);
  callback();
};

// Add streamdeckSetBrightness function to the Interpreter's API
asyncApiFunctions.push(['streamdeckSetBrightness', streamdeckSetBrightness]);
