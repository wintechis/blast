import { getDeviceById } from '../../blast_webBluetooth.js';
import { getThing, removeThing } from '../index.js';
export default class RuuviTag {
    constructor(webBluetoothId) {
        this.thing = null;
        this.exposedThing = null;
        this.device = null;
        this.td = null;
        this.thingModel = {
            '@context': ['https://www.w3.org/2019/wot/td/v1'],
            '@type': ['Thing'],
            id: 'blast:Bluetooth:RuuviTag',
            title: 'Ruuvi Tag',
            description: 'RuuviTag is a wireless Bluetooth sensor node that measures temperature, air humidity, and movement.',
            securityDefinitions: {
                nosec_sc: {
                    scheme: 'nosec',
                },
            },
            security: 'nosec_sc',
            events: {
                rawv1: {
                    title: 'Ruuvi Data V3',
                    description: 'The RuuviTag data in version 3 format',
                    data: {
                        type: 'object',
                        properties: {
                            accelerationX: {
                                description: 'Acceleration in X axis',
                                type: 'number',
                                readOnly: true,
                                unit: 'g',
                                multipleOf: 0.1,
                            },
                            accelerationY: {
                                description: 'Acceleration in Y axis',
                                type: 'number',
                                readOnly: true,
                                unit: 'g',
                                multipleOf: 0.1,
                            },
                            accelerationZ: {
                                description: 'Acceleration in Z axis',
                                type: 'number',
                                readOnly: true,
                                unit: 'g',
                                multipleOf: 0.1,
                            },
                            battery: {
                                description: 'Battery level in %',
                                type: 'number',
                                readOnly: true,
                                unit: '%',
                                minimum: 0,
                                maximum: 100,
                                multipleOf: 0.1,
                            },
                            humidity: {
                                description: 'Relative humidity in %',
                                type: 'number',
                                readOnly: true,
                                unit: '%',
                                minimum: 0,
                                maximum: 100,
                                multipleOf: 0.1,
                            },
                            pressure: {
                                description: 'Air pressure in hPa',
                                type: 'number',
                                readOnly: true,
                                unit: 'hPa',
                                minimum: 300,
                                maximum: 1100,
                                multipleOf: 0.1,
                            },
                            temperature: {
                                description: 'Temperature in Celsius',
                                type: 'number',
                                readOnly: true,
                                unit: '°C',
                                minimum: -40,
                                maximum: 80,
                                multipleOf: 0.1,
                            },
                        },
                    },
                    forms: [
                        {
                            href: '',
                        },
                    ],
                },
                rawv2: {
                    title: 'Ruuvi Data V5',
                    description: 'The RuuviTag data in version 5 format',
                    data: {
                        type: 'object',
                        properties: {
                            accelerationX: {
                                description: 'Acceleration in X axis',
                                type: 'number',
                                readOnly: true,
                                unit: 'g',
                                multipleOf: 0.1,
                            },
                            accelerationY: {
                                description: 'Acceleration in Y axis',
                                type: 'number',
                                readOnly: true,
                                unit: 'g',
                                multipleOf: 0.1,
                            },
                            accelerationZ: {
                                description: 'Acceleration in Z axis',
                                type: 'number',
                                readOnly: true,
                                unit: 'g',
                                multipleOf: 0.1,
                            },
                            battery: {
                                description: 'Battery level in %',
                                type: 'number',
                                readOnly: true,
                                unit: '%',
                                minimum: 0,
                                maximum: 100,
                                multipleOf: 0.1,
                            },
                            humidity: {
                                description: 'Relative humidity in %',
                                type: 'number',
                                readOnly: true,
                                unit: '%',
                                minimum: 0,
                                maximum: 100,
                                multipleOf: 0.1,
                            },
                            pressure: {
                                description: 'Air pressure in hPa',
                                type: 'number',
                                readOnly: true,
                                unit: 'hPa',
                                minimum: 300,
                                maximum: 1100,
                                multipleOf: 0.1,
                            },
                            temperature: {
                                description: 'Temperature in Celsius',
                                type: 'number',
                                readOnly: true,
                                unit: '°C',
                                minimum: -40,
                                maximum: 80,
                                multipleOf: 0.1,
                            },
                            txPower: {
                                description: 'Transmission power in dBm',
                                type: 'number',
                                readOnly: true,
                                unit: 'dBm',
                                minimum: -100,
                                maximum: 20,
                                multipleOf: 0.1,
                            },
                            movementCounter: {
                                description: 'Movement counter',
                                type: 'number',
                                readOnly: true,
                                minimum: 0,
                                multipleOf: 1,
                            },
                            measurementSequenceNumber: {
                                description: 'Measurement sequence number',
                                type: 'number',
                                readOnly: true,
                                minimum: 0,
                                multipleOf: 1,
                            },
                            mac: {
                                description: 'MAC address',
                                type: 'string',
                                readOnly: true,
                            },
                        },
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
            this.td = thing.getThingDescription();
            this.thing.expose();
            this.exposedThing = this.thing;
        });
        getDeviceById(webBluetoothId).then(device => {
            this.device = device;
        });
    }
    parseRawV1AndEmitEvent(data) {
        var _a;
        const dataString = data.toString('hex');
        const humidityStart = 6;
        const humidityEnd = 8;
        const temperatureStart = 8;
        const temperatureEnd = 12;
        const pressureStart = 12;
        const pressureEnd = 16;
        const accelerationXStart = 16;
        const accelerationXEnd = 20;
        const accelerationYStart = 20;
        const accelerationYEnd = 24;
        const accelerationZStart = 24;
        const accelerationZEnd = 28;
        const batteryStart = 28;
        const batteryEnd = 32;
        let humidity = parseInt(dataString.substring(humidityStart, humidityEnd), 16);
        humidity /= 2; // scale
        const temperatureString = dataString.substring(temperatureStart, temperatureEnd);
        let temperature = parseInt(temperatureString.substring(0, 2), 16); // Full degrees
        temperature += parseInt(temperatureString.substring(2, 4), 16) / 100; // Decimals
        if (temperature > 128) {
            // Ruuvi format, sign bit + value
            temperature = temperature - 128;
            temperature = 0 - temperature;
        }
        let pressure = parseInt(dataString.substring(pressureStart, pressureEnd), 16); // uint16_t pascals
        pressure += 50000; // Ruuvi format
        let accelerationX = parseInt(dataString.substring(accelerationXStart, accelerationXEnd), 16); // milli-g
        if (accelerationX > 32767) {
            accelerationX -= 65536;
        } // two's complement
        let accelerationY = parseInt(dataString.substring(accelerationYStart, accelerationYEnd), 16); // milli-g
        if (accelerationY > 32767) {
            accelerationY -= 65536;
        } // two's complement
        let accelerationZ = parseInt(dataString.substring(accelerationZStart, accelerationZEnd), 16); // milli-g
        if (accelerationZ > 32767) {
            accelerationZ -= 65536;
        } // two's complement
        const battery = parseInt(dataString.substring(batteryStart, batteryEnd), 16); // milli-g
        const parsedData = {
            accelerationX,
            accelerationY,
            accelerationZ,
            battery,
            humidity,
            pressure,
            temperature,
        };
        (_a = this.exposedThing) === null || _a === void 0 ? void 0 : _a.emitEvent('rawv1', parsedData);
    }
    parseRawV2AndEmitEvent(data) {
        var _a;
        const int2Hex = (str) => ('0' + str.toString(16).toUpperCase()).slice(-2);
        let temperature = (data[3] << 8) | (data[4] & 0xff);
        if (temperature === 32768) {
            // ruuvi spec := 'invalid/not available'
            temperature = undefined;
        }
        else if (temperature > 32768) {
            // two's complement
            temperature = Number(((temperature - 65536) * 0.005).toFixed(4));
        }
        else {
            temperature = Number((temperature * 0.005).toFixed(4));
        }
        let humidity = ((data[5] & 0xff) << 8) | (data[6] & 0xff);
        humidity =
            humidity !== 65535 ? Number((humidity * 0.0025).toFixed(4)) : undefined;
        let pressure = ((data[7] & 0xff) << 8) | (data[8] & 0xff);
        pressure =
            pressure !== 65535 ? Number((pressure + 50000).toFixed(4)) : undefined;
        let accelerationX = (data[9] << 8) | (data[10] & 0xff);
        if (accelerationX === 32768) {
            // ruuvi spec := 'invalid/not available'
            accelerationX = undefined;
        }
        else if (accelerationX > 32768) {
            // two's complement
            accelerationX = accelerationX - 65536;
        }
        let accelerationY = (data[11] << 8) | (data[12] & 0xff);
        if (accelerationY === 32768) {
            // ruuvi spec := 'invalid/not available'
            accelerationY = undefined;
        }
        else if (accelerationY > 32768) {
            // two's complement
            accelerationY = accelerationY - 65536;
        }
        let accelerationZ = (data[13] << 8) | (data[14] & 0xff);
        if (accelerationZ === 32768) {
            // ruuvi spec := 'invalid/not available'
            accelerationZ = undefined;
        }
        else if (accelerationZ > 32768) {
            // two's complement
            accelerationZ = accelerationZ - 65536;
        }
        const powerInfo = ((data[15] & 0xff) << 8) | (data[16] & 0xff);
        let battery = powerInfo >>> 5;
        battery = battery !== 2047 ? battery + 1600 : undefined;
        let txPower = powerInfo & 0b11111;
        txPower = txPower !== 31 ? txPower * 2 - 40 : undefined;
        let movementCounter = data[17] & 0xff;
        movementCounter = movementCounter !== 255 ? movementCounter : undefined;
        let measurementSequenceNumber = ((data[18] & 0xff) << 8) | (data[19] & 0xff);
        measurementSequenceNumber =
            measurementSequenceNumber !== 65535
                ? measurementSequenceNumber
                : undefined;
        const mac = [
            int2Hex(data[20]),
            int2Hex(data[21]),
            int2Hex(data[22]),
            int2Hex(data[23]),
            int2Hex(data[24]),
            int2Hex(data[25]),
        ].join(':');
        const parsedData = {
            accelerationX,
            accelerationY,
            accelerationZ,
            battery,
            humidity,
            mac,
            measurementSequenceNumber,
            movementCounter,
            pressure,
            temperature,
            txPower,
        };
        (_a = this.exposedThing) === null || _a === void 0 ? void 0 : _a.emitEvent('rawv2', parsedData);
    }
    async subscribeEvent(eventName, fn) {
        while (!this.exposedThing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        await this.registerEventListeners();
        this.exposedThing.subscribeEvent(eventName, fn);
    }
    async registerEventListeners() {
        var _a, _b;
        (_a = this.device) === null || _a === void 0 ? void 0 : _a.addEventListener('advertisementreceived', (event) => {
            const data = event.manufacturerData.get(0x0499);
            if (data) {
                const buffer = Buffer.from(data.buffer);
                const formatVersion = data.getUint8(0);
                switch (formatVersion) {
                    case 3:
                        this.parseRawV1AndEmitEvent(buffer);
                        break;
                    case 5:
                        this.parseRawV2AndEmitEvent(buffer);
                        break;
                }
            }
        });
        await ((_b = this.device) === null || _b === void 0 ? void 0 : _b.watchAdvertisements());
    }
    async destroy() {
        if (this.td) {
            await removeThing(this.td);
        }
    }
    async getThingDescription() {
        while (!this.thing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.td;
    }
}
//# sourceMappingURL=RuuviTag.js.map