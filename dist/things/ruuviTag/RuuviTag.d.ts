import * as WoT from 'wot-typescript-definitions';
interface RuuviDataV3 {
    accelerationX?: number;
    accelerationY?: number;
    accelerationZ?: number;
    battery?: number;
    humidity?: number;
    pressure?: number;
    temperature?: number;
}
interface RuuviDataV5 {
    accelerationX?: number;
    accelerationY?: number;
    accelerationZ?: number;
    battery?: number;
    humidity?: number;
    pressure?: number;
    temperature?: number;
    txPower?: number;
    movementCounter?: number;
    measurementSequenceNumber?: number;
    mac?: string;
}
export default class RuuviTag {
    private thing;
    private exposedThing;
    private webBluetoothId;
    private td;
    thingModel: WoT.ThingDescription;
    constructor(webBluetoothId: string);
    private addPropertyHandlers;
    private hexToBytes;
    private parseData;
    private parseV3;
    private parseV5;
    private getProperty;
    private hasOwnProperty;
    readProperty(property: keyof RuuviDataV5 | keyof RuuviDataV3): Promise<number | string | unknown>;
    destroy(): void;
    getThingDescription(): Promise<WoT.ThingDescription>;
}
export {};
