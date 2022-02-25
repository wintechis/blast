import * as WoT from 'wot-typescript-definitions';
export declare class Streamdeck {
    private thing;
    private exposedThing;
    td: WoT.ThingDescription;
    private streamdeck;
    private webHidId;
    thingModel: WoT.ThingDescription;
    constructor(webHidId: string);
    /**
     * Opens the streamdeck.
     * @returns {Promise<StreamDeckWeb>}
     */
    private open;
    /**
     * Sets the colors of the streamdeck buttons.
     */
    private setButtonColors;
    /**
     * Sets the text of the streamdeck buttons.
     */
    private setButtonText;
    /**
     * Sets the brightness of the streamdeck.
     */
    private setBrightness;
    /**
     * Wrapper method for writing streamdeck properties.
     */
    writeProperty(property: string, value: any): Promise<void>;
    /**
     * Wrapper method for reading streamdeck properties.
     */
    readProperty(property: string): Promise<any>;
    /**
     * Registers buttonUp and buttonDown event emitters.
     */
    private registerButtonUpDownEvenEmitters;
    /**
     * Wrapper method for emitting streamdeck events.
     */
    private emitEvent;
    /**
     * Wrapper method for subscribing to streamdeck events.
     */
    subscribeEvent(eventName: string, fn: (...args: any[]) => void): Promise<void>;
    /**
     * Wrapper method for unsubscribing from all streamdeck events.
     */
    unsubscribeAll(): Promise<void>;
    private destroy;
}
