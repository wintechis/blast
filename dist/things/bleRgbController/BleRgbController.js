import { getWot } from '../index.js';
export default class BleRgbController {
    constructor() {
        this.thing = null;
    }
    async init(webBluetoothId) {
        const td = {
            '@context': ['https://www.w3.org/2019/wot/td/v1'],
            '@type': ['Thing'],
            id: 'blast:Bluetooth:ledController',
            title: 'BLE RGB Controller',
            description: 'A Bluetooth Low Energy (BLE) controller that can be used to control RGB LED lights.',
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
                            href: 'gatt://0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb/writeWithoutResponse',
                            'wbt:id': webBluetoothId,
                            contentType: 'text/plain',
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
//# sourceMappingURL=BleRgbController.js.map