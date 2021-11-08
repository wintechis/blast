/**
 * @fileoverview JavaScript code generators for the Xiaomi Mijia thermometer.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/**
 * Generates JavaScript code for the get_mijia_property block.
 * @param {Blockly.Block} block the get_temperature block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['read_mijia_property'] = function(block) {
  const measurement = Blockly.JavaScript.quote_(block.getFieldValue('measurement'));
  const thing = Blockly.JavaScript.valueToCode(block, 'Thing', Blockly.JavaScript.ORDER_ATOMIC);
  
  const code = `readMijiaProperty(${measurement}, ${thing})`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

// Add the thermometer's serviceUUIUD to optionalServices.
const XiaomiServiceUUID = 'ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6';
Blast.Bluetooth.optionalServices.push(XiaomiServiceUUID);

/**
 * Fetches the selected measurement from a RuuviTag.
 * @param {String} measurement the measurement to fetch.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a RuuviTag.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const readMijiaProperty = function async(measurement, webBluetoothId, callback) {
  // make sure a device is connected.
  if (!webBluetoothId) {
    Blast.throwError('No Thermometer is set.');
    callback();
    return;
  }

  /**
   * Handles characteristicvaluechanged events.
   * @param {Event} event the event.
   * @param {String} property the property to fetch.
   */
  const notificationHandler = function(event) {
    const value = event.target.value;
    const sign = value.getUint8(1) & (1 << 7);
    let temp = ((value.getUint8(1) & 0x7F) << 8 | value.getUint8(0));
    if (sign) temp = temp - 32767;
    temp = temp / 100;
    const hum = value.getUint8(2);
    if (measurement === 'temperature') {
      callback(temp);
    } else if (measurement === 'humidity') {
      callback(hum);
    }
  };

  // Subscribe to char
  const characteristicUUID = 'ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6';
  Blast.Bluetooth.gatt_subscribe(
      webBluetoothId, XiaomiServiceUUID, characteristicUUID, notificationHandler);
};

// add readMijiaProperty to the interpreter's API.
Blast.asyncApiFunctions.push(['readMijiaProperty', readMijiaProperty]);
