import BleRgbController from '../../dist/things/BleRgbController.js';
import Blockly from 'blockly';
import chai from 'chai';
import sinon from 'sinon';

import '../../dist/thingBlocks/ble_rgb_led_controller/blocks.js';
import '../../dist/thingBlocks/ble_rgb_led_controller/generators.js';

const {expect} = chai;

suite('BLE RGB Controller', function () {
  this.thing = null;

  suiteTeardown(() => {
    sinon.restore();
  });

  setup(async function () {
    this.workspace = new Blockly.Workspace();
    this.thing = await new BleRgbController().init('deadbeef');
  });

  teardown(function () {
    this.thing = null;
  });

  test('Thing description', async function () {
    const actualTd = this.thing.getThingDescription();
    const expectedTd = {
      '@context': ['https://www.w3.org/2019/wot/td/v1', {'@language': 'en'}],
      '@type': ['Thing'],
      id: 'blast:Bluetooth:ledController',
      title: 'BLE RGB Controller',
      description:
        'A Bluetooth Low Energy (BLE) controller that can be used to control RGB LED lights.',
      securityDefinitions: {nosec_sc: {scheme: 'nosec'}},
      security: ['nosec_sc'],
      properties: {
        colour: {
          title: 'colour',
          description: 'The colour of the LED light.',
          unit: '',
          type: 'string',
          readOnly: false,
          writeOnly: true,
          observable: false,
          forms: [
            {
              href: 'gatt://0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb/writeWithoutResponse',
              'wbt:id': 'deadbeef',
            },
          ],
        },
      },
      actions: {},
      events: {},
      links: [],
      observedProperties: {},
      subscribedEvents: {},
    };
    expect(actualTd).to.deep.equal(expectedTd);
  });
});
