import { getThing, removeThing } from '../index.js';
import { subscribe } from '../../blast_webBluetooth.js';
export default class XiamoiThermometer {
    constructor(webBluetoothId) {
        this.thing = null;
        this.exposedThing = null;
        this.td = null;
        this.temperature = -1000;
        this.humidity = -1000;
        this.subscribed = false;
        this.xiaomiServiceUUID = 'ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6';
        this.dataCharacteristicUUID = 'ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6';
        this.thingModel = {
            '@context': ['https://www.w3.org/2019/wot/td/v1'],
            '@type': ['Thing'],
            id: 'blast:Bluetooth:xiamoiThermometer',
            title: 'Xiaomi Thermometer',
            description: 'The Xiaomi Thermometer is a temperature and humidity sensor with a Bluetooth Low Energy interface.',
            securityDefinitions: {
                nosec_sc: {
                    scheme: 'nosec',
                },
            },
            security: 'nosec_sc',
            properties: {
                temperature: {
                    title: 'temperature',
                    description: 'The temperature measured by the thermometer.',
                    unit: '°C',
                    type: 'number',
                    readOnly: true,
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
                humidity: {
                    title: 'humidity',
                    description: 'The relative humidity measured by the thermometer.',
                    unit: '%',
                    type: 'number',
                    readOnly: true,
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
            },
            actions: {
                subscribeToSensorData: {
                    title: 'subscribeToSensorData',
                    description: 'Subscribes to sensor data.',
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
        var _a, _b;
        (_a = this.thing) === null || _a === void 0 ? void 0 : _a.setPropertyReadHandler('temperature', async () => {
            return this.getTemperature();
        });
        (_b = this.thing) === null || _b === void 0 ? void 0 : _b.setPropertyReadHandler('humidity', async () => {
            return this.getHumidity();
        });
    }
    async getTemperature() {
        if (!this.subscribed) {
            await this.subscribeToSensorData();
        }
        while (this.temperature === -1000) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.temperature;
    }
    async getHumidity() {
        if (!this.subscribed) {
            await this.subscribeToSensorData();
        }
        while (this.humidity === -1000) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.humidity;
    }
    async subscribeToSensorData() {
        /**
         * Handles characteristicvaluechanged events.
         * @param {Event} event the event.
         * @param {String} property the property to fetch.
         */
        const notificationHandler = (event) => {
            const { value } = event.target;
            if (value) {
                const sign = value.getUint8(1) & (1 << 7);
                let temp = ((value.getUint8(1) & 0x7f) << 8) | value.getUint8(0);
                if (sign)
                    temp = temp - 32767;
                this.temperature = temp / 100;
                this.humidity = value.getUint8(2);
            }
        };
        subscribe(this.webBluetoothId, this.xiaomiServiceUUID, this.dataCharacteristicUUID, notificationHandler);
    }
    async destroy() {
        if (this.td) {
            await removeThing(this.td);
        }
    }
    async readProperty(property) {
        while (!this.exposedThing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.exposedThing.readProperty(property);
    }
    async getThingDescription() {
        while (!this.thing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.td;
    }
}
//# sourceMappingURL=XiaomiThermometer.js.map