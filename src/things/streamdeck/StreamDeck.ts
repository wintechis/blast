import * as WoT from 'wot-typescript-definitions';
import {getThingsLog, getWebHidDevice} from '../../blast_things.js';
import {throwError} from '../../blast_interpreter.js';
import {openDevice, StreamDeckWeb} from '@elgato-stream-deck/webhid';
import {getThing, removeThing} from '../index.js';
import {ExposedThing} from '@node-wot/core';

const thingsLog = getThingsLog();

export default class StreamDeck {
  private thing: WoT.ExposedThing | null = null;
  private exposedThing: ExposedThing | null = null;
  private streamdeck: StreamDeckWeb | null = null;
  private webHidId: string;
  private opened = false;
  private td: WoT.ThingDescription | null = null;
  private eventListenerAttached = false;

  public thingModel: WoT.ThingDescription = {
    '@context': ['https://www.w3.org/2019/wot/td/v1'],
    '@type': ['Thing'],
    id: 'blast:webhid:streamdeck',
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
        forms: [
          {
            href: '',
          },
        ],
      },
      buttonText: {
        title: 'Button text',
        description: 'The text of the streamdeck buttons',
        type: 'array',
        items: {
          type: 'string',
        },
        readOnly: false,
        forms: [
          {
            href: '',
          },
        ],
      },
      brightness: {
        title: 'Brightness',
        description: 'The brightness of the streamdeck',
        unit: '%',
        type: 'integer',
        readOnly: false,
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
          type: 'integer',
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
          type: 'integer',
        },
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
      this.open().then(sd => {
        this.streamdeck = sd;
        this.registerButtonEventEmitter();
        this.addPropertyHandlers();
      });
      this.thing.expose();
    });
  }

  /**
   * Opens the streamdeck.
   * @returns {Promise<StreamDeckWeb>}
   */
  private async open(): Promise<StreamDeckWeb> {
    const device = getWebHidDevice(this.webHidId);
    let sd;
    try {
      sd = await openDevice(device);
      this.opened = true;
      return sd;
    } catch (e: any) {
      // if InvalidStateError error, device is probably already opened
      if (e.name === 'InvalidStateError') {
        device.close();
        sd = await openDevice(device);
        this.opened = true;
        return sd;
      } else {
        throwError(e);
        throw new Error(e);
      }
    }
  }

  private addPropertyHandlers() {
    this.thing?.setPropertyWriteHandler('buttonColors', parameters => {
      return this.setButtonColors(
        parameters as unknown as Array<{id: number; color: string}>
      );
    });
    this.thing?.setPropertyWriteHandler('brightness', parameters => {
      return this.setBrightness(parameters as unknown as number);
    });
    this.thing?.setPropertyWriteHandler('buttonText', parameters => {
      return this.setButtonText(
        parameters as unknown as Array<{id: number; text: string}>
      );
    });
  }

  /**
   * Sets the colors of the streamdeck buttons.
   */
  private async setButtonColors(
    buttonColors: Array<{id: number; color: string}>
  ): Promise<void> {
    while (!this.opened) {
      // Wait for the thing to be initialized
      await new Promise(resolve => setTimeout(resolve, 100));
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
        this.streamdeck?.PRODUCT_NAME
      );
      await this.streamdeck?.fillKeyColor(id, red, green, blue);
      thingsLog(
        'Finished <code>fillKeyColor</code>',
        'hid',
        this.streamdeck?.PRODUCT_NAME
      );
    }
  }

  /**
   * Sets the text of the streamdeck buttons.
   */
  private async setButtonText(buttonText: Array<{id: number; text: string}>) {
    while (!this.opened) {
      // Wait for the thing to be initialized
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const ps = [];
    // Iterate over the buttons and set the text
    for (const button of buttonText) {
      const id = button.id;
      const value = button.text;

      // Convert value to imageData
      const canvas = document.createElement('canvas');
      canvas.width = this.streamdeck?.ICON_SIZE || 0;
      canvas.height = this.streamdeck?.ICON_SIZE || 0;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get context');
      }
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = canvas.height * 0.8 + 'px Arial';
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;
      ctx.strokeText(value.toString(), 8, 60, canvas.width * 0.8);
      ctx.fillStyle = 'white';
      ctx.fillText(value.toString(), 8, 60, canvas.width * 0.8);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // write imageData to button
      thingsLog(
        `Invoke <code>fillKeyImageData</code> with value <code>${[
          id,
          imageData,
        ].toString()}</code>`,
        'hid',
        this.streamdeck?.PRODUCT_NAME
      );
      ps.push(
        this.streamdeck?.fillKeyBuffer(id, Buffer.from(imageData.data), {
          format: 'rgba',
        })
      );
      thingsLog(
        'Finished <code>fillKeyImageData</code>',
        'hid',
        this.streamdeck?.PRODUCT_NAME
      );
      ctx.restore();
    }
    await Promise.all(ps);
  }

  /**
   * Sets the brightness of the streamdeck.
   */
  private async setBrightness(brightness: number) {
    while (!this.opened) {
      // Wait for the thing to be initialized
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    thingsLog(
      `Invoke <code>setBrightness</code> with value <code>${brightness}</code>`,
      'hid',
      this.streamdeck?.PRODUCT_NAME
    );
    await this.streamdeck?.setBrightness(brightness);
    thingsLog(
      'Finished <code>setBrightness</code>',
      'hid',
      this.streamdeck?.PRODUCT_NAME
    );
  }

  /**
   * Wrapper method for writing streamdeck properties.
   */
  async writeProperty(property: string, value: any): Promise<void> {
    while (!this.opened) {
      // Wait for the thing to be initialized
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.exposedThing?.writeProperty(property, value);
  }

  /**
   * Wrapper method for reading streamdeck properties.
   */
  async readProperty(property: string): Promise<any> {
    // NOT IMPLEMENTED
    return null;
  }

  /**
   * Registers buttonUp and buttonDown event emitters.
   */
  private async registerButtonEventEmitter() {
    while (!this.opened) {
      // Wait for the thing to be initialized
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.streamdeck?.on('down', (id: number) => {
      this.emitEvent('buttonDown', {id, pressed: 'down'});
    });
    this.streamdeck?.on('up', (id: number) => {
      this.emitEvent('buttonUp', {id, pressed: 'up'});
    });
    this.eventListenerAttached = true;
  }

  /**
   * Wrapper method for emitting streamdeck events.
   */
  private async emitEvent(eventName: string, eventData: any) {
    while (!this.opened) {
      // Wait for the thing to be initialized
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.thing?.emitEvent(eventName, eventData);
  }

  /**
   * Wrapper method for subscribing to streamdeck events.
   */
  public async subscribeEvent(eventName: string, fn: (...args: any[]) => void) {
    while (!this.opened) {
      // Wait for the thing to be initialized
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (!this.eventListenerAttached) {
      await this.registerButtonEventEmitter();
    }
    this.exposedThing?.subscribeEvent(eventName, fn);
  }

  /**
   * Wrapper method for unsubscribing from all streamdeck events.
   */
  public async unsubscribeAll() {
    while (!this.opened) {
      // Wait for the thing to be initialized
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    thingsLog(
      'Removing all streamdeck listeners',
      'hid',
      this.streamdeck?.PRODUCT_NAME
    );
    // unsubcribeEvent is not yet implemented in node-wot, so we have to use this own implementation
    for (const eventName in this.exposedThing?.events) {
      const es = this.exposedThing?.events[eventName].getState();
      es.legacyListeners.length = 0;
    }
    this.streamdeck?.removeAllListeners();
    this.eventListenerAttached = false;
  }

  public async getThingDescription(): Promise<WoT.ThingDescription | null> {
    while (!this.thing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.td;
  }

  private async destroy() {
    if (this.td) {
      await removeThing(this.td);
    }
    this.streamdeck?.close();
  }
}
