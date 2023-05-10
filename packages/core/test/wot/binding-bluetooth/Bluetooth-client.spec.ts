// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import {Readable} from 'node:stream';
import {BluetoothForm} from '../../../src/wot/bindings/binding-bluetooth/Bluetooth';

import BluetoothClient from '../../../src/wot/bindings/binding-bluetooth/Bluetooth-client';
import {BluetoothAdapter} from '../../../src/wot/bindings/binding-bluetooth/BluetoothAdapter';
import {BluetoothAdapterMock} from '../../helpers/BluetoothAdapterMock';

describe('Bluetooth client', () => {
  const adapter = new BluetoothAdapterMock();
  adapter.addCharacteristic('1234-5678');
  adapter.setCharacteristicValue(
    '1234-5678',
    new Uint8Array([0x01, 0x02, 0x03, 0x04]).buffer
  );
  const client = new BluetoothClient(adapter as BluetoothAdapter);

  test('toString', () => {
    expect(client.toString()).toEqual('[WebBluetoothClient]');
  });

  describe('readResource', () => {
    test('reading an unsigned value', async () => {
      const form = {
        href: 'gatt://id/service/1234-5678',
        op: ['readproperty'],
        'sbo:methodName': 'readValue',
        contentType: 'application/x.binary-data-stream',
      };

      const content = await client.readResource(form);

      expect(content.type).toEqual('application/x.binary-data-stream');
      expect(content.body).toBeDefined();
      expect(content.toBuffer).toBeDefined();
      expect(await content.toBuffer()).toEqual(
        Buffer.from(new Uint8Array([0x01, 0x02, 0x03, 0x04]))
      );
    });
    test('reading a signed value', async () => {
      const form = {
        href: 'gatt://id/service/1234-5678',
        op: ['readproperty'],
        'sbo:methodName': 'readValue',
        contentType: 'application/x.binary-data-stream',
        'bdo:signed': true,
      };

      const content = await client.readResource(form);

      expect(content.type).toEqual('application/x.binary-data-stream');
      expect(content.body).toBeDefined();
      expect(content.toBuffer).toBeDefined();
      expect(await content.toBuffer()).toEqual(
        Buffer.from(new Int8Array([0x01, 0x02, 0x03, 0x04]))
      );
    });
    test('reading from a non-existing characteristic', async () => {
      const form = {
        href: 'gatt://id/service/1234-5679',
        op: ['readproperty'],
        'sbo:methodName': 'readValue',
        contentType: 'application/x.binary-data-stream',
      };

      await expect(client.readResource(form)).rejects.toThrow();
    });
  });
  describe('writeResource', () => {
    const content = {
      type: 'application/x.binary-data-stream',
      body: Readable.from([0x05, 0x06, 0x07, 0x08]),
      toBuffer: () => {
        return Promise.resolve(
          Buffer.from(new Uint8Array([0x05, 0x06, 0x07, 0x08]))
        );
      },
    };
    const unsignedValue = new DataView(
      new Uint8Array([0x05, 0x06, 0x07, 0x08]).buffer
    );
    const signedValue = new DataView(
      new Int8Array([0x05, 0x06, 0x07, 0x08]).buffer
    );

    test('writing a value', async () => {
      const form = {
        href: 'gatt://id/service/1234-5678',
        op: ['writeproperty'],
        'sbo:methodName': 'sbo:write',
      };

      await client.writeResource(form, content);

      expect(
        (await adapter.getCharacteristic('id', 'service', '1234-5678')).value
      ).toEqual(unsignedValue);
    });
    test('writing a signed value', async () => {
      const form = {
        href: 'gatt://id/service/1234-5678',
        op: ['writeproperty'],
        'sbo:methodName': 'sbo:write',
        'bdo:signed': true,
      };

      await client.writeResource(form, content);

      expect(
        (await adapter.getCharacteristic('id', 'service', '1234-5678')).value
      ).toEqual(signedValue);
    });
    test('writing to a non-existing characteristic', async () => {
      const form = {
        href: 'gatt://id/service/1234-5679',
        op: ['writeproperty'],
        'sbo:methodName': 'sbo:write',
      };

      await expect(client.writeResource(form, content)).rejects.toThrow();
    });
    test('writing a value without response', async () => {
      const form = {
        href: 'gatt://id/service/1234-5678',
        op: ['writeproperty'],
        'sbo:methodName': 'sbo:write-without-response',
        'bdo:response': true,
      };

      await client.writeResource(form, content);

      expect(
        (await adapter.getCharacteristic('id', 'service', '1234-5678')).value
      ).toEqual(unsignedValue);
    });
    test('writing a with unknown method name', async () => {
      const form = {
        href: 'gatt://id/service/1234-5678',
        op: ['writeproperty'],
        'sbo:methodName': 'unknown',
      };

      await expect(client.writeResource(form, content)).rejects.toThrow();
    });
    test('writing without method name', async () => {
      const form = {
        href: 'gatt://id/service/1234-5678',
        op: ['writeproperty'],
        contentType: 'application/x.binary-data-stream',
      };

      await expect(
        client.writeResource(form as BluetoothForm, content)
      ).rejects.toThrow();
    });
    test('writing without content writes 00', async () => {
      const form = {
        href: 'gatt://id/service/1234-5678',
        op: ['writeproperty'],
        'sbo:methodName': 'sbo:write',
      };

      await client.writeResource(form, undefined as never);

      expect(
        (await adapter.getCharacteristic('id', 'service', '1234-5678')).value
      ).toEqual(new DataView(new Uint8Array([0x00]).buffer));
    });
  });
});
