/**
 * @fileoverview JavaScript code generators for the Xiaomi Mijia thermometer.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
// eslint-disable-next-line node/no-missing-import
import XiaomiThermometer from '../../things/xiaomiThermometer/XiaomiThermometer.js';
import {asyncApiFunctions} from './../../blast_interpreter.js';
import {optionalServices} from './../../blast_webBluetooth.js';
import {throwError} from './../../blast_interpreter.js';

/**
 * Generates JavaScript code for the get_mijia_property block.
 * @param {Blockly.Block} block the get_temperature block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['read_mijia_property'] = function (block) {
  const measurement = Blockly.JavaScript.quote_(
    block.getFieldValue('measurement')
  );
  const thing = Blockly.JavaScript.valueToCode(
    block,
    'Thing',
    Blockly.JavaScript.ORDER_ATOMIC
  );

  const code = `readMijiaProperty(${measurement}, ${thing})`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

// Add the thermometer's serviceUUIUD to optionalServices.
const XiaomiServiceUUID = 'ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6';
optionalServices.push(XiaomiServiceUUID);

/**
 * Fetches the selected measurement from a RuuviTag.
 * @param {String} measurement the measurement to fetch.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a RuuviTag.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const readMijiaProperty = async function (
  measurement,
  webBluetoothId,
  callback
) {
  // make sure a device is connected.
  if (!webBluetoothId) {
    throwError('No Thermometer is set.');
    callback();
    return;
  }
  const thing = new XiaomiThermometer(webBluetoothId);
  const value = await thing.readProperty(measurement);
  callback(value);
};

// add readMijiaProperty to the interpreter's API.
asyncApiFunctions.push(['readMijiaProperty', readMijiaProperty]);
