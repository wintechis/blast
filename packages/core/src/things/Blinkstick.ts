import * as WoT from 'wot-typescript-definitions';
import {getWot} from './index.js';

export default class Blinkstick {
  private thing: WoT.ConsumedThing | null = null;

  public thingModel: WoT.ThingDescription | null = null;

  public async init(webHidId: string): Promise<WoT.ConsumedThing> {
    const td: WoT.ThingDescription = {
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
              href: 'hid://sendFeatureReport',
              'wHid:id': webHidId,
            },
          ],
        },
      },
    };
    const wot = await getWot();
    const thing = await wot.consume(td);
    this.thing = thing;
    return thing;
  }
}
