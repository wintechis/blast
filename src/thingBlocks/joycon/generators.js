/**
 * @fileoverview Code generators for the joycon blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
// eslint-disable-next-line node/no-missing-import
import {addCleanUpFunction} from './../../blast_interpreter.js';
import {JoyCon} from './../../things/joycon/JoyCon.js';
import {apiFunctions} from './../../blast_interpreter.js';
import {asyncApiFunctions} from './../../blast_interpreter.js';
import {getInterpreter} from './../../blast_interpreter.js';
import {getThingsLog} from './../../blast_things.js';
import {getWebHidDevice} from './../../blast_things.js';
import {setInterrupted} from './../../blast_interpreter.js';
import {throwError} from './../../blast_interpreter.js';

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

  const code = `readJoyConProperty(${id}, '${property}', '${sub}', '${sub2}', '${sub3}')`;
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Reads a property of a Joy-Con.
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

  const thing = new JoyCon(id);
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
  const thing = JavaScript.valueToCode(block, 'Thing', JavaScript.ORDER_NONE);
  const button = JavaScript.quote_(block.getFieldValue('button'));
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );

  const handler = `handleJoyConButtons(${thing}, ${button}, ${statements});\n`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Handles button pushed on a Nintendo JoyCon.
 * @param {string} id identifier of the JoyCon device in {@link Blast.Things.webHidDevices}.
 * @param {string} button the button to handle.
 * @param {string} statements the statements to execute when the button is pushed.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const handleJoyConButtons = async function (id, button, statements, callback) {
  // If no things block is attached, return.
  if (!id) {
    throwError('No Joy-Con block set.');
    callback();
    return;
  }

  const thingsLog = getThingsLog();

  const handler = async function (data) {
    console.log(data);
    if (data === button) {
      thingsLog(
        `Received <code>hidinput</code> event from Joy-Con: <code>${JSON.stringify(
          'ButtonDown Event ' + data
        )}</code>`,
        'hid',
        'Joy-Con'
      );
      // interrupt BLAST execution
      setInterrupted(false);

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

  const thing = new JoyCon(id);
  thing.subscribeEvent('buttonDown', handler);

  addCleanUpFunction(() => {
    thingsLog('Removing all Joy-Con listeners', 'hid', 'Joy-Con');
    thing.unsubscribeAll();
  });
};

// add joycon_button_events function to the interpreter's API.
apiFunctions.push(['handleJoyConButtons', handleJoyConButtons]);
