import { throwError } from '../../blast_interpreter.js';
import { getThingsLog } from '../../blast_things.js';
import { getWebHidDevice } from '../../blast_things.js';
import { getThing, removeThing } from '../index.js';
const thingsLog = getThingsLog();
export default class Blinkstick {
    constructor(webHidId) {
        this.thing = null;
        this.exposedThing = null;
        this.opened = false;
        this.thingModel = {
            '@context': ['https://www.w3.org/2019/wot/td/v1'],
            '@type': ['Thing'],
            id: 'blast:webhid:blinkstick',
            title: 'Blinkstick',
            description: 'The tulogic Blinkstick is a Smart LED controller with integrated USB firmware.',
            securityDefinitions: {
                nosec_sc: {
                    scheme: 'nosec',
                },
            },
            security: 'nosec_sc',
            properties: {
                colours: {
                    title: 'colours',
                    description: 'The colour of the LED at the given index',
                    unit: '',
                    type: 'object',
                    properties: {
                        0: {
                            title: 'Colour 0',
                            description: 'The colour of the LED at index 0',
                            unit: '',
                            type: 'string',
                            writeOnly: true,
                        },
                        1: {
                            title: 'Colour 1',
                            description: 'The colour of the LED at index 1',
                            unit: '',
                            type: 'string',
                            writeOnly: true,
                        },
                        2: {
                            title: 'Colour 2',
                            description: 'The colour of the LED at index 2',
                            unit: '',
                            type: 'string',
                            writeOnly: true,
                        },
                        3: {
                            title: 'Colour 3',
                            description: 'The colour of the LED at index 3',
                            unit: '',
                            type: 'string',
                            writeOnly: true,
                        },
                        4: {
                            title: 'Colour 4',
                            description: 'The colour of the LED at index 4',
                            unit: '',
                            type: 'string',
                            writeOnly: true,
                        },
                        5: {
                            title: 'Colour 5',
                            description: 'The colour of the LED at index 5',
                            unit: '',
                            type: 'string',
                            writeOnly: true,
                        },
                        6: {
                            title: 'Colour 6',
                            description: 'The colour of the LED at index 6',
                            unit: '',
                            type: 'string',
                            writeOnly: true,
                        },
                        7: {
                            title: 'Colour 7',
                            description: 'The colour of the LED at index 7',
                            unit: '',
                            type: 'string',
                            writeOnly: true,
                        },
                    },
                    readOnly: false,
                    writeOnly: true,
                },
            },
        };
        this.webHidId = webHidId;
        getThing(this.thingModel).then(thing => {
            this.thing = thing;
            this.exposedThing = this.thing;
            this.td = thing.getThingDescription();
            this.open().then(bs => {
                this.blinkstick = bs;
            });
            this.addPropertyHandlers();
            this.thing.expose();
        });
    }
    async open() {
        const device = getWebHidDevice(this.webHidId);
        if (!device) {
            throwError('Connected device is not a HID device.\nMake sure you are connecting the Blinkstick via webHID.');
            return;
        }
        // check if the device is a BlinkStick
        if (device.vendorId !== 8352 || device.productId !== 16869) {
            throwError('The connected device is not a BlinkStick.');
            return;
        }
        await device.open();
        this.opened = true;
        return device;
    }
    addPropertyHandlers() {
        var _a;
        (_a = this.thing) === null || _a === void 0 ? void 0 : _a.setPropertyWriteHandler('colours', value => {
            return this.setColour(value);
        });
    }
    async setColour(value) {
        while (!this.opened) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        const { index, red, green, blue } = value;
        const reportId = 5;
        const report = Int8Array.from([reportId, index, red, green, blue]);
        const trySetColor = async (retries) => {
            try {
                thingsLog(`Invoke <code>sendFeatureReport</code> with value <code>${report}</code>`, 'hid', this.blinkstick.productName);
                await this.blinkstick.sendFeatureReport(reportId, report);
                thingsLog(`Finished <code>sendFeatureReport</code> with value <code>${report}</code>`, 'hid', this.blinkstick.productName);
            }
            catch (error) {
                if (retries > 0) {
                    await trySetColor(--retries);
                }
                else {
                    console.error(error);
                    throwError('Failed to set BlinkStick colors, please check its connection.');
                }
            }
        };
        await trySetColor(5);
    }
    destroy() {
        var _a, _b;
        removeThing((_a = this.td) === null || _a === void 0 ? void 0 : _a.id);
        (_b = this.blinkstick) === null || _b === void 0 ? void 0 : _b.close();
    }
    async writeProperty(property, value) {
        var _a;
        while (!this.opened) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        (_a = this.exposedThing) === null || _a === void 0 ? void 0 : _a.writeProperty(property, value);
    }
    async getThingDescription() {
        while (!this.thing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.td;
    }
}
//# sourceMappingURL=Blinkstick.js.map