/**
 * @fileoverview JavaScript code generators for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/**
 * Generates JavaScript code for the get_temperature block.
 * @param {Blockly.Block} block the get_temperature block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['read_ruuvi_property'] = function(block) {
  const measurement = block.getFieldValue('measurement');
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  const code = `getRuuviProperty('${measurement}', ${thing})`;
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

  let value;
  let tries = 0;
  // Try getting advertisement data, retry once per second for 30 seconds
  while (tries < 30) {
    const events = Blast.Bluetooth.LEScanResults[webBluetoothId];
    if (events) {
      for (const event of events) {
        value = event.manufacturerData.get(0x0499);
        if (value) {
          const dataFormat = value.getUint8(0);
          if (dataFormat == 5) {
            tries = 30; // advertisement found, break out of the loop
          }
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    tries++;
  }
  // If still no event data, return an error
  if (!value) {
    Blast.throwError('No BLE advertising data found for ' + webBluetoothId);
  }

  // Parse the event data
  const rawValues = [];
  for (let i = 0; i < value.byteLength; i++) {
    rawValues.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
  }
  const values = parseRawRuuvi(rawValues);
  callback(values[measurement]);
};

// add get_ruuvi_measurement function to the interpreter's API.
Blast.asyncApiFunctions.push(['getRuuviProperty', getRuuviProperty]);
