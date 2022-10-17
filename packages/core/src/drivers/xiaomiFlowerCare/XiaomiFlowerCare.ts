import * as WoT from 'wot-typescript-definitions';
import {getWot} from '../../wot/index.js';

export default class XiaomiFlowerCare {
  public thing: WoT.ConsumedThing | null = null;

  async init(webBluetoothId: string): Promise<WoT.ConsumedThing> {
    const td: WoT.ThingDescription = {
      '@context': [
        'https://www.w3.org/2019/wot/td/v1',
        'https://www.w3.org/2022/wot/td/v1.1',
        {
          sbo: 'https://freumi.inrupt.net/SimpleBluetoothOntology.ttl#',
          bdo: 'https://freumi.inrupt.net/BinaryDataOntology.ttl#',
          qudt: '',
          qudtUnit: '',
        },
        {'@language': 'en'},
      ],
      title: 'Flower Care',
      description: 'A Xiaomi Flower Care Sensor.',
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
        'qudt:numericValue': 2000,
        'qutdUnit:unit': 'qudtUnit:MilliSEC',
      },

      properties: {
        valueString: {
          type: 'array',

          observable: false,
          readOnly: true,
          writeOnly: false,
          description: 'The Values of the device',

          'bdo:pattern': '{temp}00{brightness}{moisture}{conduct}023c00fb349b',
          'bdo:variables': {
            temp: {
              type: 'integer',
              'bdo:bytelength': 2,
              'bdo:scale': 0.1,
              description: 'The current temperature value.',
            },
            brightness: {
              type: 'integer',
              'bdo:bytelength': 4,
              description: 'The current brightness value.',
            },
            moisture: {
              type: 'integer',
              'bdo:bytelength': 1,
              description: 'The current moisture value.',
            },
            conduct: {
              type: 'integer',
              'bdo:bytelength': 2,
              description: 'The current conductivity value.',
            },
          },
          forms: [
            {
              href: `ble-web+gatt://${webBluetoothId}/00001204-0000-1000-8000-00805f9b34fb/00001a01-0000-1000-8000-00805f9b34fb`,
              op: 'readproperty',
              'sbo:methodName': 'sbo:read',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
      },
      actions: {
        readMode: {
          type: 'string',
          observable: false,
          readOnly: false,
          writeOnly: true,
          description: 'Enable write mode',

          input: {
            type: 'string',
            format: 'hex',
            enum: ['A01F'],
            'bdo:bytelength': 2,
            description: 'The command "A01F" enables write mode.',
          },

          forms: [
            {
              href: `ble-web+gatt://${webBluetoothId}/00001204-0000-1000-8000-00805f9b34fb/00001a00-0000-1000-8000-00805f9b34fb`,
              op: 'invokeaction',
              'sbo:methodName': 'sbo:write',
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
