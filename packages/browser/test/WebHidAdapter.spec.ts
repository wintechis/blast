// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, jest, test} from '@jest/globals';
// mock functionality used from navigator.hid
const devices = [
  {
    id: 'testDevice',
    open: jest.fn(() => {
      return Promise.resolve();
    }),
  },
];
(globalThis as any).navigator = {};
(globalThis as any).navigator.hid = {
  getDevices: jest.fn(() => {
    return Promise.resolve(devices);
  }),
  requestDevice: jest.fn(() => {
    return Promise.resolve([
      {
        open: jest.fn(() => {
          return Promise.resolve();
        }),
      },
    ]);
  }),
};
import ConcreteHidAdapter from '../src/WebHidAdapter';

describe('WebHidAdapter', () => {
  const adapter = new ConcreteHidAdapter();

  describe('getDevice', () => {
    test('should throw error if device is not found', async () => {
      await expect(adapter.getDevice('invalidId')).rejects.toThrowError(
        'Device with id invalidId not found'
      );
    });

    test('should return device if device is found', async () => {
      const device = await adapter.getDevice('testDevice');
      expect(device).toBeDefined();
    });
  });

  describe('requestDeviceAndAddId', () => {
    test('was added to navigator.hid', async () => {
      expect((navigator as any).hid.requestDeviceAndAddId).toBeDefined();
    });

    test('adds id to device', async () => {
      const device = (
        await (navigator as any).hid.requestDeviceAndAddId({
          filters: [],
        })
      )[0];
      expect(device.id).toBeDefined();
    });
  });
});
