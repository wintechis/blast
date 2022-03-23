import * as WoT from 'wot-typescript-definitions';
export default class EddystoneDevice {
    thing: WoT.ExposedThing | null;
    private td;
    private webBluetoothId;
    private slot;
    thingModel: WoT.ThingDescription;
    constructor(webBluetoothId: string);
    private addPropertyHandlers;
    private setActiveSlot;
    private getActiveSlot;
    writeProperty(property: string, value: string, slot: number): Promise<void>;
    readProperty(property: string, slot: number): Promise<string>;
    getThingDescription(): Promise<WoT.ThingDescription>;
    destroy(): void;
}
