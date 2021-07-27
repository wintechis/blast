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
Blockly.JavaScript['get_temperature'] = function(block) {
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  const code = `getTemperature(${thing})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Fetches the current temperature measured by the Ruuvi Tag's thermomether
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const getTemperature = async function(webBluetoothId, callback) {
  const devices = await navigator.bluetooth.getDevices();
  let device = null;

  for (const d of devices) {
    if (d.id == webBluetoothId) {
      device = d;
      break;
    }
  }
  if (device == null) {
    Blast.throwError('Error pairing with Bluetooth device.');
  }

  device.gatt.connect()
      .then((server) => {
        return server.getPrimaryService('6e400001-b5a3-f393-e0A9-e50e24dcca9e');
      })
      .then((service) => {
        return service.getCharacteristic(''); // TODO: Find out Temperature Characteristic.
      })
      .then((characteristic) => {
        return characteristic.readValue();
      })
      .then((value) => {
        callback(value);
      })
      .catch((error) => {
        Blast.throwError(error.message);
      });
};

// add getTemperature function to the interpreter's API.
Blast.asyncApiFunctions.push(['getTemperature', getTemperature]);
