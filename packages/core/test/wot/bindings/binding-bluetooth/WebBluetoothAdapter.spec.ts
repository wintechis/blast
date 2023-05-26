// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, jest, test} from '@jest/globals';
import ConcreteBluetoothAdapter from '../../../../src/wot/bindings/binding-bluetooth/WebBluetoothAdapter';

describe('WebBluetoothAdapter', () => {
  const adapter = new ConcreteBluetoothAdapter();
  // mock functionality used from navigator.bluetooth
  const devices = [
    {
      id: 'abcD',
      gatt: {
        connect: jest.fn(() => {
          return Promise.resolve({
            getPrimaryService: jest.fn(() => {
              return Promise.resolve({
                getCharacteristic: jest.fn(() => {
                  return Promise.resolve({});
                }),
              });
            }),
          });
        }),
      },
    },
    {
      id: 'notConnected',
    },
  ] as unknown as BluetoothDevice[];
  (globalThis as any).navigator = {};
  (globalThis as any).navigator.bluetooth = {
    getDevices: jest.fn(() => {
      return Promise.resolve(devices);
    }),
  };

  describe('getCharacteristic', () => {
    test('should throw error if device is not found', async () => {
      await expect(
        adapter.getCharacteristic('abcE', '', '')
      ).rejects.toThrowError('Device with id abcE not found');
    });
    test('should throw error if device is not connected', async () => {
      await expect(
        adapter.getCharacteristic('notConnected', '', '')
      ).rejects.toThrowError('Device with id notConnected is not connected');
    });
    test('should return characteristic', async () => {
      const characteristic = await adapter.getCharacteristic('abcD', '', '');
      expect(characteristic).toBeDefined();
    });
    test('should open gatt connection', async () => {
      await adapter.getCharacteristic('abcD', '', '');
      expect(devices[0]?.gatt?.connect).toHaveBeenCalled();
    });
  });
});
