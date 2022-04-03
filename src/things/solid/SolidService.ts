import {ExposedThing} from '@node-wot/core';
import * as WoT from 'wot-typescript-definitions';
import {getThing, removeThing} from '../index.js';
import {throwError} from '../../blast_interpreter.js';
import {saveFileInContainer} from '@inrupt/solid-client';

export default class SolidService {
  private thing: WoT.ExposedThing | null = null;
  private exposedThing: ExposedThing | null = null;
  private td: WoT.ThingDescription;

  public thingModel: WoT.ThingDescription = {
    '@context': ['https://www.w3.org/2019/wot/td/v1'],
    '@type': ['Thing'],
    id: 'blast:Service:SolidService',
    title: 'Solid Service',
    description: 'This service provides a wrapper operations on Solid Pods',
    securityDefinitions: {
      nosec_sc: {
        scheme: 'nosec',
      },
    },
    security: 'nosec_sc',
    actions: {
      uploadImage: {
        title: 'Upload an image',
        description: 'Upload an image to a Solid Pod',
        input: {
          type: 'object',
          properties: {
            image: {
              type: 'string',
              description: 'The image to upload as data URI',
            },
            uri: {
              type: 'string',
              description: 'URI of the solid container',
            },
            required: ['image', 'uri'],
          },
        },
      },
    },
  };

  constructor() {
    getThing(this.thingModel).then(thing => {
      this.thing = thing;
      this.exposedThing = this.thing as unknown as ExposedThing;
      this.td = thing.getThingDescription();
      this.setActionHandlers();
      this.thing.expose();
    });
  }

  private setActionHandlers() {
    this.thing?.setActionHandler('uploadImage', async parameters => {
      const {image, uri} = parameters as unknown as {
        image: string;
        uri: string;
      };
      return this.uploadImage(image, uri);
    });
  }

  private async uploadImage(image: string, uri: string): Promise<any> {
    // convert base64/URLEncoded data component to raw binary data held in a string
    // eslint-disable-next-line no-undef
    const byteString = atob(image.split(',')[1]);

    // seperate out the mime component
    const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    // eslint-disable-next-line no-undef
    const blob = new Blob([ia], {type: mimeString});

    try {
      await saveFileInContainer(uri, blob);
    } catch (e: any) {
      throwError(e);
      console.error(e);
    }
  }

  public async invokeAction(action: string, parameters: any): Promise<any> {
    while (!this.exposedThing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.exposedThing.invokeAction(action, parameters);
  }

  public async getThingDescription(): Promise<WoT.ThingDescription> {
    while (!this.thing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.td;
  }

  public async destroy() {
    removeThing(this.td?.id);
  }
}
