/**
 * @fileoverview JavaScript code generators for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {asyncApiFunctions} from '../../blast_interpreter.js';
import {LEScanResults} from '../../blast_webBluetooth.js';
import {startLEScan} from '../../blast_webBluetooth.js';
import {throwError} from '../../blast_interpreter.js';


/**
 * Generates JavaScript code for the get_temperature block.
 * @param {Blockly.Block} block the get_temperature block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['read_ruuvi_property'] = function(block) {
  const measurement = Blockly.JavaScript.quote_(block.getFieldValue('measurement'));
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  const code = `getRuuviProperty(${measurement}, ${thing})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Fetches the selected measurement from a RuuviTag.
 * @param {String} measurement the measurement to fetch.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a RuuviTag.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const getRuuviProperty = async function(measurement, webBluetoothId, callback) {
/**
 * Parses a raw RuuviTag data string.
 * @param {String} manufacturerDataString the raw data string.
 * @returns {Object} the parsed data.
 */
  const parseRawRuuvi = function(manufacturerDataString) {
    const robject = {};
    const data = manufacturerDataString;
    const dataFormat = data[0] & 0xFF;
    let temperature = (data[1] << 8 | data[2] & 0xFF);
    if (temperature > 32767) {
      temperature -= 65535;
    }
    temperature /= 200.0;
    const humidity = ((data[3] & 0xFF) << 8 | data[4] & 0xFF) / 400.0;
    const pressure = ((data[5] & 0xFF) << 8 | data[6] & 0xFF) + 50000;
    const accelerationX = (data[7] << 8 | data[8] & 0xFF) / 1000.0;
    const accelerationY = (data[9] << 8 | data[10] & 0xFF) / 1000.0;
    const accelerationZ = (data[11] << 8 | data[12] & 0xFF) / 1000.0;
    const powerInfo = (data[13] & 0xFF) << 8 | data[14] & 0xFF;
    const batteryVoltage = (powerInfo >>> 5) / 1000.0 + 1.6;
    const txPower = (powerInfo & 0b11111) * 2 - 40;
    const movementCounter = data[15] & 0xFF;
    const measurementSequenceNumber = (data[16] & 0xFF) << 8 | data[17] & 0xFF;

    robject.destination_endpoint = dataFormat;
    robject.temperature = temperature;
    robject.humidity = humidity;
    robject.pressure = pressure;
    robject.accelerationX = accelerationX;
    robject.accelerationY = accelerationY;
    robject.accelerationZ = accelerationZ;
    robject.batteryVoltage = batteryVoltage;
    robject.txPower = txPower;
    robject.movementCounter = movementCounter;
    robject.measurementSequenceNumber = measurementSequenceNumber;

    return robject;
  };

  /**
   * Tries getting the measurements from the RuuviTag.
   * @param {Number} tries the number of tries.
   * @returns {DataView} the measurements.
   */
  const getAdvertisementData = function(tries) {
    // try to get the measurements from the cache once per second for 10 seconds
    if (tries < 30) {
      const events = LEScanResults[webBluetoothId];
      if (events) {
        for (const event of events) {
          const value = event.manufacturerData.get(0x0499);
          if (value) {
            const dataFormat = value.getUint8(0);
            if (dataFormat == 5) {
              return value; // advertisement found, break out of the loop
            }
          }
        }
      }
      // no measurements found, try again in 1 second
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getAdvertisementData(tries + 1));
        }, 1000);
      });
    }
  };
  // Start LE Scan.
  startLEScan(webBluetoothId);

  const advertisementData = await getAdvertisementData(0);
  // If still no event data, return an error
  if (!advertisementData) {
    throwError('Timed out. No BLE advertising data found for ' + webBluetoothId);
  }

  // Parse the event data
  const rawValues = [];
  for (let i = 0; i < advertisementData.byteLength; i++) {
    rawValues.push('0x' + ('00' + advertisementData.getUint8(i).toString(16)).slice(-2));
  }
  const values = parseRawRuuvi(rawValues);
  callback(values[measurement]);
};

// add getRuuviProperty function to the interpreter's API.
asyncApiFunctions.push(['getRuuviProperty', getRuuviProperty]);
