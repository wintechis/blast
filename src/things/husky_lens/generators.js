/**
 * @fileoverview Generates JavaScript for the Huskylens
 * (https://github.com/knight-arturia/Arduino_MKR1010).
 * @author knight.arturia@gmail.com(Yongxu Ren)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/**
   * Generates JavaScript code for Huskylens.
   * @returns {String} the generated code.
   */

Blockly.JavaScript['huskylens'] = function() {
  // TODO: Assemble JavaScript into code variable.
  const code = 'getMokeID()';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

const getMokeID = function() {
  return Math.floor(Math.random() * 10);
};

// Add getMokeID function to the interpreter's API.
Blast.apiFunctions.push(['getMokeID', getMokeID]);
