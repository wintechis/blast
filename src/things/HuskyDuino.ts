import * as WoT from 'wot-typescript-definitions';
import {getWot} from './index.js';

export default class HuskyDuino {
  public thing: WoT.ConsumedThing | null = null;

  async init(webBluetoothId: string) {
    const td: WoT.ThingDescription = {
      '@context': ['https://www.w3.org/2019/wot/td/v1'],
      '@type': ['Thing'],
      id: 'blast:bluetooth:HuskyDuino',
      title: 'HuskyDuino',
      description: 'A HuskyLens interface running on Arduino',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      security: 'nosec_sc',
      properties: {
        algorithm: {
          description: 'The currently active algorithm',
          type: 'number',
          readOnly: false,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://5be35d20-f9b0-11eb-9a03-0242ac130003/5be35d26-f9b0-11eb-9a03-0242ac130003/readNumber',
              'wbt:id': webBluetoothId,
            },
            {
              op: 'writeproperty',
              href: 'gatt://5be35d20-f9b0-11eb-9a03-0242ac130003/5be35d26-f9b0-11eb-9a03-0242ac130003/writeWithoutResponse',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        id: {
          description: 'The ID of the face or object',
          type: 'string',
          readOnly: false,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://5be35d20-f9b0-11eb-9a03-0242ac130003/5be35eca-f9b0-11eb-9a03-0242ac130003/readText',
              'wbt:id': webBluetoothId,
            },
            {
              op: 'writeproperty',
              href: 'gatt://5be35d20-f9b0-11eb-9a03-0242ac130003/5be35eca-f9b0-11eb-9a03-0242ac130003/writeWithoutResponse',
              'wbt:id': webBluetoothId,
            },
          ],
        },
      },
      actions: {
        forgetAll: {
          title: 'Forget all faces and objects',
          description: 'Forget all faces and objects',
          input: {
            type: 'null',
          },
          forms: [
            {
              href: 'gatt://5be35d20-f9b0-11eb-9a03-0242ac130003/5be361b8-f9b0-11eb-9a03-0242ac130003/writeWithoutResponse',
              'wbt:id': webBluetoothId,
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
