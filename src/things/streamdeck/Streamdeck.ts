// eslint-disable-next-line node/no-unpublished-import
import * as WoT from 'wot-typescript-definitions';
import {getThingsLog, getWebHidDevice} from '../../blast_things.js';
import {throwError} from '../../blast_interpreter.js';
import {openDevice, StreamDeckWeb} from '@elgato-stream-deck/webhid';
import {getThing} from '../index.js';

const thingsLog = getThingsLog();

export class Streamdeck {
  public thing: WoT.ExposedThing | null = null;
  public td: WoT.ThingDescription;
  private streamdeck: StreamDeckWeb | null = null;
  private webHidId: string;

  public thingModel: WoT.ThingDescription = {
    '@context': ['https://www.w3.org/2019/wot/td/v1'],
    '@type': ['Thing'],
    id: 'blast:webhid:streamdeck', // this should normally be an URI, need to figure out a how to properly identify tds
    title: 'Streamdeck',
    description: 'elGato Streamdeck',
    securityDefinitions: {
      nosec_sc: {
        scheme: 'nosec',
      },
    },
    security: 'nosec_sc',
    properties: {
      buttonColors: {
        title: 'Button colors',
        description: 'The colors of the streamdeck buttons',
        type: 'array',
        items: {
          type: 'object',
        },
        readOnly: false,
      },
      buttonText: {
        title: 'Button text',
        description: 'The text of the streamdeck buttons',
        type: 'array',
        items: {
          type: 'string',
        },
        readOnly: false,
      },
      brightness: {
        title: 'Brightness',
        description: 'The brightness of the streamdeck',
        unit: '%',
        type: 'integer',
        readOnly: false,
      },
    },
  };

  constructor(webHidId: string) {
    this.webHidId = webHidId;
    getThing(this.thingModel).then(thing => {
      this.thing = thing;
      this.td = thing.getThingDescription();
      this.addPropertyHandlers();
      this.thing.expose();
    });
    open();
  }

  private async open(): Promise<StreamDeckWeb> {
    const device = getWebHidDevice(this.webHidId);
    let sd;
    try {
      sd = await openDevice(device);
      return sd;
    } catch (e: any) {
      // if InvalidStateError error, device is probably already opened
      if (e.name === 'InvalidStateError') {
        device.close();
        sd = await openDevice(device);
        return sd;
      } else {
        throwError(e);
        throw new Error(e);
      }
    }
  }

  private addPropertyHandlers(): void {
    if (this.thing) {
      this.thing.setPropertyWriteHandler('buttonColors', value => {
        return this.setButtonColors(
          value as unknown as Array<{id: number; color: string}>
        );
      });
    }
  }
  /**
   * @param {String} buttons string containing pushed buttons.
   * @param {String} color color to fill the buttons with, as hex value.
   */
  private async setButtonColors(
    buttonColors: Array<{id: number; color: string}>
  ): Promise<void> {
    if (!this.streamdeck) {
      this.streamdeck = await this.open();
    }
    // Iterate over the buttons and set the color
    for (const button of buttonColors) {
      // convert color to rgb
      const color = button.color;
      const red = parseInt(color.substring(1, 3), 16);
      const green = parseInt(color.substring(3, 5), 16);
      const blue = parseInt(color.substring(5, 7), 16);

      // fill button with color
      const id = button.id;
      thingsLog(
        `Invoke <code>fillKeyColor</code> with value <code>${[
          id,
          red,
          green,
          blue,
        ].toString()}</code>`,
        'hid',
        this.streamdeck.PRODUCT_NAME
      );
      await this.streamdeck.fillKeyColor(id, red, green, blue);
      thingsLog(
        'Finished <code>fillKeyColor</code>',
        'hid',
        this.streamdeck.PRODUCT_NAME
      );
    }
  }

  writeProperty(property: string, value: any): void {
    switch (property) {
      case 'buttonColors':
        this.setButtonColors(value as Array<{id: number; color: string}>);
        break;
      case 'buttonText':
        // this.setButtonText(value as Array<string>);
        break;
      case 'brightness':
        // this.setBrightness(value as number);
        break;
    }
  }
}
