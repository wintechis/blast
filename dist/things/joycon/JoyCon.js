import { getThing, removeThing } from '../index.js';
import { JoyConLeft, JoyConRight } from 'joy-con-webhid';
import { getThingsLog, getWebHidDevice } from '../../blast_things.js';
import { throwError } from '../../blast_interpreter.js';
const thingsLog = getThingsLog();
export default class JoyCon {
    constructor(webHidId) {
        this.thing = null;
        this.exposedThing = null;
        this.joyCon = null;
        this.opened = false;
        this.eventListenerAttached = false;
        this.td = null;
        this.packet = null;
        this.inputHandler = () => undefined;
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
                        1: {
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
                        2: {
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
                        3: {
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
                    forms: [
                        {
                            href: '',
                        },
                    ],
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
                    forms: [
                        {
                            href: '',
                        },
                    ],
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
                    forms: [
                        {
                            href: '',
                        },
                    ],
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
                    forms: [
                        {
                            href: '',
                        },
                    ],
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
                    forms: [
                        {
                            href: '',
                        },
                    ],
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
                    forms: [
                        {
                            href: '',
                        },
                    ],
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
                        type: 'string',
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
                        type: 'string',
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
        this.open().then(() => {
            getThing(this.thingModel).then(thing => {
                this.thing = thing;
                this.exposedThing = this.thing;
                this.td = thing.getThingDescription();
                this.thing.expose();
                this.registerButtonEventEmitter();
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
        // wait until first data is received
        while (!this.packet) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        // return last received data
        return this.packet[property];
    }
    async registerButtonEventEmitter() {
        var _a, _b, _c, _d, _e;
        this.inputHandler = (event) => {
            var _a, _b;
            const packet = event.detail;
            if (!packet || !packet.actualOrientation) {
                return;
            }
            // if we have a previous packet, check if a button status has changed
            if (this.packet) {
                for (const i in packet.buttonStatus) {
                    // omit _raw and _hex
                    if (i === '_raw' || i === '_hex') {
                        continue;
                    }
                    const newButtonStatus = this.packet.buttonStatus || {};
                    const key = i;
                    // Check if button status changed
                    if (packet.buttonStatus[key] !== newButtonStatus[key]) {
                        if (packet.buttonStatus[i]) {
                            (_a = this.thing) === null || _a === void 0 ? void 0 : _a.emitEvent('buttonDown', i);
                        }
                        else {
                            (_b = this.thing) === null || _b === void 0 ? void 0 : _b.emitEvent('buttonUp', i);
                        }
                    }
                }
            }
            this.packet = packet;
        };
        while (!this.opened || !this.thing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (!this.eventListenerAttached) {
            await ((_a = this.joyCon) === null || _a === void 0 ? void 0 : _a.open());
            await ((_b = this.joyCon) === null || _b === void 0 ? void 0 : _b.enableStandardFullMode());
            await ((_c = this.joyCon) === null || _c === void 0 ? void 0 : _c.enableIMUMode());
            await ((_d = this.joyCon) === null || _d === void 0 ? void 0 : _d.enableVibration());
            (_e = this.joyCon) === null || _e === void 0 ? void 0 : _e.addEventListener('hidinput', this.inputHandler);
            this.eventListenerAttached = true;
        }
    }
    /**
     * Wrapper method for subscribing to JoyCon events.
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
     * Wrapper method for unsubscribing from all JoyCon events.
     */
    async unsubscribeAll() {
        var _a, _b;
        while (!this.opened) {
            // Wait for the thing to be initialized
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        thingsLog('Removing all Joy-Con listeners', 'hid', 'Joy-Con');
        // unsubcribeEvent is not yet implemented in node-wot, so we have to use this own implementation
        for (const eventName in (_a = this.exposedThing) === null || _a === void 0 ? void 0 : _a.events) {
            const es = (_b = this.exposedThing) === null || _b === void 0 ? void 0 : _b.events[eventName].getState();
            es.legacyListeners.length = 0;
        }
    }
    async destroy() {
        if (this.td) {
            await removeThing(this.td);
        }
    }
}
//# sourceMappingURL=JoyCon.js.map