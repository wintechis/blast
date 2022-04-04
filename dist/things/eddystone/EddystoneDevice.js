import { getActiveSlot, readEddystoneProperty, setActiveSlot, writeEddystoneProperty, } from '../../blast_eddystone.js';
import { getThing, removeThing } from '../index.js';
export default class EddystoneDevice {
    constructor(webBluetoothId) {
        this.thing = null;
        this.td = null;
        this.slot = -1;
        this.thingModel = {
            '@context': ['https://www.w3.org/2019/wot/td/v1'],
            '@type': ['Thing'],
            id: 'blast:bluetooth:EddystoneDevice',
            title: 'Eddystone Device',
            description: 'A Bluetooth device implementing the Eddystone protocol',
            securityDefinitions: {
                nosec_sc: {
                    scheme: 'nosec',
                },
            },
            security: 'nosec_sc',
            properties: {
                advertisedTxPower: {
                    title: 'Advertised Tx Power',
                    description: 'The advertised TX power of the iBeacon',
                    unit: 'dBm',
                    type: 'integer',
                    readOnly: false,
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
                advertisedData: {
                    title: 'Advertised Data',
                    description: 'The advertised data of the eddystone device',
                    unit: '',
                    type: 'string',
                    readOnly: false,
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
                advertisingInterval: {
                    title: 'Advertising Interval',
                    description: 'The advertising interval of the eddystone device',
                    unit: 'ms',
                    type: 'integer',
                    readOnly: false,
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
                lockState: {
                    title: 'Lock State',
                    description: 'The lock state of the eddystone device',
                    unit: '',
                    type: 'string',
                    readOnly: true,
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
                publicEcdhKey: {
                    title: 'Public ECDH Key',
                    description: 'The public ECDH key of the eddystone device',
                    unit: '',
                    type: 'string',
                    readOnly: true,
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
                radioTxPower: {
                    title: 'Radio Tx Power',
                    description: 'The radio TX power of the eddystone device',
                    unit: 'dBm',
                    type: 'integer',
                    readOnly: false,
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
            this.td = thing.getThingDescription();
            this.addPropertyHandlers();
            this.thing.expose();
        });
    }
    addPropertyHandlers() {
        var _a, _b;
        const properties = this.thingModel.properties;
        for (const p in properties) {
            (_a = this.thing) === null || _a === void 0 ? void 0 : _a.setPropertyReadHandler(p, () => {
                return readEddystoneProperty(this.webBluetoothId, p);
            });
            if (!properties[p].readOnly) {
                (_b = this.thing) === null || _b === void 0 ? void 0 : _b.setPropertyWriteHandler(p, value => {
                    return writeEddystoneProperty(this.webBluetoothId, p, value);
                });
            }
        }
    }
    async setActiveSlot(slot) {
        if ((await this.getActiveSlot()) !== slot) {
            await setActiveSlot(this.webBluetoothId, slot);
            this.slot = slot;
        }
    }
    async getActiveSlot() {
        if (!this.slot) {
            this.slot = await getActiveSlot(this.webBluetoothId);
        }
        return this.slot;
    }
    async writeProperty(property, value, slot) {
        this.setActiveSlot(slot);
        return writeEddystoneProperty(this.webBluetoothId, property, value);
    }
    async readProperty(property, slot) {
        this.setActiveSlot(slot);
        return readEddystoneProperty(this.webBluetoothId, property);
    }
    async getThingDescription() {
        while (!this.thing) {
            // Wait for the thing to be created
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.td;
    }
    async destroy() {
        if (this.td) {
            await removeThing(this.td);
        }
    }
}
//# sourceMappingURL=EddystoneDevice.js.map