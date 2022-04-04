import { getThing, removeThing } from '../index.js';
import { writeWithoutResponse } from '../../blast_webBluetooth.js';
export default class BleRgbController {
    constructor(webBluetoothId) {
        this.thing = null;
        this.exposedThing = null;
        this.td = null;
        this.LEDServiceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
        this.characteristicUUID = '0000fff3-0000-1000-8000-00805f9b34fb';
        this.thingModel = {
            '@context': ['https://www.w3.org/2019/wot/td/v1'],
            '@type': ['Thing'],
            id: 'blast:Bluetooth:ledController',
            title: 'BLE RGB Controller',
            description: 'A Bluetooth Low Energy (BLE) controller that can be used to control RGB LED lights.',
            securityDefinitions: {
                nosec_sc: {
                    scheme: 'nosec',
                },
            },
            security: 'nosec_sc',
            properties: {
                colour: {
                    title: 'colour',
                    description: 'The colour of the LED light.',
                    unit: '',
                    type: 'string',
                    readOnly: false,
                    writeOnly: true,
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
            },
        };
        this.webBluetoothId = webBluetoothId;
        getThing(this.thingModel).then(thing => {
            this.thing = thing;
            this.exposedThing = this.thing;
            this.td = thing.getThingDescription();
            this.addPropertyHandlers();
            this.thing.expose();
        });
    }
    addPropertyHandlers() {
        var _a;
        (_a = this.thing) === null || _a === void 0 ? void 0 : _a.setPropertyWriteHandler('colour', value => {
            return this.setColour(value);
        });
    }
    async setColour(colour) {
        const value = '7e000503' + colour.substring(1, 7) + '00ef';
        await writeWithoutResponse(this.webBluetoothId, this.LEDServiceUUID, this.characteristicUUID, value);
    }
    async destroy() {
        if (this.td) {
            await removeThing(this.td);
        }
    }
    async writeProperty(property, value) {
        while (!this.exposedThing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.exposedThing.writeProperty(property, value);
    }
    async getThingDescription() {
        while (!this.thing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.td;
    }
}
//# sourceMappingURL=BleRgbController.js.map