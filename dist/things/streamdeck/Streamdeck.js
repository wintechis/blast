import { getThingsLog, getWebHidDevice } from '../../blast_things.js';
import { throwError } from '../../blast_interpreter.js';
import { openDevice } from '@elgato-stream-deck/webhid';
import { getThing, removeThing } from '../index.js';
const thingsLog = getThingsLog();
export class Streamdeck {
    constructor(webHidId) {
        this.thing = null;
        this.exposedThing = null;
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
            events: {
                buttonUp: {
                    title: 'Button up event',
                    description: 'Triggered when a button is released',
                    data: {
                        type: 'integer',
                    },
                },
                buttonDown: {
                    title: 'Button down event',
                    description: 'Triggered when a button is pressed',
                    data: {
                        type: 'integer',
                    },
                },
            },
        };
        this.webHidId = webHidId;
        getThing(this.thingModel).then(thing => {
            this.thing = thing;
            this.exposedThing = this.thing;
            this.td = thing.getThingDescription();
            this.open().then(sd => {
                this.streamdeck = sd;
                this.registerButtonUpDownEvenEmitters();
            });
            this.thing.expose();
        });
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
     * Sets the colors of the streamdeck buttons.
     */
    async setButtonColors(buttonColors) {
        while (!this.streamdeck) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
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
        while (!this.streamdeck) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
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
        while (!this.streamdeck) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
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
    /**
     * Wrapper method for reading streamdeck properties.
     */
    async readProperty(property) {
        // NOT IMPLEMENTED
        return null;
    }
    /**
     * Registers buttonUp and buttonDown event emitters.
     */
    async registerButtonUpDownEvenEmitters() {
        while (!this.streamdeck) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.streamdeck.on('down', (id) => {
            this.emitEvent('buttonDown', { id, pressed: 'down' });
        });
        this.streamdeck.on('up', (id) => {
            this.emitEvent('buttonUp', { id, pressed: 'up' });
        });
    }
    /**
     * Wrapper method for emitting streamdeck events.
     */
    async emitEvent(eventName, eventData) {
        while (!this.thing) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.thing.emitEvent(eventName, eventData);
    }
    /**
     * Wrapper method for subscribing to streamdeck events.
     */
    async subscribeEvent(eventName, fn) {
        while (!this.exposedThing) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.exposedThing.subscribeEvent(eventName, fn);
    }
    /**
     * Wrapper method for unsubscribing from all streamdeck events.
     */
    async unsubscribeAll() {
        while (!this.exposedThing || !this.streamdeck) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        // for (const eventName of Object.keys(this.exposedThing.events)) {
        //   this.exposedThing.unsubscribeEvent(eventName);
        // }
        // unsubscribeEvent is not implemented, so instead we destroy the thing
        this.destroy();
        this.streamdeck.removeAllListeners();
    }
    destroy() {
        var _a, _b;
        removeThing((_a = this.td) === null || _a === void 0 ? void 0 : _a.id);
        (_b = this.streamdeck) === null || _b === void 0 ? void 0 : _b.close();
    }
}
//# sourceMappingURL=Streamdeck.js.map