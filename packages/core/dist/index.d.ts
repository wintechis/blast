import * as WoT from 'wot-typescript-definitions';

declare class Blast {
	private servient;
	private wot;
	constructor(ConcreteBluetoothAdapter?: new () => BluetoothAdapter | undefined, ConcreteHidAdapter?: new () => HidAdapter | undefined);
	getWot(): Promise<typeof WoT>;
	resetServient(): Promise<void>;
	createExposedThing(td: WoT.ThingDescription, id: string | undefined): Promise<WoT.ExposedThing>;
	createThing(td: WoT.ThingDescription, id: string | undefined): Promise<WoT.ConsumedThing>;
	createThingWithHandlers(td: WoT.ThingDescription, id: string | undefined, addHandlers: (thing: WoT.ExposedThing) => void): Promise<WoT.ConsumedThing>;
}
export declare abstract class BluetoothAdapter {
	abstract getCharacteristic(deviceId: string, serviceID: BluetoothServiceUUID, characteristicId: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>;
	abstract observeGAP(deviceId: string, handler: (event: any) => void): Promise<void>;
}
export declare abstract class HidAdapter {
	abstract getDevice(id: string): Promise<HIDDevice>;
}
export declare const EddystoneHelpers: {
	EDDYSTONE_CONFIG_SERVICE: string;
	EDDYSTONE_CHARACTERISTICS: Record<string, EddystoneCharacteristicName>;
	parseCapabilities: (data: string) => Capabilities;
	decodeAdvertisingData: (hexString: string) => string | Uint8Array | number;
	encodeAdvertisingData: (data: string, frameType: FrameType) => string | Uint8Array;
};
export interface Capabilities {
	specVersion: number;
	maxSlots: number;
	maxEidPerSlot: number;
	isVarriableAdvIntervalSupported: boolean;
	isVariableTxPowerSupported: boolean;
	isUidSupported: boolean;
	isUrlSupported: boolean;
	isTlmSupported: boolean;
	isEidSupported: boolean;
	supportedTxPowerLevels: number[];
}
/**
 * @fileoverview helpers functions to parse Eddystone data from a DataView
 * and writing Eddystone data to a DataView.
 */
export type EddystoneCharacteristicName = "Capabilities" | "Active Slot" | "Advertising Interval" | "Radio Tx Power" | "Advertised Tx Power" | "Lock State" | "Unlock" | "Public ECDH Key" | "EID Identity Key" | "Adv Slot Data" | "Factory Reset";
export type FrameType = "UID" | "URL" | "TLM" | "EID";

export {
	Blast as default,
};

