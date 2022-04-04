import { readText, writeWithoutResponse } from '../../blast_webBluetooth.js';
import { getThing, removeThing } from '../index.js';
export default class HuskyDuino {
    constructor(webBluetoothId) {
        this.thing = null;
        this.td = null;
        this.exposedThing = null;
        this.HuskyServiceUUID = '5be35d20-f9b0-11eb-9a03-0242ac130003';
        this.thingModel = {
            '@context': ['https://www.w3.org/2019/wot/td/v1'],
            '@type': ['Thing'],
            id: 'blast:bluetooth:HuskyDuino',
            title: 'HuskyDuino',
            description: 'A HuskyLens interface running on Arduino',
            securityDefinitions: {
                nosec_sc: {
                    scheme: 'nosec',
                },
            },
            security: 'nosec_sc',
            properties: {
                algorithm: {
                    description: 'The currently active algorithm',
                    type: 'number',
                    readOnly: false,
                    writeOnly: false,
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
                id: {
                    description: 'The ID of the face or object',
                    type: 'number',
                    readOnly: false,
                    writeOnly: false,
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
            },
            actions: {
                forgetAll: {
                    title: 'Forget all faces and objects',
                    description: 'Forget all faces and objects',
                    input: {
                        type: 'null',
                    },
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
            this.exposedThing = thing;
            this.td = thing.getThingDescription();
            this.setPropertyHandlers();
            this.setActionHandlers();
            this.thing.expose();
        });
    }
    setPropertyHandlers() {
        var _a, _b, _c;
        (_a = this.thing) === null || _a === void 0 ? void 0 : _a.setPropertyWriteHandler('algorithm', parameters => {
            return this.setAlgorithm(parameters);
        });
        (_b = this.thing) === null || _b === void 0 ? void 0 : _b.setPropertyReadHandler('id', parameters => {
            return this.getId();
        });
        (_c = this.thing) === null || _c === void 0 ? void 0 : _c.setPropertyWriteHandler('id', parameters => {
            return this.learn(parameters);
        });
    }
    setActionHandlers() {
        var _a;
        (_a = this.thing) === null || _a === void 0 ? void 0 : _a.setActionHandler('forgetAll', parameters => {
            return this.forgetAll();
        });
    }
    /**
     * Set algorithm the Huskylens should use.
     * @param alg the algorithm to use
     */
    async setAlgorithm(alg) {
        const characteristicUUID = '5be35d26-f9b0-11eb-9a03-0242ac130003';
        return writeWithoutResponse(this.webBluetoothId, this.HuskyServiceUUID, characteristicUUID, alg);
    }
    /**
     * Learn a face or object.
     * @param id the ID of the face or object
     */
    async learn(id) {
        const characteristicUUID = '5be35eca-f9b0-11eb-9a03-0242ac130003';
        return writeWithoutResponse(this.webBluetoothId, this.HuskyServiceUUID, characteristicUUID, id);
    }
    /**
     * Get the ID of the face or object.
     */
    async getId() {
        const characteristicUUID = '5be3628a-f9b0-11eb-9a03-0242ac130003';
        return readText(this.webBluetoothId, this.HuskyServiceUUID, characteristicUUID);
    }
    /**
     * Forget all faces and objects.
     */
    async forgetAll() {
        const characteristicUUID = '5be361b8-f9b0-11eb-9a03-0242ac130003';
        await writeWithoutResponse(this.webBluetoothId, this.HuskyServiceUUID, characteristicUUID, '0x01');
    }
    async writeProperty(property, value) {
        while (!this.exposedThing) {
            // Wait for the thing to be created
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.exposedThing.writeProperty(property, value);
    }
    async readProperty(property) {
        while (!this.exposedThing) {
            // Wait for the thing to be created
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.exposedThing.readProperty(property);
    }
    async invokeAction(action, parameters) {
        while (!this.exposedThing) {
            // Wait for the thing to be created
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.exposedThing.invokeAction(action, parameters);
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
//# sourceMappingURL=HuskyDuino.js.map