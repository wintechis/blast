/**
 * @fileoverview defines helper functions for the JS Interpreter and its API.
 * (https://github.com/NeilFraser/JS-Interpreter)
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

import Blockly from 'blockly';

const {Events} = Blockly;

/**
 * Instance of the JS Interpreter.
 * @type {?Interpreter}
 * @public
 */
export let interpreter = null;

/**
 * Getter for the interpreter.
 * @return {Interpreter} the interpreter.
 */
export const getInterpreter = function () {
  return interpreter;
};

/**
 * Array of tuples, containg names and functions defined in the things folder,
 * in order to add them to the interpreter API in {@link initAPI}.
 * @public
 * @type {Array<{name: string, func: function}>}
 */
export const apiFunctions = [];

/**
 * Array of tuples, containg names and asynchronous functions defined in the
 * things folder, in order to add them to the interpreter API in {@link initAPI}.
 * @type {Array<{name: string, func: function}>}
 * @public
 */
export const asyncApiFunctions = [];

/**
 * Indicates wheter BLAST is current interrupted.
 * @type {boolean}
 * @public
 */
let interrupted = false;

/**
 * Getter for interrupted.
 * @return {boolean} interrupted
 */
export const getInterrupted = function () {
  return interrupted;
};

/**
 * Setter for interrupted.
 * @param {boolean} val value to set.
 */
export const setInterrupted = function (val) {
  interrupted = val;
};
apiFunctions.push(['setInterrupted', setInterrupted]);

/**
 * Enum for Blast status
 * @enum {string}
 * @public
 */
export const statusValues = {
  READY: 'ready',
  RUNNING: 'running',
  STOPPED: 'stopped',
  ERROR: 'error',
};

/**
 * Stores the current status of the interpreter, set through {@link setStatus}.
 */
let status = statusValues.READY;

/**
 * Stores functions to be invoked when status changes.
 */
export const onStatusChange = {ready: [], running: [], stopped: [], error: []};

/**
 * Sets the current status of the interpreter.
 * @param {string} newStatus new status.
 */
const setStatus = function (newStatus) {
  if (status !== newStatus) {
    status = newStatus;
    for (const func of onStatusChange[status]) {
      func();
    }
  }
};

/**
 * latest JavaScript code generated by Blast.
 * @type {string}
 * @public
 */
let latestCode = '';

/**
 * Getter for latestCode.
 * @return {string} latestCode
 */
export const getLatestCode = function () {
  return latestCode;
};

/**
 * Instance of runner function.
 * @type {?function}
 * @private
 */
let runner_ = null;

/**
 * Blast's main workspace.
 * @type {Blockly.workspaceSvg}
 * @public
 */
let workspace = null;

/**
 * Gets the workspace
 * @return {Blockly.Workspace} the workspace
 */
export const getWorkspace = function () {
  return workspace;
};

/**
 * Sets the workspace
 * @param {Blockly.Workspace} ws the workspace
 */
export const setWorkspace = function (ws) {
  workspace = ws;
};

/**
 * Array containing all interval events.
 * @type {!Array<!Number>}
 */
export const intervalEvents = [];

/**
 * Tracks event blocks currently in the workspace,
 * in order to run indefinately if in case there are any.
 * @type {!Array<!Blockly.Block.id>}
 */
export const eventsInWorkspace = [];

/**
 * Stores event handlers of webHID devices, in order to remove them on code completion.
 * @type {!Array<{device: HIDDevice, type: string, fn: function}>}
 */
export let deviceEventHandlers = [];

/**
 * Stores functions to invoke to reset, when the interpreter is stopped.
 */
const cleanUpFunctions = [];

/**
 * Adds a function to {@link cleanUpFunctions} to be invoked when the interpreter
 * @param {function} fn function to add.
 */
export const addCleanUpFunction = function (fn) {
  cleanUpFunctions.push(fn);
};

/**
 * Set to true if the States Interpreter is running.
 */
let statesInterpreterRunning = false;

/**
 * Setter for {@link statesInterpreterRunning}.
 * @param {boolean} val value to set.
 */
export const setStatesInterpreterRunning = function (val) {
  statesInterpreterRunning = val;
};

/**
 * Defines the Interpreter's standard input function.
 */
let stdIn = null;

/**
 * Setter for the Interpreter's standard input function
 * @param {function} fn new stdIn function
 */
export const setStdIn = function (fn) {
  stdIn = fn;
};

/**
 * Getter for the Interpreter's standard input function.
 * @return {function} stdOut
 */
export const getStdIn = function () {
  return stdIn;
};

/**
 * Defines the Interpreters standard output.
 */
let stdOut = console.log;

/**
 * Setter for the Interpreter's standard output function.
 * @param {function} fn the stdEut function.
 */
export const setStdOut = function (fn) {
  stdOut = fn;
};

/**
 * Getter for the Interpreter's standard output function.
 * @return {function} the stdOut function.
 */
export const getStdOut = function () {
  return stdOut;
};

/**
 * Defines the Interpreters standard info output function.
 */
let stdInfo = console.log;

/**
 * Setter for the Interpreter's standard info output function.
 * @param {function} fn the stdInfo function.
 */
export const setStdInfo = function (fn) {
  stdInfo = fn;
};

/**
 * Getter for the Interpreter's standard info output function.
 * @return {function} the stdInfo function.
 */
export const getStdInfo = function () {
  return stdInfo;
};

/**
 * Defines the Interpreters standard error output.
 */
let stdErr = console.log;

/**
 * Setter for the Interpreter's standard error output function.
 * @param {function} fn the stdErr function.
 * @public
 */
