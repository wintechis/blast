import * as WoT from 'wot-typescript-definitions';
export default class RuuviTag {
    private thing;
    private exposedThing;
    private webBluetoothId;
    private device;
    private td;
    thingModel: WoT.ThingDescription;
    constructor(webBluetoothId: string);
    private parseAndEmitV3Event;
    private parseAndEmitV5Event;
    subscribeEvent(eventName: string, fn: (...args: any[]) => void): Promise<void>;
    private registerEventListeners;
    destroy(): void;
    getThingDescription(): Promise<WoT.ThingDescription>;
}
