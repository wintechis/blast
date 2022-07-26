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
 * Array of tuples, containg names and Functions defined in the things folder,
 * in order to add them to the interpreter API in {@link initAPI}.
 * @type {Array<{name: string, func: Function}>}
 */
export const apiFunctions: Array<{name: string; func: Function}>;

/**
 * Interrupts the JS Interpreter.
 */
export function interruptRunner(): void;

/**
 * Continues the JS Interpreter.
 */
export function continueRunner(): void;

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
 * Stores Functions to be invoked when status changes.
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
export const intervalEvents: Array<NodeJS.Timer>;

/**
 * Tracks event blocks currently in the workspace,
 * in order to run indefinately if in case there are any.
 */
export const eventsInWorkspace: Array<Blockly.Block.id>;

/**
 * Stores event handlers of webHID devices, in order to remove them on code completion.
 */
export let deviceEventHandlers: Array<{
  device: HIDDevice;
  type: string;
  fn: Function;
}>;

/**
 * Adds a Function to be invoked when the interpreter is stopped.
 * @param {Function} fn Function to add.
 */
export function addCleanUpFunction(fn: Function): void;

/**
 * Setter for statesInterpreterRunning.
 * @param {boolean} val value to set.
 */
export function setStatesInterpreterRunning(val: boolean): void;

/**
 * Setter for the Interpreter's standard input Function
 * @param {Function} fn new stdIn Function
 */
export function setStdIn(fn: Function): void;

/**
 * Getter for the Interpreter's standard input Function.
 * @return {Function} stdOut
 */
export function getStdIn(): Function;

/**
 * Setter for the Interpreter's standard output Function.
 * @param {Function} fn the stdEut Function.
 */
export function setStdOut(fn: Function): void;

/**
 * Getter for the Interpreter's standard output Function.
 * @return {Function} the stdOut Function.
 */
export function getStdOut(): Function;

/**
 * Setter for the Interpreter's standard info output Function.
 * @param {Function} fn the stdInfo Function.
 */
export function setStdInfo(fn: Function): void;

/**
 * Getter for the Interpreter's standard info output Function.
 * @return {Function} the stdInfo Function.
 */
export function getStdInfo(): Function;

/**
 * Setter for the Interpreter's standard error output Function.
 * @param {Function} fn the stdErr Function.
 */
export function setStdErr(fn: Function): void;

/**
 * Getter for the Interpreter's standard error output Function.
 * @return {Function} the stdErr Function.
 */
export function getStdErr(): Function;

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
