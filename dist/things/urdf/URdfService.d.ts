import * as WoT from 'wot-typescript-definitions';
export default class URdfService {
    private thing;
    private exposedThing;
    private td;
    thingModel: WoT.ThingDescription;
    constructor();
    private setActionHandlers;
    invokeAction(action: string, parameters: any): Promise<any>;
    private runSparqlQuery;
    getThingDescription(): Promise<WoT.ThingDescription | null>;
    destroy(): Promise<void>;
}
