import {writeWithResponse} from './blast_webBluetooth';

/**
 * Optional serviceUUIDs to scan for.
 */
export const optionalServices: BluetoothServiceUUID[];

/**
 * Contains block types that require a LE Scan.
 * On runtine, if any of these blocks is in the workspace,
 * the LE Scan will be requested and results cached in {@link Blast.Bluetooth.LEScanResults}.
 */
export const scanBlocks: string[];

/**
 * Contains the results of a LE Scan.
 */
export let LEScanResults: {
  [key: string]: Array<BluetoothAdvertisingEvent>;
};

/**
 * Pairs a Bluetooth device.
 * @param options An object that sets options for the device request.
 * @param deviceName optional, user-defined name for the device to pair.
 * @return A Promise to a BluetoothDevice object.
 */
export async function requestDevice(
  options: RequestDeviceOptions,
  deviceName?: string
): Promise<BluetoothDevice>;

/**
 * Returns a paired bluetooth device by their id.
 */
export function getDeviceById(id: string): BluetoothDevice;

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
): Promise<string>;

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
 * Starts an LE Scan for 30 seconds.
 */
export async function startLEScan(): void;
