import * as WoT from 'wot-typescript-definitions';
import {getThing, removeThing} from '../index.js';
import {JoyConLeft, JoyConRight} from 'joy-con-webhid';
import {getWebHidDevice} from '../../blast_things.js';
import {throwError} from '../../blast_interpreter.js';
import type {Packet} from './types';
import {ExposedThing} from '@node-wot/core';

export class JoyCon {
  private thing: WoT.ExposedThing | null = null;
  private exposedThing: ExposedThing | null = null;
  private joyCon: JoyConLeft | JoyConRight | null = null;
  private opened = false;
  private eventListenerAttached = false;
  public td: WoT.ThingDescription;
  private webHidId: string;
  private packet: Packet | null = null;
  private inputHandler: Function | undefined;

  public thingModel: WoT.ThingDescription = {
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
        description:
          'The angular velocity (rps and dps) based on all 3 gyroscopes, on 3 axis',
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
        description:
          'The angular velocity (rps and dps) measured by the 3 gyroscopes',
        type: 'object',
        properties: {
          gyroscope1: {
            title: 'Gyroscope 1',
            description:
              'The angular velocity (rps and dps) measured by the first gyroscope',
            type: 'object',
            properties: {
              rps: {
                title: 'RPS',
                description:
                  'The angular velocity in revolutions per second measured by the first gyroscope',
                type: 'number',
                unit: 'rps',
                readOnly: true,
                properties: {
                  x: {
                    title: 'X',
                    description:
                      'The angular velocity in revolutions per second in the X-axis, measured by the first gyroscope',
                    type: 'number',
                    unit: 'rps',
                    readOnly: true,
                  },
                  y: {
                    title: 'Y',
                    description:
                      'The angular velocity in revolutions per second in the Y-axis, measured by the first gyroscope',
                    type: 'number',
                    unit: 'rps',
                    readOnly: true,
                  },
                  z: {
                    title: 'Z',
                    description:
                      'The angular velocity in revolutions per second in the Z-axis, measured by the first gyroscope',
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
            description:
              'The angular velocity (rps and dps) measured by the second gyroscope',
            type: 'object',
            properties: {
              rps: {
                title: 'RPS',
                description:
                  'The angular velocity in revolutions per second measured by the second gyroscope',
                type: 'number',
                unit: 'rps',
                readOnly: true,
                properties: {
                  x: {
                    title: 'X',
                    description:
                      'The angular velocity in revolutions per second in the X-axis, measured by the second gyroscope',
                    type: 'number',
                    unit: 'rps',
                    readOnly: true,
                  },
                  y: {
                    title: 'Y',
                    description:
                      'The angular velocity in revolutions per second in the Y-axis, measured by the second gyroscope',
                    type: 'number',
                    unit: 'rps',
                    readOnly: true,
                  },
                  z: {
                    title: 'Z',
                    description:
                      'The angular velocity in revolutions per second in the Z-axis, measured by the second gyroscope',
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
            description:
              'The angular velocity (rps and dps) measured by the third gyroscope',
            type: 'object',
            properties: {
              rps: {
                title: 'RPS',
                description:
                  'The angular velocity in revolutions per second measured by the third gyroscope',
                type: 'number',
                unit: 'rps',
                readOnly: true,
                properties: {
                  x: {
                    title: 'X',
                    description:
                      'The angular velocity in revolutions per second in the X-axis, measured by the third gyroscope',
                    type: 'number',
                    unit: 'rps',
                    readOnly: true,
                  },
                  y: {
                    title: 'Y',
                    description:
                      'The angular velocity in revolutions per second in the Y-axis, measured by the third gyroscope',
                    type: 'number',
                    unit: 'rps',
                    readOnly: true,
                  },
                  z: {
                    title: 'Z',
                    description:
                      'The angular velocity in revolutions per second in the Z-axis, measured by the third gyroscope',
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
          type: 'string',
        },
      },
      buttonDown: {
        title: 'Button down event',
        description: 'Triggered when a button is pressed',
        data: {
          type: 'string',
        },
      },
    },
  };

  constructor(webHidId: string) {
    this.webHidId = webHidId;
    this.open().then(() => {
      getThing(this.thingModel).then(thing => {
        this.thing = thing;
        this.exposedThing = this.thing as unknown as ExposedThing;
        this.td = thing.getThingDescription();
        this.thing.expose();
        this.registerButtonEventEmitter();
      });
    });
  }

  private async open(): Promise<void> {
    const device = getWebHidDevice(this.webHidId);
    if (!device) {
      throwError('Could not find device, in connected webHID devices');
      return;
    }

    if (!device.opened) {
      try {
        await device.open();
      } catch (error) {
        throwError(
          "Failed to open device, your browser or OS probably doesn't support webHID."
        );
      }
    }

    // Check if device is a Joy-Con.
    if (
      device.vendorId !== 1406 ||
      (device.productId !== 0x2006 && device.productId !== 0x2007)
    ) {
      throwError('The connected device is not a Joy-Con.');
      return;
    }

    if (device.productId === 0x2006) {
      this.joyCon = new JoyConLeft(device);
    } else if (device.productId === 0x2007) {
      this.joyCon = new JoyConRight(device);
    }
    await this.joyCon?.open();
    await this.joyCon?.enableStandardFullMode();
    await this.joyCon?.enableIMUMode();
    await this.joyCon?.enableVibration();

    this.opened = true;
  }

  async readProperty(property: keyof Packet): Promise<any> {
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

  private async registerButtonEventEmitter() {
    this.inputHandler = (event: any) => {
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
          const key = i as keyof typeof newButtonStatus;
          // Check if button status changed
          if (packet.buttonStatus[key] !== newButtonStatus[key]) {
            if (packet.buttonStatus[i]) {
              this.thing?.emitEvent('buttonDown', i);
            } else {
              this.thing?.emitEvent('buttonUp', i);
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
      await this.joyCon?.open();
      await this.joyCon?.enableStandardFullMode();
      await this.joyCon?.enableIMUMode();
      await this.joyCon?.enableVibration();
      this.joyCon?.addEventListener('hidinput', this.inputHandler);
      this.eventListenerAttached = true;
    }
  }

  /**
   * Wrapper method for subscribing to JoyCon events.
   */
  public async subscribeEvent(eventName: string, fn: (...args: any[]) => void) {
    while (!this.opened) {
      // Wait for the thing to be initialized
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.exposedThing?.subscribeEvent(eventName, fn);
  }

  /**
   * Wrapper method for unsubscribing from all JoyCon events.
   */
  public async unsubscribeAll() {
    while (!this.opened) {
      // Wait for the thing to be initialized
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    // for (const eventName of Object.keys(this.exposedThing.events)) {
    //   this.exposedThing.unsubscribeEvent(eventName);
    // }
    // unsubscribeEvent is not implemented, so instead we destroy the thing
    this.destroy();
    this.joyCon.removeEventListener('hidInput', this.inputHandler);
  }

  private destroy() {
    removeThing(this.td?.id);
  }
}
