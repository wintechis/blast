import * as WoT from 'wot-typescript-definitions';
export declare class JoyCon {
    private thing;
    private device;
    private joyCon;
    private log;
    private opened;
    private eventListenerAttached;
    td: WoT.ThingDescription;
    private webHidId;
    thingModel: WoT.ThingDescription;
    constructor(webHidId: string);
    private open;
    readProperty(property: string): Promise<any>;
}
