import * as WoT from 'wot-typescript-definitions';
import {getWot} from '../../wot/index.js';

export default class XiamoiThermometer {
  public thing: WoT.ConsumedThing | null = null;

  async init(webBluetoothId: string): Promise<WoT.ConsumedThing> {
    const td: WoT.ThingDescription = {
      '@context': ['https://www.w3.org/2019/wot/td/v1'],
      '@type': ['Thing'],
      id: 'blast:Bluetooth:xiamoiThermometer',
      title: 'Xiaomi Thermometer',
      description:
        'The Xiaomi Thermometer is a temperature and humidity sensor with a Bluetooth Low Energy interface.',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      security: 'nosec_sc',
      events: {
        measurements: {
          title: 'Temperature and humidity measurements',
          description:
            'The temperature and humidity values measured by the thermometer.',
          type: 'object',
          properties: {
            temperature: {
              title: 'temperature value measured by the thermometer.',
              description: 'The temperature value measured by the thermometer.',
              unit: '°C',
              type: 'number',
            },
            humidity: {
              title: 'humidity',
              description: 'The relative humidity measured by the thermometer.',
              unit: '%',
              type: 'number',
            },
          },
          forms: [
            {
              href: 'gatt://ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6/ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6/subscribe',
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
