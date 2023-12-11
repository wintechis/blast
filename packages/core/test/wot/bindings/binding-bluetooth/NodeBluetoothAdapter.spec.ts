/**
 * Mock the BleManager class
 * create returns a mock BleManager instance with
 * that can connect to a device 00:00:00:00:00:00
 */
jest.mock('ble-host', () => ({
  BleManager: {
    create: jest.fn(
      (
        transport,
        options,
        callback: (err: Error | null, manager: unknown) => void
      ) => {
        callback(null, {
          connect: jest.fn(
            (
              type: string,
              deviceId: string,
              options: {},
              callback: (conn: unknown) => void
            ) => {
              callback({
                gatt: {
                  discoverServicesByUuid: jest.fn(
                    (
                      serviceID: string,
                      numToFind: number,
                      callback: (services: unknown) => void
                    ) => {
                      callback([
                        {
                          discoverCharacteristics: jest.fn(
                            (callback: (characteristics: unknown) => void) => {
                              callback([
                                {
                                  uuid: '00000000-0000-0000-0000-000000000000',
                                },
                              ]);
                            }
                          ),
                        },
                      ]);
                    }
                  ),
                },
                on: jest.fn(),
              });
            }
          ),
        });
      }
    ),
  },
}));

// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, jest, test} from '@jest/globals';
import ConcreteBluetoothAdapter from '../../../../src/wot/bindings/binding-bluetooth/NodeBluetoothAdapter';

describe('NodeBluetoothAdapter', () => {
  const adapter = new ConcreteBluetoothAdapter();

  describe('getCharacteristic', () => {
    test('should throw error if deviceId is not valid', async () => {
      await expect(
        adapter.getCharacteristic('not-valid', '', '')
      ).rejects.toThrowError();
    });

    test('should throw error if device is not found', async () => {
      await expect(
        adapter.getCharacteristic('00:00:00:00:00:01', '', '')
      ).rejects.toThrowError();
    });

    test('should return characteristic', async () => {
      const characteristic = await adapter.getCharacteristic(
        '00:00:00:00:00:00',
        '',
        '00000000-0000-0000-0000-000000000000'
      );
      expect(characteristic).toBeDefined();
    });
  });
});
