import * as WoT from 'wot-typescript-definitions';
export default class HuskyDuino {
    thing: WoT.ExposedThing | null;
    private td;
    private exposedThing;
    private webBluetoothId;
    private HuskyServiceUUID;
    thingModel: WoT.ThingDescription;
    constructor(webBluetoothId: string);
    private setPropertyHandlers;
    private setActionHandlers;
    /**
     * Set algorithm the Huskylens should use.
     * @param alg the algorithm to use
     */
    private setAlgorithm;
    /**
     * Learn a face or object.
     * @param id the ID of the face or object
     */
    private learn;
    /**
     * Get the ID of the face or object.
     */
    getId(): Promise<string>;
    /**
     * Forget all faces and objects.
     */
    private forgetAll;
    writeProperty(property: string, value: any): Promise<void>;
    readProperty(property: string): Promise<any>;
    invokeAction(action: string, parameters: any): Promise<any>;
    getThingDescription(): Promise<WoT.ThingDescription | null>;
    destroy(): Promise<void>;
}
