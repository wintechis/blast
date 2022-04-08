import * as WoT from 'wot-typescript-definitions';
export default class Blinkstick {
    private thing;
    thingModel: WoT.ThingDescription | null;
    init(webHidId: string): Promise<WoT.ConsumedThing>;
}
