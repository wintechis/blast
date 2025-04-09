/**
 * @fileoverview defines helper functions for the JS Interpreter and its API.
 * (https://github.com/NeilFraser/JS-Interpreter)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Events, WorkspaceSvg} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import './initContent/blocks/index.js';
import './initContent/generators/index';

export type statusValues = 'ready' | 'running' | 'stopped' | 'error';

/**
 * Stores the current status of the interpreter, set through {@link setStatus}.
 */
let status: statusValues = 'ready';

/**
 * Stores functions to be invoked when status changes.
 */
// @eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const onStatusChange: Record<statusValues, Function[]> = {
  ready: [],
  running: [],
  stopped: [],
  error: [],
};

/**
 * Getter for status.
 */
export const getStatus = function (): statusValues {
  return status;
};

/**
 * Sets the current status of the interpreter.
 */
export const setStatus = function (newStatus: statusValues) {
  if (status !== newStatus) {
    status = newStatus;
    for (const func of onStatusChange[status]) {
      func();
    }
  }
};

/**
 * latest JavaScript code generated by Blast.
 */
let latestCode = '';

/**
 * Getter for latestCode.
 */
export const getLatestCode = function (): string {
  return latestCode;
};

/**
 * Blast's main workspace.
 */
let workspace: WorkspaceSvg | null = null;

/**
 * this.props.imports + s the workspace
 */
export const getWorkspace = function (): WorkspaceSvg | null {
  return workspace;
};

/**
 * Sets the workspace
 */
export const setWorkspace = function (ws: WorkspaceSvg): void {
  workspace = ws;
};

/**
 * Array containing all interval events.
 */
export const intervalEvents: string[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).intervalEvents = intervalEvents;

/**
 * Tracks event blocks currently in the workspace,
 * in order to run indefinately if there are any.
 */
export const eventsInWorkspace: string[] = [];

/**
 * Stores functions to invoke to reset, when the interpreter is stopped.
 */
// @eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const cleanUpFunctions: Function[] = [];

/**
 * Adds a function to {@link cleanUpFunctions} to be invoked when the interpreter
 */
// @eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const addCleanUpFunction = function (fn: Function) {
  cleanUpFunctions.push(fn);
};

/**
 * Defines the Interpreters standard info output function.
 */
let stdInfo: (text: string) => void = console.log;

/**
 * Setter for the Interpreter's standard info output function.
 */
export const setStdInfo = function (fn: (text: string) => void) {
  stdInfo = fn;
};

/**
 * Getter for the Interpreter's standard info output function.
 */
export const getStdInfo = function (): (text: string) => void {
  return stdInfo;
};

let stdWarn: (text: string) => void = console.warn;

/**
 * Setter for the Interpreter's standard warning output function.
 */
export const setStdWarn = function (fn: (text: string) => void) {
  stdWarn = fn;
};

/**
 * Getter for the Interpreter's standard warning output function.
 */
export const getStdWarn = function (): (text: string) => void {
  return stdWarn;
};

JavaScript.STATEMENT_PREFIX =
  'if (interpreterExecutionExit === true) {return;}\nhighlightBlock(%1);\n';

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
 */
export const resetInterpreter = async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (window as any).resetServient();
  clearIntervalEvents();
  getWorkspace()?.highlightBlock(null);

  for (const func of cleanUpFunctions) {
    func();
  }
};

/**
 * Stop the JavaScript execution.
 */
export const stopJS = function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any)['interpreterExecutionExit'] = true;
  resetInterpreter();
  setStatus('stopped');
  stdInfo('execution stopped');
};

/**
 * Generate JavaScript Code for the user's block-program.
 */
const generateCode = function () {
  if (!workspace) {
    return;
  }
  // Generate JavaScript code and parse it.
  latestCode = workspaceToCode(workspace);
};

/**
 * Generate code for all blocks in the workspace to the specified language.
 */
