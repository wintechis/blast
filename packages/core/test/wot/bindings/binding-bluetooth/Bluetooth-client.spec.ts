// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, jest, test} from '@jest/globals';
import {Content} from '@node-wot/core';
import {Readable} from 'node:stream';

import BluetoothClient from '../../../../src/wot/bindings/binding-bluetooth/Bluetooth-client';
import {BluetoothAdapter} from '../../../../src/wot/bindings/binding-bluetooth/BluetoothAdapter';
import {BluetoothAdapterMock} from '../../../test-helpers/BluetoothAdapterMock';

describe('Bluetooth client', () => {
  const adapter = new BluetoothAdapterMock();
  const characteristic = adapter.addCharacteristic(
    '00000000-0000-1000-8000-00001234abce',
    new DataView(new Uint8Array([0x01, 0x02, 0x03, 0x04]).buffer)
  );
  const client = new BluetoothClient(adapter as BluetoothAdapter);

  test('toString', () => {
    expect(client.toString()).toEqual('[BluetoothClient]');
  });

  describe('readResource', () => {
    test('reading an unsigned value', async () => {
      const form = {
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
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
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
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
    test('reading without specified content type', async () => {
      const form = {
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['readproperty'],
        'sbo:methodName': 'readValue',
      };

      const content = await client.readResource(form);

      expect(content.type).toEqual('application/x.binary-data-stream');
      expect(content.body).toBeDefined();
      expect(content.toBuffer).toBeDefined();
      expect(await content.toBuffer()).toEqual(
        Buffer.from(new Uint8Array([0x01, 0x02, 0x03, 0x04]))
      );
    });
    test('reading from a non-existing characteristic throws', async () => {
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
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['writeproperty'],
        'sbo:methodName': 'sbo:write',
      };

      await client.writeResource(form, content);

      expect(characteristic.value).toEqual(unsignedValue);
    });
    test('writing a signed value', async () => {
      const form = {
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['writeproperty'],
        'sbo:methodName': 'sbo:write',
        'bdo:signed': true,
      };

      await client.writeResource(form, content);

      expect(characteristic.value).toEqual(signedValue);
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
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['writeproperty'],
        'sbo:methodName': 'sbo:write-without-response',
      };

      await client.writeResource(form, content);

      expect(characteristic.value).toEqual(unsignedValue);
    });
    test('writing with unknown method name throws', async () => {
      const form = {
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['writeproperty'],
        'sbo:methodName': 'unknown',
      };

      await expect(client.writeResource(form, content)).rejects.toThrow();
    });
    test('writing without method name throws', async () => {
      const form = {
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['writeproperty'],
        contentType: 'application/x.binary-data-stream',
      };

      await expect(
        client.writeResource(form as any, content)
      ).rejects.toThrow();
    });
    test('writing without content writes 00', async () => {
      const form = {
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['writeproperty'],
        'sbo:methodName': 'sbo:write',
      };

      await client.writeResource(form, undefined as never);

      expect(characteristic.value).toEqual(
        new DataView(new Uint8Array([0x00]).buffer)
      );
    });
  });
  describe('invokeResource', () => {
    const content = {
      type: 'application/x.binary-data-stream',
      body: Readable.from([0x05, 0x06, 0x07, 0x08]),
      toBuffer: () => {
        return Promise.resolve(
          Buffer.from(new Uint8Array([0x05, 0x06, 0x07, 0x08]))
        );
      },
    };

    test('calls writeResource', async () => {
      // mock writeResource to check if invokeResource calls it
      const writeResource = jest
        .fn()
        .mockImplementation(async () => undefined)
        .mockName('writeResource');
      const client = new BluetoothClient(adapter as BluetoothAdapter);
      client.writeResource = writeResource as any;

      const form = {
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['invokeaction'],
        'sbo:methodName': 'sbo:write',
      };

      await client.invokeResource(form, content);

      expect(writeResource).toHaveBeenCalled();
    });
  });

  describe('unlinkResource', () => {
    const form = {
      href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
      op: ['observeproperty'],
      'sbo:methodName': 'subscribe',
    };
    const handler = jest.fn().mockName('handler');

    test('unsubscribes', async () => {
      await client.subscribeResource(form, handler);
      await client.unlinkResource(form);

      characteristic.dispatchEvent(new Event('characteristicvaluechanged'));
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('subscribeResrouce', () => {
    const subscribeForm = {
      href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
      op: ['observeproperty'],
      'sbo:methodName': 'subscribe',
      'sbo:signed': true,
    };
    const writeForm = {
      href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
      op: ['writeproperty'],
      'sbo:methodName': 'sbo:write-without-response',
    };

    test('calls the handler', async () => {
      const handler = jest.fn().mockName('handler');
      await client.subscribeResource(subscribeForm, handler);

      characteristic.dispatchEvent(new Event('characteristicvaluechanged'));
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'application/x.binary-data-stream',
          body: expect.any(Readable),
        })
      );
      characteristic.dispatchEvent(new Event('characteristicvaluechanged'));
      characteristic.dispatchEvent(new Event('characteristicvaluechanged'));
      expect(handler).toHaveBeenCalledTimes(3);
    });
    test('subscribing to a non-existing characteristic throws', async () => {
      const form = {
        href: 'gatt://id/service/1234-5679',
        op: ['observeproperty'],
        'sbo:methodName': 'subscribe',
      };

      const handler = () => {
        /* do nothing */
      };
      await expect(client.subscribeResource(form, handler)).rejects.toThrow();
    });
    test('subscribing without method name throws', async () => {
      const form = {
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['observeproperty'],
      };

      const handler = () => {
        /* do nothing */
      };
      await expect(
        client.subscribeResource(form as any, handler)
      ).rejects.toThrow();
    });

    test('unsubscribing', async () => {
      const handler = jest.fn().mockName('handler');
      const subscription = await client.subscribeResource(
        subscribeForm,
        handler
      );

      characteristic.dispatchEvent(new Event('characteristicvaluechanged'));
      expect(handler).toHaveBeenCalledTimes(1);

      subscription.unsubscribe();

      characteristic.dispatchEvent(new Event('characteristicvaluechanged'));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    test('returns unsigned values if no other specification', async () => {
      const content = {
        type: 'application/x.binary-data-stream',
        body: Readable.from([0x05, 0x06, 0x07, 0x08]),
        toBuffer: () => {
          return Promise.resolve(
            Buffer.from(new Uint8Array([0x05, 0x06, 0x07, 0x08]))
          );
        },
      };

      const handler = async (data: Content) => {
        const value = await data.toBuffer();
        expect(value).toEqual(Buffer.from(characteristic.value.buffer));
      };
      await client.subscribeResource(subscribeForm, handler);
      await client.writeResource(writeForm, content);
      characteristic.dispatchEvent(new Event('characteristicvaluechanged'));
    });
    test('returns signed values if specified', async () => {
      const subscribeForm = {
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['observeproperty'],
        'sbo:methodName': 'subscribe',
        'bdo:signed': true,
      };
      const content = {
        type: 'application/x.binary-data-stream',
        body: Readable.from([0x05, 0x06, 0x07, 0x08]),
        toBuffer: () => {
          return Promise.resolve(
            Buffer.from(new Int8Array([0x05, 0x06, 0x07, 0x08]))
          );
        },
      };

      const handler = async (data: Content) => {
        const value = await data.toBuffer();
        expect(value).toEqual(Buffer.from(characteristic.value.buffer));
      };
      await client.subscribeResource(subscribeForm, handler);
      await client.writeResource(writeForm, content);
      characteristic.dispatchEvent(new Event('characteristicvaluechanged'));
    });
  });

  describe('stop', () => {
    test('stops all subscriptions', async () => {
      const subscribeForm = {
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['observeproperty'],
        'sbo:methodName': 'subscribe',
      };
      const handler = jest.fn().mockName('handler');
      await client.subscribeResource(subscribeForm, handler);

      await client.stop();

      characteristic.dispatchEvent(new Event('characteristicvaluechanged'));
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('setSecurity', () => {
    test('returns false', () => {
      expect(client.setSecurity()).toBeFalsy();
    });
  });

  describe('deconstructForm', () => {
    test('deconstructs simple href', () => {
      const form = {
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['writeproperty'],
        'sbo:methodName': 'sbo:write-without-response',
      };
      const deconstructedForm = client.deconstructForm(form);
      expect(deconstructedForm).toEqual({
        bleOperation: 'sbo:write-without-response',
        characteristicId: '00000000-0000-1000-8000-00001234abce',
        deviceId: 'id',
        operation: 'writeproperty',
        path: 'id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        serviceId: '00000000-0000-1000-8000-00001234abcd',
      });
    });
    test('deconstructs with "/" in deviceId', () => {
      const form = {
        href: 'gatt://id/with/slashes/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        op: ['writeproperty'],
        'sbo:methodName': 'sbo:write-without-response',
      };
      const deconstructedForm = client.deconstructForm(form);
      expect(deconstructedForm).toEqual({
        bleOperation: 'sbo:write-without-response',
        characteristicId: '00000000-0000-1000-8000-00001234abce',
        deviceId: 'id/with/slashes',
        operation: 'writeproperty',
        path: 'id/with/slashes/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        serviceId: '00000000-0000-1000-8000-00001234abcd',
      });
    });
    test('deconstructing without defining op defaults to ""', () => {
      const form = {
        href: 'gatt://id/00000000-0000-1000-8000-00001234abcd/00000000-0000-1000-8000-00001234abce',
        'sbo:methodName': 'sbo:write-without-response',
      };
      const deconstructedForm = client.deconstructForm(form);
      expect(deconstructedForm).toHaveProperty('operation', '');
    });
  });
});
