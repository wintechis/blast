export function getActiveSlot(webBluetoothId: string): Promise<number>;
export function setActiveSlot(webBluetoothId: string, slot: number): Promise<void>;
export function getAdvertisingInterval(webBluetoothId: string): Promise<number>;
export function setAdvertisingInterval(webBluetoothId: string, interval: number): Promise<void>;
export function getTxPowerLevel(webBluetoothId: string): Promise<number>
export function setTxPowerLevel(webBluetoothId: string, txPowerLevel: number): Promise<void>;
export function getAdvertisedTxPower(webBluetoothId: string): Promise<number>;
export function setAdvertisedTxPower(webBluetoothId: string, advertisedTxPower: number): Promise<void>;
export function getLockState(webBluetoothId: string): Promise<string>;
export function getPublicECDHKey(webBluetoothId: string): Promise<string>;
export function getAdvertisingData(webBluetoothId: string): Promise<string>;
export function setAdvertisingData(webBluetoothId: string, data: string): Promise<void>;
export function readEddystoneProperty(webBluetoothId: string, properly: string): Promise<string>;
export function writeEddystoneProperty(webBluetoothId: string, property: string, value: string): Promise<void>;