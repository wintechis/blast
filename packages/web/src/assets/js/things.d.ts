import {WorkspaceSvg} from 'blockly';

interface GamepadFilter {
  index?: number;
  id?: string;
  connected?: boolean;
  mapping?: string;
  timestamp?: number;
  axes?: number[];
  buttons?: {length: number};
}

export interface implementedThing {
  id: string;
  name: string;
  type: string;
  blocks: {type: string; category: string; XML?: string}[];
  filters?: BluetoothLEScanFilter[] | HIDDeviceFilter[] | GamepadFilter[];
  optionalServices?: string[];
  infoUrl?: string;
  connected?: boolean;
}

interface connectedThing {
  id: string;
  thing: implementedThing;
}

/**
 * Lists all things implemented by BLAST.
 */
export const implementedThings: implementedThing[];

/**
 * Lists all things connected to BLAST identified by their user defined name.
 */
export const connectedThings: Record<string, connectedThing>;

/**
 * Lists all blocks exclusively available in dev mode, as tuples of [blockName, category].
 */
export const devBlocks: [string, string][];

/**
 * Lists all categories exclusively available in dev mode, as triples of [categoryName, colour, index].
 */
export const devCategories: [string, number, number][];

/**
 * Wether development mode is turned on or off.
 */
export let setDevMode: (value: Boolean) => void;

/**
 * Sets the 'pair via webBluetooth' button handler.
 * @param {function} handler The handler to set.
 */
export function setWebBluetoothButtonHandler(
  handler: (options: Object, deviceName?: string) => void
): void;

/**
 * Sets the 'connect via webHid' button handler.
 */
export function setWebHidButtonHandler(
  handler: (options: Object, deviceName?: string) => void
): void;

/**
 * Sets the 'select audio output' button handler.
 */
export function setAudioOutputButtonHandler(
  handler: (options: Object, deviceName?: string) => void
): void;

/**
 * Sets the 'select video input' button handler.
 */
export function setVideoInputButtonHandler(
  handler: (options: Object, deviceName?: string) => void
): void;

/**
 * Getter for the thingsLog function.
 * @return {function} The thingsLog function.
 */
export function getThingsLog(): Function;

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
 */
export function getWebHidDevice(deviceId: string): HIDDevice;

/**
 * Construct the elements (blocks and buttons) required by the flyout for the
 * things category.
 */
export function thingsFlyoutCategory(workspace: WorkspaceSvg): Element[];

/**
 * Returns an Array containing tuples of device names and their identifier.
 * @example [['beacon', 'm+JZZGVo+aDUb0a4NOpQWw==']]
 */
export function getWebBluetoothDevices(): string[][];

/**
 * Returns an Array containing tuples of device names and their identifier.
 * @example [['beacon', 'm+JZZGVo+aDUb0a4NOpQWw==']]
 */
export function getWebHIDDevices(): string[][];

/**
 * Adds a WebBluetooth device to the {@link webBluetoothDevices} map.
 */
export function addWebBluetoothDevice(
  webBluetoothId: string,
  deviceName: string
): void;

/**
 * Creates user defined identifier to get devices from {@link webHidDevices}.
 * @param {strubg} uid identifier of the device in {@link webHidDevices}.
 * @param {string} deviceName default name for the device.
 * @param {HIDDevice} device the device to add.
 * @param {implementedThing} thing the thing to add.
 */
export function addWebHidDevice(
  uid: string,
  deviceName: string,
  device: HIDDevice,
  thing: implementedThing
): void;

/**
 * Connects a WebHidDevice.
 * @param {HIDDeviceFilter} filters The options for the WebHidDevice.
 * @returns {Promise<HIDDevice>} A promise that resolves to the connected WebHidDevice.
 */
export function connectWebHidDevice(filters: HIDDeviceFilter): HIDDevice;

/**
 * Adds a device to BLAST
 */
export function addDevice(
  deviceName: string,
  deviceId: string,
  type: string
): void;
