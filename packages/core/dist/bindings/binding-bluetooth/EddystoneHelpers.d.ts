/**
 * @fileoverview helpers functions to parse Eddystone data from a DataView
 * and writing Eddystone data to a DataView.
 */
type EddystoneCharacteristicName = 'Capabilities' | 'Active Slot' | 'Advertising Interval' | 'Radio Tx Power' | 'Advertised Tx Power' | 'Lock State' | 'Unlock' | 'Public ECDH Key' | 'EID Identity Key' | 'Adv Slot Data' | 'Factory Reset';
interface Capabilities {
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
type FrameType = 'UID' | 'URL' | 'TLM' | 'EID';
export declare const EddystoneHelpers: {
    EDDYSTONE_CONFIG_SERVICE: string;
    EDDYSTONE_CHARACTERISTICS: Record<string, EddystoneCharacteristicName>;
    parseCapabilities: (data: string) => Capabilities;
    decodeAdvertisingData: (hexString: string) => string | Uint8Array | number;
    encodeAdvertisingData: (data: string, frameType: FrameType) => string | Uint8Array;
};
export {};
