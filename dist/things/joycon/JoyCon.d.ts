import * as WoT from 'wot-typescript-definitions';
import type { Packet } from './types';
export default class JoyCon {
    private thing;
    private exposedThing;
    private joyCon;
    private opened;
    private eventListenerAttached;
    td: WoT.ThingDescription;
    private webHidId;
    private packet;
    private inputHandler;
    thingModel: WoT.ThingDescription;
    constructor(webHidId: string);
    private open;
    readProperty(property: keyof Packet): Promise<any>;
    private registerButtonEventEmitter;
    /**
     * Wrapper method for subscribing to JoyCon events.
     */
    subscribeEvent(eventName: string, fn: (...args: any[]) => void): Promise<void>;
    /**
     * Wrapper method for unsubscribing from all JoyCon events.
     */
    unsubscribeAll(): Promise<void>;
    private destroy;
}
