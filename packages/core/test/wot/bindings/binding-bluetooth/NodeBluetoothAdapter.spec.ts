// mock node-ble and functions used in NodeBluetoothAdapter.ts
jest.mock('node-ble', () => {
  return {
    createBluetooth: jest.fn(() => {
      return {
        bluetooth: {
          defaultAdapter: jest.fn(() => {
            let discovering = false;
            const devices = ['00:00:00:00:00:00'];
            return {
              isDiscovering: jest.fn(() => {
                return Promise.resolve(discovering);
              }),
              startDiscovery: jest.fn(() => {
                discovering = true;
                return Promise.resolve();
              }),
              waitDevice: jest.fn((mac: string) => {
                if (!devices.includes(mac)) {
                  return Promise.resolve(null);
                }
                return Promise.resolve({
                  connect: jest.fn(() => {
                    return Promise.resolve();
                  }),
                  gatt: jest.fn(() => {
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
                });
              }),
            };
          }),
        },
      };
    }),
  };
});
// eslint-disable-next-line node/no-unpublished-import
import {beforeAll, describe, expect, jest, test} from '@jest/globals';
import {createBluetooth} from 'node-ble';
import ConcreteBluetoothAdapter from '../../../../src/wot/bindings/binding-bluetooth/NodeBluetoothAdapter';

describe('NodeBluetoothAdapter', () => {
  const adapter = new ConcreteBluetoothAdapter();

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('getCharacteristic', () => {
    test('should throw error if deviceId is not valid', async () => {
      await expect(
        adapter.getCharacteristic('not-valid', '', '')
      ).rejects.toThrowError('Device id not-valid is not valid');
    });

    test('should throw error if device is not found', async () => {
      await expect(
        adapter.getCharacteristic('00:00:00:00:00:01', '', '')
      ).rejects.toThrowError('Device with id 00:00:00:00:00:01 not found');
    });

    test('should return characteristic if mac has :', async () => {
      const characteristic = await adapter.getCharacteristic(
        '00:00:00:00:00:00',
        '',
        ''
      );
      expect(characteristic).toBeDefined();
    });

    test('should return characteristic if mac has no :', async () => {
      const characteristic = await adapter.getCharacteristic(
        '000000000000',
        '',
        ''
      );
      expect(characteristic).toBeDefined();
    });

    test('creates bluetooth if not created', async () => {
      await adapter.getCharacteristic('000000000000', '', '');
      expect(createBluetooth).toHaveBeenCalledTimes(1);
      await adapter.getCharacteristic('000000000000', '', '');
      await adapter.getCharacteristic('000000000000', '', '');
      expect(createBluetooth).toHaveBeenCalledTimes(1);
    });

    test('starts discovery if not discovering', async () => {
      await adapter.getCharacteristic('000000000000', '', '');
      expect(createBluetooth).toHaveBeenCalledTimes(1);
      await adapter.getCharacteristic('000000000000', '', '');
      expect(createBluetooth).toHaveBeenCalledTimes(1);
    });
  });
});
