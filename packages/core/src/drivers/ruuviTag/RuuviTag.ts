// DEPRECATED, THIS FILE IS NOT YET UPDATED TO WORK WITH NEW WOT API
import * as WoT from 'wot-typescript-definitions';
import {getWot} from '../index.js';

export default class RuuviTag {
  public thing: WoT.ConsumedThing | null = null;

  async init(webBluetoothId: string): Promise<WoT.ConsumedThing> {
    const td: WoT.ThingDescription = {
      '@context': ['https://www.w3.org/2019/wot/td/v1'],
      '@type': ['Thing'],
      id: 'blast:Bluetooth:RuuviTag',
      title: 'Ruuvi Tag',
      description:
        'RuuviTag is a wireless Bluetooth sensor node that measures temperature, air humidity, and movement.',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      security: 'nosec_sc',
      events: {
        manufacturerData: {
          title: 'Ruuvi Data V5',
          description: 'The RuuviTag data in version 5 format',
          data: {
            type: 'object',
            properties: {
              accelerationX: {
                description: 'Acceleration in X axis',
                type: 'number',
                readOnly: true,
                unit: 'g',
                multipleOf: 0.1,
              },
              accelerationY: {
                description: 'Acceleration in Y axis',
                type: 'number',
                readOnly: true,
                unit: 'g',
                multipleOf: 0.1,
              },
              accelerationZ: {
                description: 'Acceleration in Z axis',
                type: 'number',
                readOnly: true,
                unit: 'g',
                multipleOf: 0.1,
              },
              battery: {
                description: 'Battery level in %',
                type: 'number',
                readOnly: true,
                unit: '%',
                minimum: 0,
                maximum: 100,
                multipleOf: 0.1,
              },
              humidity: {
                description: 'Relative humidity in %',
                type: 'number',
                readOnly: true,
                unit: '%',
                minimum: 0,
                maximum: 100,
                multipleOf: 0.1,
              },
              pressure: {
                description: 'Air pressure in hPa',
                type: 'number',
                readOnly: true,
                unit: 'hPa',
                minimum: 300,
                maximum: 1100,
                multipleOf: 0.1,
              },
              temperature: {
                description: 'Temperature in Celsius',
                type: 'number',
                readOnly: true,
                unit: '°C',
                minimum: -40,
                maximum: 80,
                multipleOf: 0.1,
              },
              txPower: {
                description: 'Transmission power in dBm',
                type: 'number',
                readOnly: true,
                unit: 'dBm',
                minimum: -100,
                maximum: 20,
                multipleOf: 0.1,
              },
              movementCounter: {
                description: 'Movement counter',
                type: 'number',
                readOnly: true,
                minimum: 0,
                multipleOf: 1,
              },
              measurementSequenceNumber: {
                description: 'Measurement sequence number',
                type: 'number',
                readOnly: true,
                minimum: 0,
                multipleOf: 1,
              },
              mac: {
                description: 'MAC address',
                type: 'string',
                readOnly: true,
              },
            },
          },
          forms: [
            {
              href: 'gatt://startLEScan',
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
