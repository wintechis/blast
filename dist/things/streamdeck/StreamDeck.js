import { getThingsLog, getWebHidDevice } from '../../blast_things.js';
import { throwError } from '../../blast_interpreter.js';
import { openDevice } from '@elgato-stream-deck/webhid';
import { getThing, removeThing } from '../index.js';
const thingsLog = getThingsLog();
export default class StreamDeck {
    constructor(webHidId) {
        this.thing = null;
        this.exposedThing = null;
        this.streamdeck = null;
        this.opened = false;
        this.td = null;
        this.eventListenerAttached = false;
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
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
                buttonText: {
                    title: 'Button text',
                    description: 'The text of the streamdeck buttons',
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    readOnly: false,
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
                brightness: {
                    title: 'Brightness',
                    description: 'The brightness of the streamdeck',
                    unit: '%',
                    type: 'integer',
                    readOnly: false,
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
            },
            events: {
                buttonUp: {
                    title: 'Button up event',
                    description: 'Triggered when a button is released',
                    data: {
                        type: 'integer',
                    },
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
                buttonDown: {
                    title: 'Button down event',
                    description: 'Triggered when a button is pressed',
                    data: {
                        type: 'integer',
                    },
                    forms: [
                        {
                            href: '',
                        },
                    ],
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
                this.registerButtonEventEmitter();
                this.addPropertyHandlers();
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
            this.opened = true;
            return sd;
        }
        catch (e) {
            // if InvalidStateError error, device is probably already opened
            if (e.name === 'InvalidStateError') {
                device.close();
                sd = await openDevice(device);
                this.opened = true;
                return sd;
            }
            else {
                throwError(e);
                throw new Error(e);
            }
        }
    }
    addPropertyHandlers() {
        var _a, _b, _c;
        (_a = this.thing) === null || _a === void 0 ? void 0 : _a.setPropertyWriteHandler('buttonColors', parameters => {
            return this.setButtonColors(parameters);
        });
        (_b = this.thing) === null || _b === void 0 ? void 0 : _b.setPropertyWriteHandler('brightness', parameters => {
            return this.setBrightness(parameters);
        });
        (_c = this.thing) === null || _c === void 0 ? void 0 : _c.setPropertyWriteHandler('buttonText', parameters => {
            return this.setButtonText(parameters);
        });
    }
    /**
     * Sets the colors of the streamdeck buttons.
     */
    async setButtonColors(buttonColors) {
        var _a, _b, _c;
        while (!this.opened) {
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
            ].toString()}</code>`, 'hid', (_a = this.streamdeck) === null || _a === void 0 ? void 0 : _a.PRODUCT_NAME);
            await ((_b = this.streamdeck) === null || _b === void 0 ? void 0 : _b.fillKeyColor(id, red, green, blue));
            thingsLog('Finished <code>fillKeyColor</code>', 'hid', (_c = this.streamdeck) === null || _c === void 0 ? void 0 : _c.PRODUCT_NAME);
        }
    }
    /**
     * Sets the text of the streamdeck buttons.
     */
    async setButtonText(buttonText) {
        var _a, _b, _c, _d, _e;
        while (!this.opened) {
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
            canvas.width = ((_a = this.streamdeck) === null || _a === void 0 ? void 0 : _a.ICON_SIZE) || 0;
            canvas.height = ((_b = this.streamdeck) === null || _b === void 0 ? void 0 : _b.ICON_SIZE) || 0;
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
            ].toString()}</code>`, 'hid', (_c = this.streamdeck) === null || _c === void 0 ? void 0 : _c.PRODUCT_NAME);
            ps.push((_d = this.streamdeck) === null || _d === void 0 ? void 0 : _d.fillKeyBuffer(id, Buffer.from(imageData.data), {
                format: 'rgba',
            }));
            thingsLog('Finished <code>fillKeyImageData</code>', 'hid', (_e = this.streamdeck) === null || _e === void 0 ? void 0 : _e.PRODUCT_NAME);
            ctx.restore();
        }
        await Promise.all(ps);
    }
    /**
     * Sets the brightness of the streamdeck.
     */
    async setBrightness(brightness) {
        var _a, _b, _c;
        while (!this.opened) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        thingsLog(`Invoke <code>setBrightness</code> with value <code>${brightness}</code>`, 'hid', (_a = this.streamdeck) === null || _a === void 0 ? void 0 : _a.PRODUCT_NAME);
        await ((_b = this.streamdeck) === null || _b === void 0 ? void 0 : _b.setBrightness(brightness));
        thingsLog('Finished <code>setBrightness</code>', 'hid', (_c = this.streamdeck) === null || _c === void 0 ? void 0 : _c.PRODUCT_NAME);
    }
    /**
     * Wrapper method for writing streamdeck properties.
     */
    async writeProperty(property, value) {
        var _a;
        while (!this.opened) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        (_a = this.exposedThing) === null || _a === void 0 ? void 0 : _a.writeProperty(property, value);
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
    async registerButtonEventEmitter() {
        var _a, _b;
        while (!this.opened) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        (_a = this.streamdeck) === null || _a === void 0 ? void 0 : _a.on('down', (id) => {
            this.emitEvent('buttonDown', { id, pressed: 'down' });
        });
        (_b = this.streamdeck) === null || _b === void 0 ? void 0 : _b.on('up', (id) => {
            this.emitEvent('buttonUp', { id, pressed: 'up' });
        });
        this.eventListenerAttached = true;
    }
    /**
     * Wrapper method for emitting streamdeck events.
     */
    async emitEvent(eventName, eventData) {
        var _a;
        while (!this.opened) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        (_a = this.thing) === null || _a === void 0 ? void 0 : _a.emitEvent(eventName, eventData);
    }
    /**
     * Wrapper method for subscribing to streamdeck events.
     */
    async subscribeEvent(eventName, fn) {
        var _a;
        while (!this.opened) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (!this.eventListenerAttached) {
            await this.registerButtonEventEmitter();
        }
        (_a = this.exposedThing) === null || _a === void 0 ? void 0 : _a.subscribeEvent(eventName, fn);
    }
    /**
     * Wrapper method for unsubscribing from all streamdeck events.
     */
    async unsubscribeAll() {
        var _a, _b, _c, _d;
        while (!this.opened) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        thingsLog('Removing all streamdeck listeners', 'hid', (_a = this.streamdeck) === null || _a === void 0 ? void 0 : _a.PRODUCT_NAME);
        // unsubcribeEvent is not yet implemented in node-wot, so we have to use this own implementation
        for (const eventName in (_b = this.exposedThing) === null || _b === void 0 ? void 0 : _b.events) {
            const es = (_c = this.exposedThing) === null || _c === void 0 ? void 0 : _c.events[eventName].getState();
            es.legacyListeners.length = 0;
        }
        (_d = this.streamdeck) === null || _d === void 0 ? void 0 : _d.removeAllListeners();
        this.eventListenerAttached = false;
    }
    async getThingDescription() {
        while (!this.thing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.td;
    }
    async destroy() {
        var _a;
        if (this.td) {
            await removeThing(this.td);
        }
        (_a = this.streamdeck) === null || _a === void 0 ? void 0 : _a.close();
    }
}
//# sourceMappingURL=StreamDeck.js.map