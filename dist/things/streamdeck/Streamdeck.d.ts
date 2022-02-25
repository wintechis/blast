import * as WoT from 'wot-typescript-definitions';
export declare class Streamdeck {
    thing: WoT.ExposedThing | null;
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
     * Adds property handlers to the thing.
     */
    private addPropertyHandlers;
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
}
