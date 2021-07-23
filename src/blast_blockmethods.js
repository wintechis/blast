/**
 * @fileoverview Methods used by Blast's Blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

// TODO Remove this file?
/**
 * Namespace for methods used by Blast's blocks.
 * @name Blast.BlockMethods
 * @namespace
 */
goog.provide('Blast.BlockMethods');

goog.require('Blast.Ui');
goog.require('Blast.Bluetooth');
goog.require('Blast.States');
goog.require('Blast.Things.ConsumedThing.BLE_RGB_LED_controller');

/**
 * Sets a timeout of timeInSeconds.
 * @param {*} timeInSeconds time in seconds to wait
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.waitForSeconds = function(timeInSeconds, callback) {
  setTimeout(callback, timeInSeconds * 1000);
};

/**
 * Add an event to the Event interpreter.
 * @param {string} conditions the state conditions.
 * @param {string} statements code to be executed if condtions are true.
 * @param {Blockly.Block.id} blockId id of the state defintion block.
 * @public
 */
Blast.BlockMethods.addEvent = function(conditions, statements, blockId) {
  Blast.States.addEvent(conditions, statements, blockId);
};

/**
 * Generates and returns a random integer between a and b, inclusively.
 * @param {number} a lower limit.
 * @param {number} b upper limit.
 * @return {number} generated random number.
 * @public
 */
Blast.BlockMethods.numberRandom = function(a, b) {
  if (a > b) {
    // Swap a and b to ensure a is smaller.
    const c = a;
    a = b;
    b = c;
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
};
