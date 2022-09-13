/* eslint-disable node/no-unpublished-import */
import Blockly from 'blockly';
import chai from 'chai';
import EddystoneDevice from '../../dist/things/EddystoneDevice.js';
import sinon from 'sinon';

import '../../dist/thingBlocks/bluetooth/blocks.js';
import '../../dist/thingBlocks/bluetooth/generators.js';
import '../../dist/blocks/numbers.js';
import '../../dist/generators/numbers.js';

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
    this.workspace = new Blockly.Workspace();
    this.thing = await new EddystoneDevice().init('deadbeef');
  });

  teardown(function () {
    this.thing = null;
  });

  test('Thing description', async function () {
    const actualTd = await this.thing.getThingDescription();
    const expectedTd = {
      '@context': [
        'https://www.w3.org/2019/wot/td/v1',
        {
          '@language': 'en',
        },
      ],
      '@type': ['Thing'],
      title: 'Eddystone Device',
      actions: {},
      description: 'A Bluetooth device implementing the Eddystone protocol',
      events: {},
      id: 'blast:bluetooth:EddystoneDevice',
      links: [],
      observedProperties: {},
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      security: ['nosec_sc'],
      properties: {
        activeSlot: {
          title: 'Active Slot',
          description: 'The active slot of the Eddystone device',
          type: 'integer',
          observable: false,
          readOnly: false,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87502-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
            {
              op: 'writeproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87502-8ed3-4bdf-8a39-a01bebede295/writeEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
          ],
        },
        advertisedTxPower: {
          title: 'Advertised Tx Power',
          description: 'The advertised TX power of the iBeacon',
          unit: 'dBm',
          type: 'integer',
          observable: false,
          readOnly: false,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87505-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
            {
              op: 'writeproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87505-8ed3-4bdf-8a39-a01bebede295/writeEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
          ],
        },
        advertisedData: {
          title: 'Advertised Data',
          description: 'The advertised data of the eddystone device',
          unit: '',
          type: 'string',
          observable: false,
          readOnly: false,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c8750a-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
            {
              op: 'writeproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c8750a-8ed3-4bdf-8a39-a01bebede295/writeEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
          ],
        },
        advertisingInterval: {
          title: 'Advertising Interval',
          description: 'The advertising interval of the eddystone device',
          unit: 'ms',
          type: 'integer',
          observable: false,
          readOnly: false,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87503-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
            {
              op: 'writeproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87503-8ed3-4bdf-8a39-a01bebede295/writeEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
          ],
        },
        capabilities: {
          title: 'Capabilities',
          description: 'The capabilities of the eddystone device',
          type: 'array',
          observable: false,
          readOnly: false,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87501-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
          ],
        },
        lockState: {
          title: 'Lock State',
          description: 'The lock state of the eddystone device',
          unit: '',
          type: 'string',
          observable: false,
          readOnly: true,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87506-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
          ],
        },
        publicEcdhKey: {
          title: 'Public ECDH Key',
          description: 'The public ECDH key of the eddystone device',
          unit: '',
          type: 'string',
          observable: false,
          readOnly: true,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87508-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
          ],
        },
        radioTxPower: {
          title: 'Radio Tx Power',
          description: 'The radio TX power of the eddystone device',
          unit: 'dBm',
          type: 'integer',
          observable: false,
          readOnly: false,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87504-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
            {
              op: 'writeproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87504-8ed3-4bdf-8a39-a01bebede295/writeEddystoneProperty',
              'wbt:id': 'deadbeef',
            },
          ],
        },
      },
      subscribedEvents: {},
    };
    expect(actualTd).to.deep.equal(expectedTd);
  });
});
