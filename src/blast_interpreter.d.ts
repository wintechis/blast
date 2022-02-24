/**
 * Instance of the JS Interpreter.
 * @type {?Interpreter}
 */
export let interpreter: Interpreter | null;

/**
 * Getter for the interpreter.
 * @return {Interpreter} the interpreter.
 */
export function getInterpreter(): Interpreter;

/**
 * Array of tuples, containg names and functions defined in the things folder,
 * in order to add them to the interpreter API in {@link initAPI}.
 * @type {Array<{name: string, func: function}>}
 */
export const apiFunctions: Array<{name: string; func: function}>;

/**
 * Getter for interrupted.
 * @return {boolean} interrupted
 */
export function getInterrupted(): boolean;

/**
 * Setter for interrupted.
 * @param {boolean} val value to set.
 */
export function setInterrupted(val: boolean): void;

/**
 * Enum for Blast status
 * @enum {string}
 */
export const statusValues: {
  READY: string;
  RUNNING: string;
  STOPPED: string;
  ERROR: string;
};

/**
 * Stores functions to be invoked when status changes.
 */
export const onStatusChange: {
  [key: string]: Array<() => void>;
};

/**
 * Getter for latestCode.
 * @return {string} latestCode
 */
export function getLatestCode(): string;

/**
 * Gets the workspace
 * @return {Blockly.Workspace} the workspace
 */
export function getWorkspace(): Blockly.Workspace;

/**
 * Sets the workspace
 * @param {Blockly.Workspace} ws the workspace
 */
export function setWorkspace(ws: Blockly.Workspace): void;

/**
 * Array containing all interval events.
 */
export const intervalEvents: Array<!NodeJS.Timer>;

/**
 * Tracks event blocks currently in the workspace,
 * in order to run indefinately if in case there are any.
 */
export const eventsInWorkspace: Array<!Blockly.Block.id>;

/**
 * Stores event handlers of webHID devices, in order to remove them on code completion.
 */
export let deviceEventHandlers: Array<
  !{device: HIDDevice; type: string; fn: function}
>;

/**
 * Adds a function to be invoked when the interpreter is stopped.
 * @param {function} fn function to add.
 */
export function addCleanUpFunction(fn: function): void;

/**
 * Setter for statesInterpreterRunning.
 * @param {boolean} val value to set.
 */
export function setStatesInterpreterRunning(val: boolean): void;

/**
 * Setter for the Interpreter's standard input function
 * @param {function} fn new stdIn function
 */
export function setStdIn(fn: function): void;

/**
 * Getter for the Interpreter's standard input function.
 * @return {function} stdOut
 */
export function getStdIn(): function;

/**
 * Setter for the Interpreter's standard output function.
 * @param {function} fn the stdEut function.
 */
export function setStdOut(fn: function): void;

/**
 * Getter for the Interpreter's standard output function.
 * @return {function} the stdOut function.
 */
export function getStdOut(): function;

/**
 * Setter for the Interpreter's standard info output function.
 * @param {function} fn the stdInfo function.
 */
export function setStdInfo(fn: function): void;

/**
 * Getter for the Interpreter's standard info output function.
 * @return {function} the stdInfo function.
 */
export function getStdInfo(): function;

/**
 * Setter for the Interpreter's standard error output function.
 * @param {function} fn the stdErr function.
 */
export function setStdErr(fn: function): void;

/**
 * Getter for the Interpreter's standard error output function.
 * @return {function} the stdErr function.
 */
export function getStdErr(): function;

/**
 * Reset the JS Interpreter.
 */
export function resetInterpreter(): void;

/**
 * Stop the JavaScript execution.
 */
export function stopJS(): void;

/**
 * Stop execution and adds an error message to the
 * {@link Blast.Ui.messageOutputContainer}.
 * @param {string=} text optional, a custom error text
 */
export function throwError(text?: string): void;

/**
 * Generate JavaScript Code for the user's block-program.
 */
export function generateCode(): void;

/**
 * Initializes the JS Interpreter.
 * @param {Blockly.workspace} ws the workspace
 */
export function initInterpreter(ws: Blockly.Workspace): void;

/**
 * Execute the user's code.
 */
export function runJS(): void;
