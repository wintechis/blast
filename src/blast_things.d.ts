import {Workspace} from 'blockly';

/**
 * Sets the 'pair via webBluetooth' button handler.
 * @param {function} handler The handler to set.
 */
export function setWebBluetoothButtonHandler(
  handler: (options: Object, deviceName?: string) => void
): void;

/**
 * Getter for the thingsLog function.
 * @return {function} The thingsLog function.
 */
export function getThingsLog(): function;

/**
 * Setter for the thingsLog function.
 * @param {function} logFunc The function to use for logging.
 */
export function setThingsLog(
  logFunc: (msg: string, adapter: string, device: string) => void
): void;

/**
 * Resets all device maps.
 */
export function resetThings(): void;

/**
 * Gets the webHID device with the given uid.
 * @param {string} deviceId The uid of the webHID device.
 * @returns {HIDDevice} The webHID device with the given uid.
 */
export function getWebHidDevice(deviceId: HIDDevice.id): HIDDevice;

/**
 * Construct the elements (blocks and buttons) required by the flyout for the
 * things category.
 * @param {!Blockly.Workspace} workspace The workspace containing things.
 * @return {!Array.<!Element>} Array of XML elements.
 */
export function thingsFlyoutCategory(
  workspace: Blockly.Workspace
): Array<?Element>;

/**
 * Returns an Array containing tuples of device names and their identifier.
 * @returns {Array.<string, string>} Array containing tuples of device names and their identifier.
 * @example [['beacon', 'm+JZZGVo+aDUb0a4NOpQWw==']]
 */
export function getWebBluetoothDevices(): Array<string, BluetoothDevice.id>;

/**
 * Returns an Array containing tuples of device names and their identifier.
 * @returns {Array.<string, string>} Array containing tuples of device names and their identifier.
 * @example [['beacon', 'm+JZZGVo+aDUb0a4NOpQWw==']]
 */
export function getWebHIDDevices(): Array<string, string>;

/**
 * Adds a WebBluetooth device to the {@link webBluetoothDevices} map.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {string} deviceName User defined name for the device.
 */
export function addWebBluetoothDevice(
  webBluetoothId: BluetoothDevice.id,
  deviceName: string
): void;

/**
 * Creates user defined identifier to get devices from {@link webHidDevices}.
 * @param {strubg} uid identifier of the device in {@link webHidDevices}.
 * @param {string} deviceName default name for the device.
 * @param {HIDDevice} device the device to add.
 */
export function addWebHidDevice(
  uid: HIDDevice.id,
  deviceName: string,
  device: HIDDevice
): void;
