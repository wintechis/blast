import { getThingsLog, getWebHidDevice } from '../../blast_things.js';
import { throwError } from '../../blast_interpreter.js';
import { openDevice } from '@elgato-stream-deck/webhid';
import { getThing } from '../index.js';
const thingsLog = getThingsLog();
export class Streamdeck {
    constructor(webHidId) {
        this.thing = null;
        this.streamdeck = null;
        this.thingModel = {
            '@context': ['https://www.w3.org/2019/wot/td/v1'],
            '@type': ['Thing'],
            id: 'blast:webhid:streamdeck',
            title: 'Streamdeck',
            description: 'elGato Streamdeck',
            securityDefinitions: {
                nosec_sc: {
                    scheme: 'nosec',
                },
            },
            security: 'nosec_sc',
            properties: {
                buttonColors: {
                    title: 'Button colors',
                    description: 'The colors of the streamdeck buttons',
                    type: 'array',
                    items: {
                        type: 'object',
                    },
                    readOnly: false,
                },
                buttonText: {
                    title: 'Button text',
                    description: 'The text of the streamdeck buttons',
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    readOnly: false,
                },
                brightness: {
                    title: 'Brightness',
                    description: 'The brightness of the streamdeck',
                    unit: '%',
                    type: 'integer',
                    readOnly: false,
                },
            },
        };
        this.webHidId = webHidId;
        getThing(this.thingModel).then(thing => {
            this.thing = thing;
            this.td = thing.getThingDescription();
            this.addPropertyHandlers();
            this.thing.expose();
        });
        open();
    }
    /**
     * Opens the streamdeck.
     * @returns {Promise<StreamDeckWeb>}
     */
    async open() {
        const device = getWebHidDevice(this.webHidId);
        let sd;
        try {
            sd = await openDevice(device);
            return sd;
        }
        catch (e) {
            // if InvalidStateError error, device is probably already opened
            if (e.name === 'InvalidStateError') {
                device.close();
                sd = await openDevice(device);
                return sd;
            }
            else {
                throwError(e);
                throw new Error(e);
            }
        }
    }
    /**
     * Adds property handlers to the thing.
     */
    addPropertyHandlers() {
        if (this.thing) {
            this.thing.setPropertyWriteHandler('buttonColors', value => {
                return this.setButtonColors(value);
            });
        }
    }
    /**
     * Sets the colors of the streamdeck buttons.
     */
    async setButtonColors(buttonColors) {
        if (!this.streamdeck) {
            this.streamdeck = await this.open();
        }
        // Iterate over the buttons and set the color
        for (const button of buttonColors) {
            // convert color to rgb
            const color = button.color;
            const red = parseInt(color.substring(1, 3), 16);
            const green = parseInt(color.substring(3, 5), 16);
            const blue = parseInt(color.substring(5, 7), 16);
            // fill button with color
            const id = button.id;
            thingsLog(`Invoke <code>fillKeyColor</code> with value <code>${[
                id,
                red,
                green,
                blue,
            ].toString()}</code>`, 'hid', this.streamdeck.PRODUCT_NAME);
            await this.streamdeck.fillKeyColor(id, red, green, blue);
            thingsLog('Finished <code>fillKeyColor</code>', 'hid', this.streamdeck.PRODUCT_NAME);
        }
    }
    /**
     * Sets the text of the streamdeck buttons.
     */
    async setButtonText(buttonText) {
        if (!this.streamdeck) {
            this.streamdeck = await this.open();
        }
        const ps = [];
        // Iterate over the buttons and set the text
        for (const button of buttonText) {
            const id = button.id;
            const value = button.text;
            // Convert value to imageData
            const canvas = document.createElement('canvas');
            canvas.width = this.streamdeck.ICON_SIZE;
            canvas.height = this.streamdeck.ICON_SIZE;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Could not get context');
            }
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = canvas.height * 0.8 + 'px Arial';
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 1;
            ctx.strokeText(value.toString(), 8, 60, canvas.width * 0.8);
            ctx.fillStyle = 'white';
            ctx.fillText(value.toString(), 8, 60, canvas.width * 0.8);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // write imageData to button
            thingsLog(`Invoke <code>fillKeyImageData</code> with value <code>${[
                id,
                imageData,
            ].toString()}</code>`, 'hid', this.streamdeck.PRODUCT_NAME);
            ps.push(this.streamdeck.fillKeyBuffer(id, Buffer.from(imageData.data), {
                format: 'rgba',
            }));
            thingsLog('Finished <code>fillKeyImageData</code>', 'hid', this.streamdeck.PRODUCT_NAME);
            ctx.restore();
        }
        await Promise.all(ps);
    }
    /**
     * Sets the brightness of the streamdeck.
     */
    async setBrightness(brightness) {
        if (!this.streamdeck) {
            this.streamdeck = await this.open();
        }
        thingsLog(`Invoke <code>setBrightness</code> with value <code>${brightness}</code>`, 'hid', this.streamdeck.PRODUCT_NAME);
        await this.streamdeck.setBrightness(brightness);
        thingsLog('Finished <code>setBrightness</code>', 'hid', this.streamdeck.PRODUCT_NAME);
    }
    /**
     * Wrapper method for writing streamdeck properties.
     */
    async writeProperty(property, value) {
        switch (property) {
            case 'buttonColors':
                await this.setButtonColors(value);
                break;
            case 'buttonText':
                await this.setButtonText(value);
                break;
            case 'brightness':
                this.setBrightness(value);
                break;
        }
    }
}
//# sourceMappingURL=Streamdeck.js.map