/**
 * @fileoverview states interpreter and utility functions.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

import Blockly from 'blockly';
import {apiFunctions} from './blast_interpreter.js';
import {getInterpreter} from './blast_interpreter.js';
import {onStatusChange} from './blast_interpreter.js';
import {resetInterpreter} from './blast_interpreter.js';
import {setStatesInterpreterRunning} from './blast_interpreter.js';
import {throwError} from './blast_interpreter.js';

/**
 * Instance of the JS Interpreter checking for changing states.
 * @type {?Interpreter}
 * @public
 */
let stateInterpreter = null;

/**
 * Stores the workspace.
 */
let workspace = null;

/**
 * Instance of runner function.
 * @type {?Function}
 * @private
 */
let runner_ = null;

/**
 * latest JavaScript code generated by Blast's State and event blocks.
 * @type {string}
 * @public
 */
let latestCode = '';

/**
 * Map containing code generated by every event block.
 */
const eventCode = new Map();

/**
 * adds an event block's code to {@link eventCode}.
 * @param {Blockly.Block.id} blockId id of the event block.
 * @param {string} code code generated by the event block.
 */
export const addEventCode = function (blockId, code) {
  eventCode.set(blockId, code);
};

/**
 * removes an event block's code from {@link eventCode}.
 * @param {Blockly.Block.id} blockId id of the event block.
 */
export const removeEventCode = function (blockId) {
  eventCode.delete(blockId);
};

/**
 * Generates the code for all events a workspace.
 * @param {!Blockly.Workspace} workspace Root workspace.
 */
export const generateCode = function () {
  // event blocks are continuously checking for state condditions.
  let code = 'while (true) {\n \n}';

  // get all event blocks in the workspace
  const eventIds = workspace.getBlocksByType('event', false).map(block => {
    return block.id;
  });

  for (const [id, newCode] of eventCode) {
    // only add code for event blocks in the workspace
    if (eventIds.includes(id)) {
      // insert event code before the closing '\n}'
      code = code.slice(0, -2) + newCode + '\n' + code.slice(-1);
    }
  }
  // prepend generated code with variable and function definitions
  latestCode = code;
};

/**
 * executes {@link latestCode} using {@link Blast.Interpreter.Interpreter}.
 */
const startEventChecker = function () {
  stateInterpreter = null;

  // Initiate States interpreter.
  stateInterpreter = new Interpreter('');
  stateInterpreter.getStateStack()[0].scope = getInterpreter().getGlobalScope();
  stateInterpreter.appendCode(latestCode);

  setStatesInterpreterRunning(true);

  runner_ = function () {
    if (stateInterpreter) {
      try {
        stateInterpreter.step();
        setTimeout(runner_, 1);
      } catch (error) {
        throwError('Error executing program:\n%e'.replace('%e', error));
        resetInterpreter();
        console.error(error);
      }
    }
  };
  runner_();
};
// Add startEventChecker to the interpreter api.
apiFunctions.push(['startEventChecker', startEventChecker]);

/**
 * Resets the states interpreter
 */
const resetStateInterpreter = function () {
  clearTimeout(runner_);
  runner_ = null;
  setStatesInterpreterRunning(false);
};
onStatusChange.stopped.push(resetStateInterpreter);

/**
 * Initializes the states interpreter.
 * @param {!Blockly.Workspace} ws Root workspace.
 */
export const initStatesInterpreter = function (ws) {
  workspace = ws;
  workspace.addChangeListener(event => {
    if (!(event instanceof Blockly.Events.Ui)) {
      // Something changed. Parser needs to be reloaded.
      generateCode();
    }
  });
};
