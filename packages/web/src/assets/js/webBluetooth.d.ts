import {implementedThing} from './things';

/**
 * Optional serviceUUIDs to scan for.
 */
export const optionalServices: BluetoothServiceUUID[];

/**
 * Tracks blocks in the workspace requiring a LE Scan.
 */
export const blocksRequiringScan: Array<Blockly.Block.id>;

/**
 * Contains the results of a LE Scan.
 */
export let LEScanResults: {
  [key: string]: Array<BluetoothAdvertisingEvent>;
};

/**
 * Pairs a Bluetooth device.
 * @param thing information about the device to pair.
 * @param options An object that sets options for the device request.
 * @return A Promise to a BluetoothDevice object.
 */
export async function requestDevice(
  thing: implementedThing,
  options?: RequestDeviceOptions
): Promise<BluetoothDevice>;

/**
 * Returns a paired bluetooth device by their id.
 */
export async function getDeviceById(id: string): Promise<BluetoothDevice>;

/**
 * Writes data to Bluetooth device using the gatt protocol.
 * @param id identifier of the device to write to.
 * @param serviceUUID identifier of the service.
 * @param characteristicUUID identifier of the characteristic.
 * @param value hex value to write.
 * @returns A Promise to void.
 */
export async function writeWithoutResponse(
  id: BluetoothDevice.id,
  serviceUUID: BluetoothServiceUUID,
  characteristicUUID: BluetoothCharacteristicUUID,
  value: string
): Promise<void>;

/**
 * Writes data to Bluetooth device using the gatt protocol.
 * @param id identifier of the device to write to.
 * @param serviceUUID identifier of the service.
 * @param characteristicUUID identifier of the characteristic.
 * @param value hex value to write.
 * @returns representation of the complete request with response.
 */
export async function writeWithResponse(
  id: BluetoothDevice.id,
  serviceUUID: BluetoothServiceUUID,
  characteristicUUID: BluetoothCharacteristicUUID,
  value: string
): Promise<string>;

/**
 * Returns a promise to the BluetoothRemoteGATTCharacteristic offered by
 * the bluetooth device for a specified BluetoothServiceUUID and
 * BluetoothCharacteristicUUID.
 * @param {BluetoothDevice.id} id identifier of the device to get the characteristic from.
 * @param {BluetoothServiceUUID} serviceUUID identifier of the service.
 * @param {BluetoothCharacteristicUUID} characteristicUUID identifier of the characteristic.
 * @returns {Promise<BluetoothRemoteGATTCharacteristic>} A BluetoothRemoteGATTCharacteristic object.
 */
export async function getCharacteristic(
  id: BluetoothDevice.id,
  serviceUUID: BluetoothServiceUUID,
  characteristicUUID: BluetoothCharacteristicUUID
): Promise<BluetoothRemoteGATTCharacteristic>;

/**
 * Reads data from Bluetooth device using the gatt protocol.
 * @param id identifier of the device to read from.
 * @param serviceUUID identifier of the service.
 * @param characteristicUUID identifier of the characteristic.
 * @returns representation of the complete request with response.
 */
export async function read(
  id: BluetoothDevice.id,
  serviceUUID: BluetoothServiceUUID,
  characteristicUUID: BluetoothCharacteristicUUID
): Promise<DataView>;

/**
 * Reads a text (UTF-8) characteristic value from a Bluetooth device.
 * @param id identifier of the device to read from.
 * @param serviceUUID identifier of the service.
 * @param characteristicUUID identifier of the characteristic.
 * @returns A Promise to a string.
 */
export async function readText(
  id: BluetoothDevice.id,
  serviceUUID: BluetoothServiceUUID,
  characteristicUUID: BluetoothCharacteristicUUID
): Promise<string>;

/**
 * Reads a nummerical characteristic value from a Bluetooth device.
 * @param id identifier of the device to read from.
 * @param serviceUUID identifier of the service.
 * @param characteristicUUID identifier of the characteristic.
 * @returns A Promise to a number.
 */
export async function readNumber(
  id: BluetoothDevice.id,
  serviceUUID: BluetoothServiceUUID,
  characteristicUUID: BluetoothCharacteristicUUID
): Promise<number>;

/**
 * Reads a hexadecimal characteristic value from a Bluetooth device.
 * @param id identifier of the device to read from.
 * @param serviceUUID identifier of the service.
 * @param characteristicUUID identifier of the characteristic.
 * @returns A Promise to a string.
 */
export async function readHex(
  id: BluetoothDevice.id,
  serviceUUID: BluetoothServiceUUID,
  characteristicUUID: BluetoothCharacteristicUUID
): Promise<string>;

/**
 * Subscribes to a Bluetooth characteristic and adds an event listener.
 * @param id identifier of the device to read from.
 * @param serviceUUID identifier of the service.
 * @param characteristicUUID identifier of the characteristic.
 * @param handler function to call on notifications.
 * @returns A Promise to void.
 */
export async function subscribe(
  id: BluetoothDevice.id,
  serviceUUID: BluetoothServiceUUID,
  characteristicUUID: BluetoothCharacteristicUUID,
  handler: Function
): Promise<void>;

/**
 * Unsubscribes from a Bluetooth characteristic.
 * @param id identifier of the device to read from.
 * @param serviceUUID identifier of the service.
 * @param characteristicUUID identifier of the characteristic.
 * @param handler function to call on notifications.
 * @returns A Promise to void.
 */
export async function unsubscribe(
  id: BluetoothDevice.id,
  serviceUUID: BluetoothServiceUUID,
  characteristicUUID: BluetoothCharacteristicUUID,
  handler: Function
): Promise<void>;

/**
 * Starts an LE Scan for 30 seconds.
 */
export function startLEScan(): Promise<void>;

/**
 * Stops the LE Scan
 */
export function stopLEScan(): void;
