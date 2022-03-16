/* eslint-disable node/no-unpublished-import */
import chai from 'chai';
import sinon from 'sinon';
import esmock from 'esmock';

const {expect} = chai;

suite('Eddystone device', function () {
  this.thing;
  this.spy;
  this.class;
  // suppress WoT console logs
  sinon.stub(console);

  setup(async function () {
    // Sets up a mock for the EddystoneDevice class with stubs for the bluetooth operations
    this.spy = sinon.spy();
    this.class = await esmock(
      '../../dist/things/eddystone/EddystoneDevice.js',
      {
        '../../dist/blast_eddystone.js': {
          setActiveSlot: this.spy,
          writeEddystoneProperty: this.spy,
          readEddystoneProperty: this.spy,
        },
      }
    );
    this.thing = new this.class.EddystoneDevice('deadbeef');
  });

  teardown(function () {
    this.spy.resetHistory();
    this.thing.destroy();
    this.thing = null;
  });

  test('Creation', function () {
    expect(this.thing).to.be.an.instanceof(this.class.EddystoneDevice);
  });

  test('Thing description', async function () {
    const actualTd = await this.thing.getThingDescription();
    const expectedTd = {
      '@context': ['https://www.w3.org/2019/wot/td/v1', {'@language': 'en'}],
      '@type': ['Thing'],
      id: 'blast:bluetooth:EddystoneDevice',
      title: 'Eddystone Device',
      description: 'A Bluetooth device implementing the Eddystone protocol',
      securityDefinitions: {nosec_sc: {scheme: 'nosec'}},
      security: 'nosec_sc',
      properties: {
        advertisedTxPower: {
          title: 'Advertised Tx Power',
          description: 'The advertised TX power of the iBeacon',
          unit: 'dBm',
          type: 'integer',
          readOnly: false,
          writeOnly: false,
          observable: false,
        },
        advertisedData: {
          title: 'Advertised Data',
          description: 'The advertised data of the eddystone device',
          unit: '',
          type: 'string',
          readOnly: false,
          writeOnly: false,
          observable: false,
        },
        advertisingInterval: {
          title: 'Advertising Interval',
          description: 'The advertising interval of the eddystone device',
          unit: 'ms',
          type: 'integer',
          readOnly: false,
          writeOnly: false,
          observable: false,
        },
        lockState: {
          title: 'Lock State',
          description: 'The lock state of the eddystone device',
          unit: '',
          type: 'string',
          readOnly: true,
          writeOnly: false,
          observable: false,
        },
        publicEcdhKey: {
          title: 'Public ECDH Key',
          description: 'The public ECDH key of the eddystone device',
          unit: '',
          type: 'string',
          readOnly: true,
          writeOnly: false,
          observable: false,
        },
        radioTxPower: {
          title: 'Radio Tx Power',
          description: 'The radio TX power of the eddystone device',
          unit: 'dBm',
          type: 'integer',
          readOnly: false,
          writeOnly: false,
          observable: false,
        },
      },
    };
    expect(actualTd).to.deep.equal(expectedTd);
  });

  suite('Bluetooth operations', () => {
    test('reading a property', async function () {
      await this.thing.readProperty('advertisedTxPower', 0);
      // Method sets the slot and then reads the property, so we expect 2 calls
      expect(this.spy.calledTwice).to.be.true;
    });

    test('writing a property', async function () {
      await this.thing.writeProperty('radioTxPower', '-30', 0);
      // Method sets the slot and then writes the property, so we expect 2 calls
      expect(this.spy.calledTwice).to.be.true;
    });
  });
});
