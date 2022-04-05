import {Servient} from '@node-wot/core';
import {requestDevice} from '../../blast_webBluetooth.js';
// eslint-disable-next-line node/no-missing-import
import {WebBluetoothClientFactory} from './webBluetooth.js';

const servient = new Servient();
servient.addClientFactory(new WebBluetoothClientFactory());

export async function init() {
  const device = await requestDevice({
    id: 'bleLedController',
    name: 'LED Controller',
    type: 'bluetooth',
    blocks: [
      {
        type: 'switch_lights_rgb',
        category: 'Properties',
      },
    ],
    filters: [
      {
        namePrefix: 'ELK-',
      },
      // Service is not advertised so we can not filter for it.
      //{
      //     services: ['0000fff0-0000-1000-8000-00805f9b34fb'],
      //},
    ],
    infoUrl: 'https://github.com/wintechis/blast/wiki/Bluetooth-LED-controller',
    optionalServices: ['0000fff0-0000-1000-8000-00805f9b34fb'],
  });
  const webBluetoothId = device.id;

  const td = {
    '@context': ['https://www.w3.org/2019/wot/td/v1'],
    '@type': ['Thing'],
    id: 'blast:Bluetooth:ledController',
    title: 'BLE RGB Controller',
    description:
      'A Bluetooth Low Energy (BLE) controller that can be used to control RGB LED lights.',
    securityDefinitions: {
      nosec_sc: {
        scheme: 'nosec',
      },
    },
    security: 'nosec_sc',
    properties: {
      colour: {
        title: 'colour',
        description: 'The colour of the LED light.',
        unit: '',
        type: 'string',
        readOnly: false,
        writeOnly: true,
        forms: [
          {
            href: `bluetooth://${webBluetoothId}/0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb/writeWithoutResponse`,
            operation: 'writeWithResponse',
            contentType: 'text/plain',
          },
        ],
      },
    },
  };
  const WoT = await servient.start();
  const thing = await WoT.consume(td);

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue('7e000503ff000000ef');
      controller.close();
    },
  });

  thing.writeProperty('colour', stream);
}
