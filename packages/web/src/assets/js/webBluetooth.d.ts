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
 */
export function requestDevice(
  thing: implementedThing,
  options?: RequestDeviceOptions
): Promise<BluetoothDevice>;

/**
 * Returns a paired bluetooth device by their id.
 */
export function getDeviceById(id: string): Promise<BluetoothDevice>;

/**
 * Starts an LE Scan for 30 seconds.
 */
export function startLEScan(): Promise<void>;

/**
 * Stops the LE Scan
 */
export function stopLEScan(): void;
