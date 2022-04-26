/**
 * @fileoverview Code generators for the joycon blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
import {JoyConLeft, JoyConRight} from './joycon-webhid/joycon.js';
// eslint-disable-next-line node/no-unpublished-import
import Interpreter from 'js-interpreter';
import {
  addCleanUpFunction,
  apiFunctions,
  asyncApiFunctions,
  deviceEventHandlers,
  getInterpreter,
  getWorkspace,
  setInterrupted,
  throwError,
} from './../../blast_interpreter.js';
import {getThingsLog, getWebHidDevice} from './../../blast_things.js';

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
  statements,
  callback
) {
  // If no things block is attached, return.
  if (!id) {
    throwError('No Joy-Con block set.');
    callback();
    return;
  }

  const device = getWebHidDevice(id);

  if (!device) {
    throwError(
      'Connected device is not a HID device.\nMake sure you are connecting the JoyCon via webHID'
    );
    callback();
    return;
  }

  if (!device.opened) {
    try {
      await device.open();
    } catch (error) {
      throwError(
        "Failed to open device, your browser or OS probably doesn't support webHID."
      );
    }
  }

  // Check if device is a Joy-Con.
  if (
    device.vendorId !== 1406 ||
    (device.productId !== 0x2006 && device.productId !== 0x2007)
  ) {
    throwError('The connected device is not a Joy-Con.');
    callback();
    return;
  }

  let joyCon;
  if (device.productId === 0x2006) {
    joyCon = new JoyConLeft(device);
  } else if (device.productId === 0x2007) {
    joyCon = new JoyConRight(device);
  }
  await joyCon.open();
  await joyCon.enableStandardFullMode();
  await joyCon.enableIMUMode();

  let pushedInLastPacket = false;
  const thingsLog = getThingsLog();

  const hidInputHandler = async function (event) {
    console.log(event);
    const packet = event.detail;
    if (!packet || !packet.actualOrientation) {
      return;
    }

    thingsLog(
      `Received <code>hidinput</code> event from Joy-Con: <code>${JSON.stringify(
        packet
      )}</code>`,
      'hid',
      device.productName
    );

    if (packet.buttonStatus[button]) {
      if (onWhile === 'on' && !pushedInLastPacket) {
        pushedInLastPacket = true;
        // interrupt BLAST execution
        setInterrupted(true);

        const interpreter = new Interpreter('');
        interpreter.getStateStack()[0].scope =
          getInterpreter().getGlobalScope();
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
      if (onWhile === 'while') {
        onWhile = 'wait';
        // interrupt BLAST execution
        setInterrupted(true);

        const interpreter = new Interpreter('');
        interpreter.getStateStack()[0].scope =
          getInterpreter().getGlobalScope();
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
        setTimeout(() => {
          onWhile = 'while';
        }, 200);
      }
    } else {
      pushedInLastPacket = false;
    }
  };

  deviceEventHandlers.push({
    device: joyCon,
    type: 'hidinput',
    fn: hidInputHandler,
  });

  joyCon.addEventListener('hidinput', hidInputHandler);
};

// add joycon_button_events function to the interpreter's API.
apiFunctions.push(['handleJoyConButtons', handleJoyConButtons]);
