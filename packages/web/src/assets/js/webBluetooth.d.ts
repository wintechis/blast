/**
 * Optional serviceUUIDs to scan for.
 */
export const optionalServices: BluetoothServiceUUID[];

/**
 * Tracks blocks in the workspace requiring a LE Scan.
 */
export const blocksRequiringScan: Array<Blockly.Block.id>;

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
