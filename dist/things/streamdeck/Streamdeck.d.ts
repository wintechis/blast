import * as WoT from 'wot-typescript-definitions';
export declare class Streamdeck {
    thing: WoT.ExposedThing | null;
    td: WoT.ThingDescription;
    private streamdeck;
    private webHidId;
    thingModel: WoT.ThingDescription;
    constructor(webHidId: string);
    private open;
    private addPropertyHandlers;
    /**
     * @param {String} buttons string containing pushed buttons.
     * @param {String} color color to fill the buttons with, as hex value.
     */
    private setButtonColors;
    writeProperty(property: string, value: any): void;
}
