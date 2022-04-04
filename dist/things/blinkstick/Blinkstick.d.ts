import * as WoT from 'wot-typescript-definitions';
export default class Blinkstick {
    private thing;
    private exposedThing;
    private webHidId;
    private opened;
    private td;
    private blinkstick;
    thingModel: WoT.ThingDescription;
    constructor(webHidId: string);
    private open;
    private addPropertyHandlers;
    private setColour;
    destroy(): Promise<void>;
    writeProperty(property: string, value: any): Promise<void>;
    getThingDescription(): Promise<WoT.ThingDescription | null>;
}
