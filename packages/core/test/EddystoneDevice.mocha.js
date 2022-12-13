import chai from 'chai';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';

const {assert} = chai;

describe('EddystoneDevice', async () => {
  let td;
  before(async () => {
    const tdPath = path.resolve('src/td/EddystoneDevice.json');
    td = JSON.parse(fs.readFileSync(tdPath, 'utf8'));
  });

  it('should equal the expected thing description', () => {
    const expectedTd = {
      '@context': ['https://www.w3.org/2019/wot/td/v1'],
      '@type': ['Thing'],
      id: 'blast:bluetooth:EddystoneDevice',
      title: 'Eddystone Device',
      description: 'A Bluetooth device implementing the Eddystone protocol',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      security: 'nosec_sc',
      properties: {
        activeSlot: {
          title: 'Active Slot',
          description: 'The active slot of the Eddystone device',
          type: 'integer',
          readOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87502-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:read',
            },
            {
              op: 'writeproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87502-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:write-without-response',
            },
          ],
        },
        advertisedTxPower: {
          title: 'Advertised Tx Power',
          description: 'The advertised TX power of the iBeacon',
          unit: 'dBm',
          type: 'integer',
          'bdo:bytelength': 1,
          readOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87505-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:read',
              contentType: 'application/x.binary-data-stream',
            },
            {
              op: 'writeproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87505-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:write-without-response',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
        advertisedData: {
          title: 'Advertised Data',
          description: 'The advertised data of the eddystone device',
          unit: '',
          type: 'string',
          format: 'hex',
          readOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c8750a-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:read',
              contentType: 'application/x.binary-data-stream',
            },
            {
              op: 'writeproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c8750a-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:write-without-response',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
        advertisingInterval: {
          title: 'Advertising Interval',
          description: 'The advertising interval of the eddystone device',
          unit: 'ms',
          type: 'integer',
          'bdo:byteOrder': 'big',
          readOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87503-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:read',
            },
            {
              op: 'writeproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87503-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:write-without-response',
            },
          ],
        },
        capabilities: {
          title: 'Capabilities',
          description: 'The capabilities of the eddystone device',
          type: 'string',
          format: 'hex',
          readOnly: true,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87501-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:read',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
        lockState: {
          title: 'Lock State',
          description: 'The lock state of the eddystone device',
          unit: '',
          type: 'string',
          format: 'hex',
          readOnly: true,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87506-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:read',
            },
          ],
        },
        publicEcdhKey: {
          title: 'Public ECDH Key',
          description: 'The public ECDH key of the eddystone device',
          unit: '',
          type: 'string',
          format: 'hex',
          readOnly: true,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87508-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:read',
            },
          ],
        },
        radioTxPower: {
          title: 'Radio Tx Power',
          description: 'The radio TX power of the eddystone device',
          unit: 'dBm',
          type: 'integer',
          'bdo:bytelength': 1,
          readOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87504-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:read',
            },
            {
              op: 'writeproperty',
              href: 'gatt://${MacOrWebBluetoothId}/a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87504-8ed3-4bdf-8a39-a01bebede295',
              'sbo:methodName': 'sbo:write-without-response',
            },
          ],
        },
      },
    };

    assert.deepEqual(td, expectedTd);
  });
});
