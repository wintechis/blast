import * as WoT from 'wot-typescript-definitions';
export default class BleRgbController {
    private thing;
    private exposedThing;
    private webBluetoothId;
    private td;
    private LEDServiceUUID;
    private characteristicUUID;
    thingModel: WoT.ThingDescription;
    constructor(webBluetoothId: string);
    private addPropertyHandlers;
    private setColour;
    destroy(): Promise<void>;
    writeProperty(property: string, value: any): Promise<void>;
    getThingDescription(): Promise<WoT.ThingDescription | null>;
}
