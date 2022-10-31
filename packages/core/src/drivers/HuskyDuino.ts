import * as WoT from 'wot-typescript-definitions';
import {getWot} from '../wot/index';

export default class HuskyDuino {
  public thing: WoT.ConsumedThing | null = null;

  async init(webBluetoothId: string) {
    const td: WoT.ThingDescription = {
      '@context': [
        'https://www.w3.org/2019/wot/td/v1',
        'https://www.w3.org/2022/wot/td/v1.1',
        {
          sbo: 'http://example.org/simple-bluetooth-ontology#',
          bdo: 'http://example.org/binary-data-ontology#',
        },
        {'@language': 'en'},
      ],
      title: 'HuskyDuino',
      description: 'A HuskyLens interface running on Arduino.',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      '@type': 'Thing',
      security: ['nosec_sc'],

      'sbo:hasGAPRole': 'sbo:Peripheral',
      'sbo:isConnectable': true,
      'sbo:hasAdvertisingIntervall': {
        'qudt:numericValue': 200,
        'qutdUnit:unit': 'qudtUnit:MilliSEC',
      },

      properties: {
        algorithm: {
          type: 'integer',
          observable: false,
          readOnly: false,
          writeOnly: false,
          description: 'The currently active algorithm',

          minimum: 1,
          maximum: 7,

          'bdo:bytelength': 1,
          forms: [
            {
              href: `ble-web+gatt://${webBluetoothId}/5be35d20-f9b0-11eb-9a03-0242ac130003/5be35d26-f9b0-11eb-9a03-0242ac130003`,
              op: 'readproperty',
              'sbo:methodName': 'sbo:read',
              contentType: 'application/x.binary-data-stream',
            },
            {
              href: `ble-web+gatt://${webBluetoothId}/5be35d20-f9b0-11eb-9a03-0242ac130003/5be35d26-f9b0-11eb-9a03-0242ac130003`,
              op: 'writeproperty',
              'sbo:methodName': 'sbo:write-without-response',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
        id: {
          type: 'string',
          observable: false,
          readOnly: true,
          writeOnly: false,
          description: 'The ID of the face or object',

          forms: [
            {
              href: `ble-web+gatt://${webBluetoothId}/5be35d20-f9b0-11eb-9a03-0242ac130003/5be3628a-f9b0-11eb-9a03-0242ac130003`,
              op: 'readproperty',
              'sbo:methodName': 'sbo:read',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
        location: {
          type: 'string',
          observable: false,
          readOnly: true,
          writeOnly: false,
          description: 'The location of the face or object',

          forms: [
            {
              href: `ble-web+gatt://${webBluetoothId}/5be35d20-f9b0-11eb-9a03-0242ac130003/5be3628a-f9b0-11eb-9a03-0242ac130003`,
              op: 'readproperty',
              'sbo:methodName': 'sbo:read',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
      },
      actions: {
        forgetAll: {
          description: 'Forget all faces and objects',
          input: {
            type: 'string',
            enum: ['true'],
          },
          forms: [
            {
              href: `ble-web+gatt://${webBluetoothId}/5be35d20-f9b0-11eb-9a03-0242ac130003/5be361b8-f9b0-11eb-9a03-0242ac130003`,
              op: 'invokeaction',
              'sbo:methodName': 'sbo:write-without-response',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },

        learn: {
          description: 'Learn a new face or object.',
          input: {
            type: 'integer',
            minimum: 0,
            maximum: 255,
            'bdo:bytelength': 1,
            description: 'The ID of the face or object to learn.',
          },
          forms: [
            {
              href: `ble-web+gatt://${webBluetoothId}/5be35d20-f9b0-11eb-9a03-0242ac130003/5be35eca-f9b0-11eb-9a03-0242ac130003`,
              op: 'invokeaction',
              'sbo:methodName': 'sbo:write-without-response',
              contentType: 'application/x.binary-data-stream',
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
