import * as WoT from 'wot-typescript-definitions';
import {getWot} from '../../wot/index.js';

export default class BleRgbController {
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
      title: 'BLE RGB Controller',
      description:
        'A Bluetooth Low Energy (BLE) controller that can be used to control RGB LED lights.',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      '@type': ['Thing', 'sbo:BluetoothLEDevice'],
      security: ['nosec_sc'],
      'sbo:hasGAPRole': 'sbo:Peripheral',
      'sbo:isConnectable': true,
      'sbo:hasAdvertisingIntervall': {
        'qudt:numericValue': 50,
        'qutdUnit:unit': 'qudtUnit:MilliSEC',
      },
      properties: {
        colour: {
          title: 'colour',
          description: 'The colour of the LED light.',
          unit: '',
          type: 'string',
          format: 'hex',
          observable: false,
          readOnly: false,
          writeOnly: true,
          'bdo:pattern': '7e000503{R}{G}{B}00ef',
          'bdo:variables': {
            R: {
              type: 'integer',
              'bdo:bytelength': 1,
              minimum: 0,
              maximum: 255,
              description: 'Red value.',
            },
            G: {
              type: 'integer',
              'bdo:bytelength': 1,
              minimum: 0,
              maximum: 255,
              description: 'Green value.',
            },
            B: {
              type: 'integer',
              'bdo:bytelength': 1,
              minimum: 0,
              maximum: 255,
              description: 'Blue value.',
            },
          },
          forms: [
            {
              href: `ble-web+gatt://${webBluetoothId}/0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb`,
              op: 'writeproperty',
              'sbo:methodName': 'sbo:write-without-response',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
        power: {
          type: 'string',
          format: 'hex',

          observable: false,
          readOnly: false,
          writeOnly: true,
          description: 'The power switch of the controller.',

          'bdo:pattern': '7e0004{is_on}00000000ef',
          'bdo:variables': {
            is_on: {
              type: 'integer',
              minimum: 0,
              maximum: 1,
              'bdo:bytelength': 1,
            },
          },
          forms: [
            {
              href: `gatt://${webBluetoothId}/0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb`,
              op: ['writeproperty'],
              'sbo:methodName': 'sbo:write',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
        effect: {
          type: 'string',
          format: 'hex',

          observable: false,
          readOnly: false,
          writeOnly: true,
          description: 'The effect of the LED light.',

          'bdo:pattern': '7e0003{type}03000000ef',
          'bdo:variables': {
            type: {
              type: 'integer',
              minimum: 128,
              maximum: 156,
              'bdo:bytelength': 1,
            },
          },
          forms: [
            {
              href: `gatt://${webBluetoothId}/0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb`,
              op: ['writeproperty'],
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