const workspaceToCode = function (ws?: WorkspaceSvg): string {
  if (!ws) {
    // Backwards compatibility from before there could be multiple workspaces.
    console.warn('No workspace specified in workspaceToCode call.  Guessing.');
    if (workspace) {
      ws = workspace;
    } else {
      return '';
    }
  }
  const code: string[] = [];
  JavaScript.init(ws);
  JavaScript.imports_ = Object.create(null);
  JavaScript.functionNames_ = Object.create(null);
  JavaScript.priority_ = Object.create(null);
  JavaScript.things_ = Object.create(null);
  JavaScript.handlers = Object.create(null);
  const blocks = ws.getTopBlocks(true);
  // Generate code for state_definition, event and every_seconds blocks first.
  for (const block of blocks) {
    if (
      block.type === 'event' ||
      block.type === 'state_definition' ||
      block.type === 'every_seconds'
    ) {
      const line = JavaScript.blockToCode(block);
      code.push(line);
    }
  }
  // Generate code for remaining blocks.
  for (const block of blocks) {
    if (
      block.type === 'event' ||
      block.type === 'state_definition' ||
      block.type === 'every_seconds'
    ) {
      continue;
    }
    let line = JavaScript.blockToCode(block);
    if (Array.isArray(line)) {
      // Value blocks return tuples of code and operator order.
      // Top-level blocks don't care about operator order.
      line = line[0];
    }
    if (line) {
      if (block.outputConnection) {
        // This block is a naked value.  Ask the language's code generator if
        // it wants to append a semicolon, or something.
        line = JavaScript.scrubNakedValue(line);
        if (JavaScript.STATEMENT_PREFIX && !block.suppressPrefixSuffix) {
          line = JavaScript.injectId(JavaScript.STATEMENT_PREFIX, block) + line;
        }
        if (JavaScript.STATEMENT_SUFFIX && !block.suppressPrefixSuffix) {
          line = line + JavaScript.injectId(JavaScript.STATEMENT_SUFFIX, block);
        }
      }
      code.push(line);
    }
  }
  let codeString = code.join('\n'); // Blank line between each section.
  codeString = JavaScript.finish(codeString);
  // Final scrubbing of whitespace.
  codeString = codeString.replace(/^\s+\n/, '');
  codeString = codeString.replace(/\n\s+$/, '\n');
  codeString = codeString.replace(/[ \t]+\n/g, '\n');
  return codeString;
};

/**
 * Initializes the JS Interpreter.
 */
export const initInterpreter = function (ws: WorkspaceSvg) {
  workspace = ws;

  // Load the interpreter now, and upon future changes.
  generateCode();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workspace.addChangeListener((e: any) => {
    if (!(e instanceof Events.UiBase)) {
      // Something changed. Parser needs to be reloaded.
      generateCode();
    }
  });
};

/**
 * Execute the user's code.
 */
export const runJS = async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any)['interpreterExecutionExit'] = false;
  setStatus('running');
  stdInfo('execution started');
  try {
    // workaround for async functions on webpack, see
    // https://github.com/SimulatedGREG/electron-vue/issues/777
    const AsyncFunction = new Function(
      'return Object.getPrototypeOf(async function(){}).constructor'
    )();
    const func = new AsyncFunction(
      'f',
      `${latestCode}
      if(${eventsInWorkspace.length === 0} && ${
        intervalEvents.length === 0
      }) {f()};`
    );
    await func(stopJS);
  } catch (e) {
    stopJS();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any)['interpreterExecutionExit'] = true;
    resetInterpreter();
    setStatus('error');
    console.error(e);
  }
};

/**
 * Overwrite JavaScript generator to add imports.
 */
JavaScript.imports_ = Object.create(null);
JavaScript.functionNames_ = Object.create(null);
JavaScript.priority_ = Object.create(null);
JavaScript.things_ = Object.create(null);
JavaScript.handlers = Object.create(null);
const origFinish = JavaScript.finish;
JavaScript.finish = function (code: string) {
  // Convert the imports dictionary into a list.
  const imports = Object.values(JavaScript.imports_);
  const priority = Object.values(JavaScript.priority_);
  const things = Object.values(JavaScript.things_);
  if (things.length > 0) {
    things.unshift('const things = new Map();');
  }
  const handlers = Object.values(JavaScript.handlers);
  // Call Blockly.CodeGenerator's finish.
  code = origFinish.apply(JavaScript, [code]);
  return (
    imports.join('\n') +
    '\n\n' +
    priority.join('\n') +
    '\n' +
    things.join('\n') +
    '\n' +
    handlers.join('\n') +
    '\n' +
    code
  );
};
