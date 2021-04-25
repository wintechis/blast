/**
 * @fileoverview Class representing a BLE RGB LED controller, see
 * https://github.com/arduino12/ble_rgb_led_strip_controller.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
goog.provide('Blast.Things.ConsumedThing.BLE_RGB_LED_controller');

goog.require('Blast.Things.ConsumedThing');

/**
 * Class representing a BLE RGB LED controller.
 * @param {String} mac mac address of this LED controller.
 * @constructor
 * @implements {ConsumedThing}
 */
Blast.Things.ConsumedThing.BLE_RGB_LED_controller = function(mac) {
  this.mac = mac;
};

Blast.Things.ConsumedThing.BLE_RGB_LED_controller.prototype.switchLights = async function(value) {
  if (Blast.Bluetooth.identifiers == 'handle') {
    const handle = '0009';
    await this.writePropertyByHandle(handle, value);
  } else {
    const serviceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
    const characteristicUUID = '0000fff3-0000-1000-8000-00805f9b34fb';
    await this.writePropertyByUUID(serviceUUID, characteristicUUID, value);
  }
};

Blast.Things.ConsumedThing.BLE_RGB_LED_controller.prototype.writePropertyByHandle =
async function(handle, value, options) {
  const mac = this.mac;
  await Blast.Bluetooth.connect(mac);
  await Blast.Bluetooth.gatt_writeWithoutResponse(mac, handle, 'xsd:hexBinary', value, 1500);
  await Blast.Bluetooth.disconnect(mac);
  return;
};

Blast.Things.ConsumedThing.BLE_RGB_LED_controller.prototype.writePropertyByUUID =
async function(serviceUUID, characteristcUUID, value, options) {
  const mac = this.mac;
  await Blast.Bluetooth.gatt_writeWithoutResponse(mac, serviceUUID, characteristcUUID, value);
  return;
};
