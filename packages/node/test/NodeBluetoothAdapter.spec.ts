/**
 * Mock the BleManager class
 * create returns a mock BleManager instance with
 * that can connect to a device 00:00:00:00:00:00
 */
// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, jest, mock, test} from 'bun:test';

mock.module('ble-host', () => ({
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
                  discoverAllPrimaryServices: jest.fn(
                    (callback: (services: unknown) => void) => {
                      callback([
                        {
                          uuid: '00000000-0000-0000-0000-000000000001',
                          discoverCharacteristics: jest.fn(
                            (callback: (characteristics: unknown) => void) => {
                              callback([
                                {
                                  uuid: '00000000-0000-0000-0000-000000000002',
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

/**
 * Mock the HciSocket class
 */
mock.module('hci-socket', () => ({
  // NodeBluetoothAdapter does `import HciSocket from 'hci-socket'` and constructs it at
  // module scope, so the stub has to be on `default`.
  default: jest.fn(),
}));

// Dynamic so it loads after the mock.module() calls above; ESM would hoist a static import.
const {default: ConcreteBluetoothAdapter} = await import(
  '../src/NodeBluetoothAdapter'
);

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
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002'
      );
      expect(characteristic).toBeDefined();
    });
  });
});
