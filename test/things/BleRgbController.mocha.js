/* eslint-disable node/no-unpublished-import */
import chai from 'chai';
import sinon from 'sinon';
import esmock from 'esmock';

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
      '../../dist/things/BleRgbController/BleRgbController.js',
      {
        '../../dist/blast_webBluetooth.js': {
          writeWithoutResponse: this.spy,
        },
      }
    );
    this.thing = new this.BleRgbController('deadbeef');
  });

  teardown(function () {
    this.spy.resetHistory();
    this.thing.destroy();
    this.thing = null;
  });

  test('Creation', function () {
    expect(this.thing).to.be.an.instanceof(this.BleRgbController);
  });

  test('Thing description', async function () {
    const actualTd = await this.thing.getThingDescription();
    const expectedTd = {
      '@context': ['https://www.w3.org/2019/wot/td/v1', {'@language': 'en'}],
      '@type': ['Thing'],
      id: 'blast:Bluetooth:ledController',
      title: 'BLE RGB Controller',
      description:
        'A Bluetooth Low Energy (BLE) controller that can be used to control RGB LED lights.',
      securityDefinitions: {nosec_sc: {scheme: 'nosec'}},
      security: 'nosec_sc',
      properties: {
        colour: {
          title: 'colour',
          description: 'The colour of the LED light.',
          unit: '',
          type: 'string',
          readOnly: false,
          writeOnly: true,
          observable: false,
        },
      },
    };
    expect(actualTd).to.deep.equal(expectedTd);
  });

  suite('Thing affordances', () => {
    test('writing the colour property', async function () {
      await this.thing.writeProperty('colour', '#ff0000');
      expect(this.spy.calledOnce).to.be.true;
    });
  });
});
