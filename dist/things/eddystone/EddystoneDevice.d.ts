import * as WoT from "wot-typescript-definitions";
export declare class EddystoneDevice {
    thing: WoT.ExposedThing | null;
    deviceWoT: typeof WoT;
    td: WoT.ThingDescription;
    private webBluetoothId;
    private slot;
    thingModel: WoT.ThingDescription;
    constructor(deviceWoT: typeof WoT, webBluetoothId: string);
    private addPropertyHandlers;
    private setActiveSlot;
    private getActiveSlot;
    writeProperty(property: string, value: any, slot: number): Promise<void>;
    readProperty(property: string, slot: number): Promise<any>;
}
