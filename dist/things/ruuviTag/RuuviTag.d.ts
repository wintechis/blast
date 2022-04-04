import * as WoT from 'wot-typescript-definitions';
export default class RuuviTag {
    private thing;
    private exposedThing;
    private webBluetoothId;
    private device;
    private td;
    thingModel: WoT.ThingDescription;
    constructor(webBluetoothId: string);
    private parseRawV1AndEmitEvent;
    private parseRawV2AndEmitEvent;
    subscribeEvent(eventName: string, fn: (...args: any[]) => void): Promise<void>;
    private registerEventListeners;
    destroy(): Promise<void>;
    getThingDescription(): Promise<WoT.ThingDescription | null>;
}
