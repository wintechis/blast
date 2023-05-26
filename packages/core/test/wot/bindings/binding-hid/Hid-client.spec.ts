// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, jest, test} from '@jest/globals';
import {Readable} from 'node:stream';

import HidClient from '../../../../src/wot/bindings/binding-hid/Hid-client';
import {HidAdapter} from '../../../../src/wot/bindings/binding-hid/HidAdapter';
import HidAdapterMock from '../../../test-helpers/HidAdapterMock';

describe('HidClient', () => {
  const adapter = new HidAdapterMock();
  const device = adapter.addDevice(
    'test-device',
    new DataView(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]).buffer)
  );
  const client = new HidClient(adapter);

  describe('toString', () => {
    test('should return [Hid Client]', () => {
      expect(client.toString()).toBe('[Hid Client]');
    });
  });

  describe('readResource', () => {
    const form = {
      href: 'hid://receiveFeatureReport',
      'hid:path': 'test-device',
      'hid:reportId': 1,
      'hid:reportLength': 8,
    };
    test('should throw error if hid:path is undefined', async () => {
      form['hid:path'] = undefined as unknown as string;
      await expect(client.readResource(form)).rejects.toThrow(
        'hid:path cannot be undefined'
      );
    });
    test('should throw error if device is not found', async () => {
      form['hid:path'] = 'not-found';
      await expect(client.readResource(form)).rejects.toThrow(
        'Device not-found not found'
      );
      form['hid:path'] = 'test-device';
    });
    test('should throw error if hid:reportId is undefined', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form as any)['hid:reportId'] = undefined;
      await expect(client.readResource(form)).rejects.toThrow(
        'Report ID cannot be undefined'
      );
      form['hid:reportId'] = 1;
    });
    test('should throw error if hid:reportLength is undefined', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form as any)['hid:reportLength'] = undefined;
      await expect(client.readResource(form)).rejects.toThrow(
        'Report length cannot be undefined'
      );
      form['hid:reportLength'] = 8;
    });
    test('reading unsigned integer', async () => {
      const content = await client.readResource(form);
      expect(content.type).toEqual('application/octet-stream');
      expect(content.body).toBeDefined();
      expect(content.toBuffer).toBeDefined();
      expect(await content.toBuffer()).toEqual(
        Buffer.from(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]))
      );
    });
    test('reading signed integer', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form as any)['signed'] = true;
      const content = await client.readResource(form);
      expect(content.type).toEqual('application/octet-stream');
      expect(content.body).toBeDefined();
      expect(content.toBuffer).toBeDefined();
      expect(await content.toBuffer()).toEqual(
        Buffer.from(new Int8Array([0, 1, 2, 3, 4, 5, 6, 7]))
      );
    });
  });
  describe('writeResource', () => {
    const form = {
      href: 'hid://sendFeatureReport',
      'hid:path': 'test-device',
      'hid:reportId': 1,
      'hid:reportLength': 8,
    };
    const content = {
      type: 'application/octet-stream',
      body: Readable.from(new Uint8Array([99])),
      toBuffer: () => {
        return Promise.resolve(Buffer.from(new Uint8Array([99])));
      },
    };
    test('should throw error if hid:path is undefined', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form as any)['hid:path'] = undefined;
      await expect(client.writeResource(form, content)).rejects.toThrow(
        'hid:path cannot be undefined'
      );
      form['hid:path'] = 'test-device';
    });
    test('should throw error if device is not found', async () => {
      form['hid:path'] = 'not-found';
      await expect(client.writeResource(form, content)).rejects.toThrow(
        'Device not-found not found'
      );
      form['hid:path'] = 'test-device';
    });
    test('writing a value via sendFeatureReport', async () => {
      jest.spyOn(device, 'sendFeatureReport');
      await expect(
        client.writeResource(form, content)
      ).resolves.toBeUndefined();
      expect(device.sendFeatureReport).toHaveBeenCalledWith(
        1,
        Buffer.from(new Uint8Array([99]))
      );
    });
    test('writing a value via sendReport', async () => {
      form.href = 'hid://sendReport';
      jest.spyOn(device, 'sendReport');
      await expect(
        client.writeResource(form, content)
      ).resolves.toBeUndefined();
      expect(device.sendReport).toHaveBeenCalledWith(
        1,
        Buffer.from(new Uint8Array([]))
      );
      form.href = 'hid://sendFeatureReport';
    });
    test('writing unsigned integer in a report array', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form as any)['hid:data'] = [0, 1, 2, 3, 4, 5, 6, 7];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form as any)['hid:valueIndex'] = 3;
      jest.spyOn(device, 'sendFeatureReport');
      await expect(
        client.writeResource(form, content)
      ).resolves.toBeUndefined();
      expect(device.sendFeatureReport).toHaveBeenCalledWith(
        1,
        Buffer.from(new Uint8Array([0, 1, 2, 99, 4, 5, 6, 7]))
      );
    });
    test('writing signed integer', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form as any)['signed'] = true;
      jest.spyOn(device, 'sendFeatureReport');
      await expect(
        client.writeResource(form, content)
      ).resolves.toBeUndefined();
      expect(device.sendFeatureReport).toHaveBeenCalledWith(
        1,
        Buffer.from(new Int8Array([0, 1, 2, 99, 4, 5, 6, 7]))
      );
    });
  });
});
