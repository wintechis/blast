import { throwError } from '../../blast_interpreter.js';
import { LEScanResults, startLEScan } from '../../blast_webBluetooth.js';
import { getThing, removeThing } from '../index.js';
export default class RuuviTag {
    constructor(webBluetoothId) {
        this.thing = null;
        this.exposedThing = null;
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
            properties: {
                ruuviDataV3: {
                    title: 'Ruuvi Data V3',
                    description: 'The RuuviTag data in version 3 format',
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
                    readonly: true,
                },
                ruuviDataV5: {
                    title: 'Ruuvi Data V5',
                    description: 'The RuuviTag data in version 5 format',
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
                        readOnly: true,
                    },
                },
            },
        };
        this.webBluetoothId = webBluetoothId;
        getThing(this.thingModel).then(thing => {
            this.thing = thing;
            this.td = thing.getThingDescription();
            this.addPropertyHandlers();
            this.thing.expose();
            this.exposedThing = this.thing;
        });
    }
    addPropertyHandlers() {
        var _a;
        const properties = this.thingModel.properties;
        const propertyKeys = Object.keys(properties);
        for (const p of propertyKeys) {
            (_a = this.thing) === null || _a === void 0 ? void 0 : _a.setPropertyReadHandler(p, () => {
                return this.getProperty(p);
            });
        }
    }
    hexToBytes(hex) {
        const bytes = [];
        for (let c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.slice(c, c + 2), 16));
        }
        return bytes;
    }
    parseData(data) {
        const manufacturerIndex = data.indexOf('FF9904');
        const rData = typeof data === 'string'
            ? Buffer.from(this.hexToBytes(data.slice(manufacturerIndex + 2, data.length)))
            : data;
        const dataFormat = rData[2];
        switch (dataFormat) {
            case 3:
                return this.parseV3(rData);
            case 5:
                return this.parseV5(rData);
            default:
                throw new Error(`Data format ${dataFormat} not supported.\n ${rData}`);
        }
    }
    parseV3(data) {
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
        return {
            accelerationX,
            accelerationY,
            accelerationZ,
            battery,
            humidity,
            pressure,
            temperature,
        };
    }
    parseV5(data) {
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
        return {
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
    }
    async getProperty(property) {
        const getAdvertisementData = async (tries) => {
            const v5OnlyKeys = [
                'txPower',
                'movementCounter',
                'measurementSequenceNumber',
                'mac',
            ];
            if (tries < 30) {
                const events = LEScanResults[this.webBluetoothId];
                if (events) {
                    for (const event of events) {
                        const rawData = event.manufacturerData.get(0x0499);
                        if (rawData) {
                            const formatVersion = rawData.getUint8(0);
                            if (formatVersion === 5 ||
                                (formatVersion === 3 && !v5OnlyKeys.includes(property))) {
                                return rawData.buffer;
                            }
                        }
                    }
                }
                // no data yet, try again in 500ms
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(getAdvertisementData(tries + 1));
                    }, 500);
                });
            }
            return undefined;
        };
        startLEScan();
        const advertisementData = await getAdvertisementData(0);
        // if still no event data, return an error
        if (!advertisementData) {
            throwError('No BLE advertising data received for ' + this.webBluetoothId);
            throw new Error('No BLE advertising data received for ' + this.webBluetoothId);
        }
        // parse the data
        const data = await this.parseData(advertisementData);
        // return the requested property
        if (typeof data === 'object' && this.hasOwnProperty(data, property) && (typeof data[property] === 'number' || typeof data[property] === 'string')) {
            return data[property];
        }
        throw new Error('No BLE advertising data received for ' + this.webBluetoothId);
    }
    hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty(prop);
    }
    async readProperty(property) {
        while (!this.exposedThing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.exposedThing.readProperty(property);
    }
    destroy() {
        var _a;
        removeThing((_a = this.td) === null || _a === void 0 ? void 0 : _a.id);
    }
    async getThingDescription() {
        while (!this.thing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.td;
    }
}
//# sourceMappingURL=RuuviTag.js.map