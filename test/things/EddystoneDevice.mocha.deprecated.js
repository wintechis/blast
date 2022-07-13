/* eslint-disable node/no-unpublished-import */
import chai from 'chai';
import sinon from 'sinon';
import EddystoneDevice from '../../dist/things/EddystoneDevice.js';

const {expect} = chai;

suite('Eddystone device', function () {
  this.thing = null;

  suiteSetup(async () => {
    sinon.stub(console);
  });

  suiteTeardown(() => {
    sinon.restore();
  });

  setup(async function () {
    this.thing = await new EddystoneDevice().init('deadbeef');
  });

  teardown(function () {
    this.spy.resetHistory();
    this.thing.destroy();
    this.thing = null;
  });

  test('Creation', function () {
    expect(this.thing).to.be.an.instanceof(this.EddystoneDevice);
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
          forms: [
            {
              href: '',
            },
          ],
        },
        advertisedData: {
          title: 'Advertised Data',
          description: 'The advertised data of the eddystone device',
          unit: '',
          type: 'string',
          readOnly: false,
          writeOnly: false,
          observable: false,
          forms: [
            {
              href: '',
            },
          ],
        },
        advertisingInterval: {
          title: 'Advertising Interval',
          description: 'The advertising interval of the eddystone device',
          unit: 'ms',
          type: 'integer',
          readOnly: false,
          writeOnly: false,
          observable: false,
          forms: [
            {
              href: '',
            },
          ],
        },
        lockState: {
          title: 'Lock State',
          description: 'The lock state of the eddystone device',
          unit: '',
          type: 'string',
          readOnly: true,
          writeOnly: false,
          observable: false,
          forms: [
            {
              href: '',
            },
          ],
        },
        publicEcdhKey: {
          title: 'Public ECDH Key',
          description: 'The public ECDH key of the eddystone device',
          unit: '',
          type: 'string',
          readOnly: true,
          writeOnly: false,
          observable: false,
          forms: [
            {
              href: '',
            },
          ],
        },
        radioTxPower: {
          title: 'Radio Tx Power',
          description: 'The radio TX power of the eddystone device',
          unit: 'dBm',
          type: 'integer',
          readOnly: false,
          writeOnly: false,
          observable: false,
          forms: [
            {
              href: '',
            },
          ],
        },
      },
    };
    expect(actualTd).to.deep.equal(expectedTd);
  });

  suite('Thing affordances', () => {
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
