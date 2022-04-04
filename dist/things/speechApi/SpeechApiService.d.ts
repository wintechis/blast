import * as WoT from 'wot-typescript-definitions';
export default class SpeechApiService {
    private thing;
    private exposedThing;
    private td;
    thingModel: WoT.ThingDescription;
    constructor();
    private setActionHandlers;
    private synthesizeText;
    /**
     * Recognizes speech (speech to text).
     * @returns {Promise<string>} The recognized speech
     */
    recognizeSpeech(lang: string): Promise<string>;
    invokeAction(action: string, parameters: any): Promise<any>;
    getThingDescription(): Promise<WoT.ThingDescription | null>;
    destroy(): Promise<void>;
}
