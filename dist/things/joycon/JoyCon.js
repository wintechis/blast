import { getThing } from '../index.js';
import { JoyConLeft, JoyConRight } from 'joy-con-webhid';
import { getThingsLog, getWebHidDevice } from '../../blast_things.js';
import { throwError } from '../../blast_interpreter.js';
export class JoyCon {
    constructor(webHidId) {
        this.thing = null;
        this.device = null;
        this.joyCon = null;
        this.opened = false;
        this.eventListenerAttached = false;
        this.thingModel = {
            '@context': ['https://www.w3.org/2019/wot/td/v1'],
            '@type': ['Thing'],
            id: 'blast:webhid:joycon',
            title: 'Joy-Con',
            description: 'Nintendo Joy-Con',
            securityDefinitions: {
                nosec_sc: {
                    scheme: 'nosec',
                },
            },
            security: 'nosec_sc',
            properties: {
                accelerometer: {
                    title: 'Accelerometer',
                    description: 'The accelerometer of the joy-con',
                    type: 'object',
                    properties: {
                        x: {
                            title: 'X',
                            description: 'The X-axis of the accelerometer',
                            type: 'number',
                            readOnly: true,
                        },
                        y: {
                            title: 'Y',
                            description: 'The Y-axis of the accelerometer',
                            type: 'number',
                            readOnly: true,
                        },
                        z: {
                            title: 'Z',
                            description: 'The Z-axis of the accelerometer',
                            type: 'number',
                            readOnly: true,
                        },
                    },
                },
                actualAccelerometer: {
                    title: 'Actual accelerometer',
                    description: 'The actual accelerometer of the joy-con',
                    type: 'object',
                    properties: {
                        x: {
                            title: 'X',
                            description: 'The X-axis of the accelerometer',
                            type: 'number',
                            readOnly: true,
                        },
                        y: {
                            title: 'Y',
                            description: 'The Y-axis of the accelerometer',
                            type: 'number',
                            readOnly: true,
                        },
                        z: {
                            title: 'Z',
                            description: 'The Z-axis of the accelerometer',
                            type: 'number',
                            readOnly: true,
                        },
                    },
                },
                actualGyroscope: {
                    title: 'Actual gyroscope',
                    description: 'The angular velocity (rps and dps) based on all 3 gyroscopes, on 3 axis',
                    type: 'object',
                    properties: {
                        rps: {
                            title: 'RPS',
                            description: 'Revolutions per second',
                            type: 'number',
                            readOnly: true,
                            properties: {
                                x: {
                                    title: 'X',
                                    description: 'Revolutions per second in the X-axis',
                                    type: 'number',
                                    unit: 'rps',
                                    readOnly: true,
                                },
                                y: {
                                    title: 'Y',
                                    description: 'Revolutions per second in the Y-axis',
                                    type: 'number',
                                    unit: 'rps',
                                    readOnly: true,
                                },
                                z: {
                                    title: 'Z',
                                    description: 'Revolutions per second in the Z-axis',
                                    type: 'number',
                                    unit: 'rps',
                                    readOnly: true,
                                },
                            },
                        },
                        dps: {
                            title: 'DPS',
                            description: 'Degrees per second',
                            type: 'number',
                            readOnly: true,
                            properties: {
                                x: {
                                    title: 'X',
                                    description: 'Degrees per second in the X-axis',
                                    type: 'number',
                                    unit: 'dps',
                                    readOnly: true,
                                },
                                y: {
                                    title: 'Y',
                                    description: 'Degrees per second in the Y-axis',
                                    type: 'number',
                                    unit: 'dps',
                                    readOnly: true,
                                },
                                z: {
                                    title: 'Z',
                                    description: 'Degrees per second in the Z-axis',
                                    type: 'number',
                                    unit: 'dps',
                                    readOnly: true,
                                },
                            },
                        },
                    },
                },
                actualOrientation: {
                    title: 'Actual orientation',
                    description: 'The device orientation in degrees',
                    type: 'object',
                    properties: {
                        alpha: {
                            title: 'Alpha',
                            description: 'The angle of the device around the Z axis',
                            type: 'number',
                            unit: 'deg',
                            readOnly: true,
                        },
                        beta: {
                            title: 'Beta',
                            description: 'The angle of the device around the X axis',
                            type: 'number',
                            unit: 'deg',
                            readOnly: true,
                        },
                        gamma: {
                            title: 'Gamma',
                            description: 'The angle of the device around the Y axis',
                            type: 'number',
                            unit: 'deg',
                            readOnly: true,
                        },
                    },
                },
                actualOrientationQuaternion: {
                    title: 'Actual orientation quaternion',
                    description: 'The device orientation in quaternion',
                    type: 'object',
                    properties: {
                        alpha: {
                            title: 'Alpha',
                            description: 'The angle of the device around the Z axis',
                            type: 'number',
                            unit: 'deg',
                            readOnly: true,
                        },
                        beta: {
                            title: 'Beta',
                            description: 'The angle of the device around the X axis',
                            type: 'number',
                            unit: 'deg',
                            readOnly: true,
                        },
                        gamma: {
                            title: 'Gamma',
                            description: 'The angle of the device around the Y axis',
                            type: 'number',
                            unit: 'deg',
                            readOnly: true,
                        },
                    },
                },
                gyroscopes: {
                    title: 'Gyroscopes',
                    description: 'The angular velocity (rps and dps) measured by the 3 gyroscopes',
                    type: 'object',
                    properties: {
                        gyroscope1: {
                            title: 'Gyroscope 1',
                            description: 'The angular velocity (rps and dps) measured by the first gyroscope',
                            type: 'object',
                            properties: {
                                rps: {
                                    title: 'RPS',
                                    description: 'The angular velocity in revolutions per second measured by the first gyroscope',
                                    type: 'number',
                                    unit: 'rps',
                                    readOnly: true,
                                    properties: {
                                        x: {
                                            title: 'X',
                                            description: 'The angular velocity in revolutions per second in the X-axis, measured by the first gyroscope',
                                            type: 'number',
                                            unit: 'rps',
                                            readOnly: true,
                                        },
                                        y: {
                                            title: 'Y',
                                            description: 'The angular velocity in revolutions per second in the Y-axis, measured by the first gyroscope',
                                            type: 'number',
                                            unit: 'rps',
                                            readOnly: true,
                                        },
                                        z: {
                                            title: 'Z',
                                            description: 'The angular velocity in revolutions per second in the Z-axis, measured by the first gyroscope',
                                            type: 'number',
                                            unit: 'rps',
                                            readOnly: true,
                                        },
                                    },
                                },
                            },
                        },
                        gyroscope2: {
                            title: 'Gyroscope 2',
                            description: 'The angular velocity (rps and dps) measured by the second gyroscope',
                            type: 'object',
                            properties: {
                                rps: {
                                    title: 'RPS',
                                    description: 'The angular velocity in revolutions per second measured by the second gyroscope',
                                    type: 'number',
                                    unit: 'rps',
                                    readOnly: true,
                                    properties: {
                                        x: {
                                            title: 'X',
                                            description: 'The angular velocity in revolutions per second in the X-axis, measured by the second gyroscope',
                                            type: 'number',
                                            unit: 'rps',
                                            readOnly: true,
                                        },
                                        y: {
                                            title: 'Y',
                                            description: 'The angular velocity in revolutions per second in the Y-axis, measured by the second gyroscope',
                                            type: 'number',
                                            unit: 'rps',
                                            readOnly: true,
                                        },
                                        z: {
                                            title: 'Z',
                                            description: 'The angular velocity in revolutions per second in the Z-axis, measured by the second gyroscope',
                                            type: 'number',
                                            unit: 'rps',
                                            readOnly: true,
                                        },
                                    },
                                },
                            },
                        },
                        gyroscope3: {
                            title: 'Gyroscope 3',
                            description: 'The angular velocity (rps and dps) measured by the third gyroscope',
                            type: 'object',
                            properties: {
                                rps: {
                                    title: 'RPS',
                                    description: 'The angular velocity in revolutions per second measured by the third gyroscope',
                                    type: 'number',
                                    unit: 'rps',
                                    readOnly: true,
                                    properties: {
                                        x: {
                                            title: 'X',
                                            description: 'The angular velocity in revolutions per second in the X-axis, measured by the third gyroscope',
                                            type: 'number',
                                            unit: 'rps',
                                            readOnly: true,
                                        },
                                        y: {
                                            title: 'Y',
                                            description: 'The angular velocity in revolutions per second in the Y-axis, measured by the third gyroscope',
                                            type: 'number',
                                            unit: 'rps',
                                            readOnly: true,
                                        },
                                        z: {
                                            title: 'Z',
                                            description: 'The angular velocity in revolutions per second in the Z-axis, measured by the third gyroscope',
                                            type: 'number',
                                            unit: 'rps',
                                            readOnly: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                quaternion: {
                    title: 'Quaternion',
                    description: 'The spacial orientation and rotation in quaternion',
                    type: 'object',
                    properties: {
                        w: {
                            title: 'W',
                            description: 'The w component of the quaternion',
                            type: 'number',
                            readOnly: true,
                        },
                        x: {
                            title: 'X',
                            description: 'The x component of the quaternion',
                            type: 'number',
                            readOnly: true,
                        },
                        y: {
                            title: 'Y',
                            description: 'The y component of the quaternion',
                            type: 'number',
                            readOnly: true,
                        },
                        z: {
                            title: 'Z',
                            description: 'The z component of the quaternion',
                            type: 'number',
                            readOnly: true,
                        },
                    },
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
        this.log = getThingsLog();
        this.open().then(() => {
            getThing(this.thingModel).then(thing => {
                this.thing = thing;
                this.td = thing.getThingDescription();
                this.thing.expose();
            });
        });
    }
    async open() {
        var _a, _b, _c, _d;
        const device = getWebHidDevice(this.webHidId);
        if (!device) {
            throwError('Could not find device, in connected webHID devices');
            return;
        }
        if (!device.opened) {
            try {
                await device.open();
            }
            catch (error) {
                throwError("Failed to open device, your browser or OS probably doesn't support webHID.");
            }
        }
        // Check if device is a Joy-Con.
        if (device.vendorId !== 1406 ||
            (device.productId !== 0x2006 && device.productId !== 0x2007)) {
            throwError('The connected device is not a Joy-Con.');
            return;
        }
        if (device.productId === 0x2006) {
            this.joyCon = new JoyConLeft(device);
        }
        else if (device.productId === 0x2007) {
            this.joyCon = new JoyConRight(device);
        }
        this.device = device;
        await ((_a = this.joyCon) === null || _a === void 0 ? void 0 : _a.open());
        await ((_b = this.joyCon) === null || _b === void 0 ? void 0 : _b.enableStandardFullMode());
        await ((_c = this.joyCon) === null || _c === void 0 ? void 0 : _c.enableIMUMode());
        await ((_d = this.joyCon) === null || _d === void 0 ? void 0 : _d.enableVibration());
        this.opened = true;
    }
    async readProperty(property) {
        while (!this.opened) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return new Promise((resolve, reject) => {
            var _a;
            // Event handler listening for the property value, will remove itself after the first event.
            const getPropertiesHandler = async (event) => {
                var _a, _b, _c;
                const packet = event.detail;
                if (!packet || !packet.actualOrientation) {
                    return;
                }
                this.log(`Received <code>hidinput</code> event from Joy-Con: <code>${JSON.stringify(packet)}</code>`, 'hid', (_a = this.device) === null || _a === void 0 ? void 0 : _a.productName);
                this.log('Removing <code>hidinput</code> event listener', 'hid', (_b = this.device) === null || _b === void 0 ? void 0 : _b.productName);
                (_c = this.joyCon) === null || _c === void 0 ? void 0 : _c.removeEventListener('hidinput', getPropertiesHandler);
                if (property === 'accelerometers') {
                    // convert object with _raw, _hex and acc properties only return the acc property
                    // iterate over the 3 accelerometer results
                    for (const key in packet.accelerometers) {
                        // directly return acc property
                        packet.accelerometers[key]['x'] =
                            packet.accelerometers[key]['x'].acc;
                        packet.accelerometers[key]['y'] =
                            packet.accelerometers[key]['y'].acc;
                        packet.accelerometers[key]['z'] =
                            packet.accelerometers[key]['z'].acc;
                    }
                }
                resolve(packet[property]);
            };
            // add event listener
            this.log('Adding <code>hidinput</code> event listener', 'hid', (_a = this.device) === null || _a === void 0 ? void 0 : _a.productName);
            // Joy-Cons may sleep until touched, so attach the listener dynamically.
            setInterval(async () => {
                var _a, _b, _c, _d, _e;
                if (!this.eventListenerAttached) {
                    await ((_a = this.joyCon) === null || _a === void 0 ? void 0 : _a.open());
                    await ((_b = this.joyCon) === null || _b === void 0 ? void 0 : _b.enableStandardFullMode());
                    await ((_c = this.joyCon) === null || _c === void 0 ? void 0 : _c.enableIMUMode());
                    await ((_d = this.joyCon) === null || _d === void 0 ? void 0 : _d.enableVibration());
                    (_e = this.joyCon) === null || _e === void 0 ? void 0 : _e.addEventListener('hidinput', getPropertiesHandler);
                    this.eventListenerAttached = true;
                }
            }, 2000);
        });
    }
}
//# sourceMappingURL=JoyCon.js.map