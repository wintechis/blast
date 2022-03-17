/**
 * Gets the active slot of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getActiveSlot(
  webBluetoothId: BluetoothDevice.id
): Promise<number>;

/**
 * Sets the active slot of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} slot The slot to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function setActiveSlot(
  webBluetoothId: BluetoothDevice.id,
  slot: number
): Promise<void>;

/**
 * Gets the advertising interval of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getAdvertisingInterval(
  webBluetoothId: BluetoothDevice.id
): Promise<number>;

/**
 * Sets the advertising interval of currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} interval The advertising interval to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function setAdvertisingInterval(
  webBluetoothId: BluetoothDevice.id,
  interval: number
): Promise<void>;

/**
 * Gets the TX power level of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getTxPowerLevel(
  webBluetoothId: BluetoothDevice.id
): Promise<number>;

/**
 * Sets the TX power level of currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} txPowerLevel The TX power level to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function setTxPowerLevel(
  webBluetoothId: BluetoothDevice.id,
  txPowerLevel: number
): Promise<void>;

/**
 * Gets the advertised TX power of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getAdvertisedTxPower(
  webBluetoothId: BluetoothDevice.id
): Promise<number>;

/**
 * Sets the advertised TX power level of currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} txPowerLevel The TX power level to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function setAdvertisedTxPower(
  webBluetoothId: BluetoothDevice.id,
  advertisedTxPower: number
): Promise<void>;

/**
 * Gets the lock state of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getLockState(
  webBluetoothId: BluetoothDevice.id
): Promise<string>;

/**
 * Gets the public ECDH Key of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getPublicECDHKey(
  webBluetoothId: BluetoothDevice.id
): Promise<string>;

/**
 * Gets the advertising data of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export function getAdvertisingData(
  webBluetoothId: BluetoothDevice.id
): Promise<string>;

/**
 * Sets the advertising data of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {string} data The data to set.
 */
export function setAdvertisingData(
  webBluetoothId: BluetoothDevice.id,
  data: string
): Promise<void>;

/**
 * Reads an Eddystone property from a bluetooth device.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {String} property The property to read.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
export function readEddystoneProperty(
  webBluetoothId: BluetoothDevice.id,
  property: string
): Promise<string>;

/**
 * Writes an Eddystone property to a bluetooth device.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {String} property The property to write.
 * @param {String} value The value to write.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
export function writeEddystoneProperty(
  webBluetoothId: BluetoothDevice.id,
  property: string,
  value: string
): Promise<void>;