export const setStdError = function (fn) {
  stdErr = fn;
};

/**
 * Getter for the Interpreter's standard error output function.
 * @return {function} the stdErr function.
 */
export const getStdError = function () {
  return stdErr;
};

/**
 * removes all event handlers of webHID devices from {@link deviceEventHandlers}
 */
const removeDeviceHandlers = function () {
  for (const handler of deviceEventHandlers) {
    const device = handler.device;
    device.removeEventListener(handler.type, handler.fn);
  }
  deviceEventHandlers = [];
};

/**
 * Clears all interval events.
 */
const clearIntervalEvents = function () {
  for (const event of intervalEvents) {
    clearInterval(event);
  }
  intervalEvents.length = 0;
};

/**
 * Reset the JS Interpreter.
 * @public
 */
export const resetInterpreter = function () {
  interpreter = null;
  if (runner_) {
    clearTimeout(runner_);
    runner_ = null;
  }
  removeDeviceHandlers();
  clearIntervalEvents();

  for (const func of cleanUpFunctions) {
    func();
  }
  cleanUpFunctions.length = 0;
};

/**
 * Stop the JavaScript execution.
 * @public
 */
export const stopJS = function () {
  resetInterpreter();
  setStatus(statusValues.STOPPED);
};

/**
 * Stop execution and adds an error message to the
 * {@link Blast.Ui.messageOutputContainer}.
 * @param {string=} text optional, a custom error text
 */
export const throwError = function (text) {
  if (!text) {
    text = 'Error executing program - See console for details.';
  }

  stdErr(text);
  setStatus(statusValues.ERROR);
  resetInterpreter();
  stdInfo('Execution stopped');
};

/**
 * Generate JavaScript Code for the user's block-program.
 * @public
 */
export const generateCode = function () {
  JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  JavaScript.addReservedWords('highlightBlock');
  // Generate JavaScript code and parse it.
  latestCode = '';
  latestCode = JavaScript.workspaceToCode(workspace);
};

/**
 * defines an API for the JS Interpreter.
 * @param {!Interpreter} interpreter interpreter object.
 * @param {!Interpreter.Object} globalObject global scope object.
 */
function initApi(interpreter, globalObject) {
  // Add functions of {@link apiFunctions} to the interpreter.
  for (const f of apiFunctions) {
    // Add function name to reserverd words.
    JavaScript.addReservedWords(f[0]);
    // Add function to global scope.
    interpreter.setProperty(
      globalObject,
      f[0], // the function name
      interpreter.createNativeFunction(f[1]) // the function
    );
  }

  // Add functions of {@link asyncApiFunctions} to the interpreter.
  for (const f of asyncApiFunctions) {
    interpreter.setProperty(
      globalObject,
      f[0], // the function name
      interpreter.createAsyncFunction(f[1]) // the function
    );
  }
}

/**
 * Initializes the JS Interpreter.
 * @param {Blockly.workspace} ws the workspace
 */
export const initInterpreter = function (ws) {
  workspace = ws;

  // Load the interpreter now, and upon future changes.
  generateCode();
  workspace.addChangeListener(event => {
    if (!(event instanceof Events.Ui)) {
      // Something changed. Parser needs to be reloaded.
      generateCode();
    }
  });
};

/**
 * Places a transparent rectangle over the workspace to prevent
 * the user from interacting with the workspace.
 */
const disableWorkspace = function () {
  const workspaceDiv = document.getElementById('content_workspace');
  const rect = document.createElement('div');
  rect.id = 'workspace-disabled';
  rect.style.position = 'absolute';
  rect.style.top = '0';
  rect.style.left = '0';
  rect.style.width = '100%';
  rect.style.height = '100%';
  rect.style.zIndex = '1';
  rect.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
  workspaceDiv.appendChild(rect);
  // de-select current block so that the delete key won't work.
  if (selected) {
    selected.unselect();
  }
};

/**
 * Removes the transparent rectangle over the workspace.
 */
const enableWorkspace = function () {
  const workspaceDiv = document.getElementById('content_workspace');
  const rect = document.getElementById('workspace-disabled');
  if (rect) {
    workspaceDiv.removeChild(rect);
  }
};
onStatusChange.ready.push(enableWorkspace);
onStatusChange.stopped.push(enableWorkspace);
onStatusChange.error.push(enableWorkspace);

/**
 * Execute the user's code.
 */
export const runJS = function () {
  setStatus(statusValues.RUNNING);
  stdInfo('execution started');
  disableWorkspace();

  if (interpreter === null) {
    // Begin execution
    interpreter = new Interpreter(latestCode, initApi);

    /**
     * executes {@link latestCode} using {@link interpreter}.
     * @function runner_
     * @memberof Blast#
     */
    runner_ = function () {
      if (interpreter) {
        try {
          if (interrupted) {
            // Execution is currently interrupted, try again later.
            setTimeout(runner_, 1);
          } else {
            const hasMore = interpreter.step();
            if (hasMore) {
              // Execution is currently blocked by some async call.
              // Try again later.
              setTimeout(runner_, 1);
            } else if (
              statesInterpreterRunning ||
              eventsInWorkspace.length > 0
            ) {
              // eventChecker is running,
              // dont reset UI until stop button is clicked.
            } else {
              // Program is complete.
              setStatus(statusValues.READY);
              stdInfo('execution completed');
              resetInterpreter();
            }
          }
        } catch (error) {
          throwError(error);
          resetInterpreter();
          console.error(error);
        }
      }
    };

    runner_();
  }
};
