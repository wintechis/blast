import * as WoT from 'wot-typescript-definitions';
export declare class EddystoneDevice {
    thing: WoT.ExposedThing | null;
    td: WoT.ThingDescription;
    private webBluetoothId;
    private slot;
    thingModel: WoT.ThingDescription;
    constructor(webBluetoothId: string);
    private addPropertyHandlers;
    private setActiveSlot;
    private getActiveSlot;
    writeProperty(property: string, value: string, slot: number): Promise<void>;
    readProperty(property: string, slot: number): Promise<string>;
}
