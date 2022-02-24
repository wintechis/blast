/**
 * Gets the active slot of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getActiveSlot(webBluetoothId: string): Promise<number>;

/**
 * Sets the active slot of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} slot The slot to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function setActiveSlot(
  webBluetoothId: string,
  slot: number
): Promise<void>;

/**
 * Gets the advertising interval of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getAdvertisingInterval(webBluetoothId: string): Promise<number>;

/**
 * Sets the advertising interval of currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} interval The advertising interval to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function setAdvertisingInterval(
  webBluetoothId: string,
  interval: number
): Promise<void>;

/**
 * Gets the TX power level of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getTxPowerLevel(webBluetoothId: string): Promise<number>;

/**
 * Sets the TX power level of currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} txPowerLevel The TX power level to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function setTxPowerLevel(
  webBluetoothId: string,
  txPowerLevel: number
): Promise<void>;

/**
 * Gets the advertised TX power of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getAdvertisedTxPower(webBluetoothId: string): Promise<number>;

/**
 * Sets the advertised TX power level of currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} txPowerLevel The TX power level to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function setAdvertisedTxPower(
  webBluetoothId: string,
  advertisedTxPower: number
): Promise<void>;

/**
 * Gets the lock state of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getLockState(webBluetoothId: string): Promise<string>;

/**
 * Gets the public ECDH Key of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getPublicECDHKey(webBluetoothId: string): Promise<string>;

/**
 * Gets the advertising data of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getAdvertisingData(webBluetoothId: string): Promise<string>;

/**
 * Sets the advertising data of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {string} data The data to set.
 */
export function setAdvertisingData(
  webBluetoothId: string,
  data: string
): Promise<void>;

/**
 * Reads an Eddystone property from a bluetooth device.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {String} property The property to read.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
export function readEddystoneProperty(
  webBluetoothId: string,
  properly: string
): Promise<string>;

/**
 * Writes an Eddystone property to a bluetooth device.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {String} property The property to write.
 * @param {String} value The value to write.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
export function writeEddystoneProperty(
  webBluetoothId: string,
  property: string,
  value: string
): Promise<void>;
