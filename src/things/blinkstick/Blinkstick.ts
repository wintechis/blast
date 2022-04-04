import {ExposedThing} from '@node-wot/core';
import * as WoT from 'wot-typescript-definitions';
import {throwError} from '../../blast_interpreter.js';
import {getThingsLog} from '../../blast_things.js';
import {getWebHidDevice} from '../../blast_things.js';
import {getThing, removeThing} from '../index.js';

const thingsLog = getThingsLog();

interface LEDColour {
  index: number;
  red: number;
  green: number;
  blue: number;
}

export default class Blinkstick {
  private thing: WoT.ExposedThing | null = null;
  private exposedThing: ExposedThing | null = null;
  private webHidId: string;
  private opened = false;
  private td: WoT.ThingDescription | null = null;
  private blinkstick: HIDDevice | null = null;

  public thingModel: WoT.ThingDescription = {
    '@context': ['https://www.w3.org/2019/wot/td/v1'],
    '@type': ['Thing'],
    id: 'blast:webhid:blinkstick',
    title: 'Blinkstick',
    description:
      'The tulogic Blinkstick is a Smart LED controller with integrated USB firmware.',
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
        forms: [
          {
            href: '',
          },
        ],
      },
    },
  };

  constructor(webHidId: string) {
    this.webHidId = webHidId;
    getThing(this.thingModel).then(thing => {
      this.thing = thing;
      this.exposedThing = this.thing as unknown as ExposedThing;
      this.td = thing.getThingDescription();
      this.open().then(bs => {
        this.blinkstick = bs;
      });
      this.addPropertyHandlers();
      this.thing.expose();
    });
  }

  private async open(): Promise<any> {
    const device = getWebHidDevice(this.webHidId);

    if (!device) {
      throwError(
        'Connected device is not a HID device.\nMake sure you are connecting the Blinkstick via webHID.'
      );
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

  private addPropertyHandlers() {
    this.thing?.setPropertyWriteHandler('colours', value => {
      return this.setColour(value as unknown as LEDColour);
    });
  }

  private async setColour(value: LEDColour): Promise<void> {
    while (!this.opened) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    const {index, red, green, blue} = value;
    const reportId = 5;
    const report = Int8Array.from([reportId, index, red, green, blue]);

    const trySetColor = async (retries: number) => {
      try {
        thingsLog(
          `Invoke <code>sendFeatureReport</code> with value <code>${report}</code>`,
          'hid',
          this.blinkstick?.productName
        );
        await this.blinkstick?.sendFeatureReport(reportId, report);
        thingsLog(
          `Finished <code>sendFeatureReport</code> with value <code>${report}</code>`,
          'hid',
          this.blinkstick?.productName
        );
      } catch (error) {
        if (retries > 0) {
          await trySetColor(--retries);
        } else {
          console.error(error);
          throwError(
            'Failed to set BlinkStick colors, please check its connection.'
          );
        }
      }
    };
    await trySetColor(5);
  }

  public async destroy(): Promise<void> {
    if (this.td) {
      await removeThing(this.td);
    }
    await this.blinkstick?.close();
  }

  public async writeProperty(property: string, value: any) {
    while (!this.opened) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.exposedThing?.writeProperty(property, value);
  }

  public async getThingDescription(): Promise<WoT.ThingDescription | null> {
    while (!this.thing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.td;
  }
}
