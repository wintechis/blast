import * as WoT from 'wot-typescript-definitions';
export default class SolidService {
    private thing;
    private exposedThing;
    private td;
    thingModel: WoT.ThingDescription;
    constructor();
    private setActionHandlers;
    private uploadImage;
    invokeAction(action: string, parameters: any): Promise<any>;
    getThingDescription(): Promise<WoT.ThingDescription | null>;
    destroy(): Promise<void>;
}
