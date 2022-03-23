/**
 * @fileoverview JavaScript code generators for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
// eslint-disable-next-line node/no-missing-import
import RuuviTag from './../../things/ruuviTag/RuuviTag.js';
import {asyncApiFunctions} from '../../blast_interpreter.js';

/**
 * Generates JavaScript code for the get_temperature block.
 * @param {Blockly.Block} block the get_temperature block.
 * @returns {String} the generated code.
 */
JavaScript['read_ruuvi_property'] = function (block) {
  const measurement = JavaScript.quote_(block.getFieldValue('measurement'));
  const thing = JavaScript.valueToCode(block, 'Thing', JavaScript.ORDER_ATOMIC);
  const code = `getRuuviProperty(${measurement}, ${thing})`;
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Fetches the selected measurement from a RuuviTag.
 * @param {String} measurement the measurement to fetch.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a RuuviTag.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const getRuuviProperty = async function (
  measurement,
  webBluetoothId,
  callback
) {
  const thing = new RuuviTag(webBluetoothId);
  const value = await thing.readProperty(measurement);
  callback(value);
};

// add getRuuviProperty function to the interpreter's API.
asyncApiFunctions.push(['getRuuviProperty', getRuuviProperty]);
