/* eslint-disable node/no-unpublished-import */
// import * as WoT from 'wot-typescript-definitions';
import chai from 'chai';
import sinon from 'sinon';
import esmock from 'esmock';
import {encodeJson} from '../../dist/things/index.js';

const {expect} = chai;

suite('BLE RGB Controller', function () {
  this.class;
  this.spy;
  this.thing;

  suiteSetup(async () => {
    sinon.stub(console);
  });

  suiteTeardown(() => {
    sinon.restore();
  });

  setup(async function () {
    // Sets up a mock for the BleRgbController class with stubs for the bluetooth operations
    this.spy = sinon.spy();
    this.BleRgbController = await esmock(
      '../../dist/things/bleRgbController/BleRgbController.js',
      {
        '../../dist/blast_webBluetooth.js': {
          writeWithoutResponse: this.spy,
        },
      }
    );
    this.thing = await new this.BleRgbController().init('deadbeef');
  });

  teardown(function () {
    this.spy.resetHistory();
    this.thing = null;
  });

  // test('Creation', function () {
  //   expect(this.thing).to.be.an.instanceof(WoT.ConsumedThing);
  // });

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
              contentType: 'text/plain',
              href: 'bluetooth://0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb/writeWithoutResponse',
              operation: 'writeWithResponse',
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

  // suite('Thing affordances', () => {
  //   test('writing the colour property', async function () {
  //     const stream = encodeJson('7e000503ff000000ef');
  //     await this.thing.writeProperty('colour', stream);
  //     expect(this.spy.calledOnce).to.be.true;
  //   });
  // });
});
