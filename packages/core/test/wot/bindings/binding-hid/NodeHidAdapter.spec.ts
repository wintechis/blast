// add mock device to adapter
const mockDevice: Device = {
  vendorId: 0,
  productId: 0,
  path: 'testDevice',
  serialNumber: 'testSerial',
  manufacturer: 'testManufacturer',
  product: 'testProduct',
  release: 0,
  interface: 0,
  usagePage: 0,
  usage: 0,
};
jest.mock('node-hid', () => {
  return {
    devices: jest.fn(() => {
      return [mockDevice];
    }),
    HID: jest.fn(() => {
      return {
        close: jest.fn(),
        pause: jest.fn(),
        read: jest.fn(),
        readSync: jest.fn(),
        readTimeout: jest.fn(),
        sendFeatureReport: jest.fn(),
        getFeatureReport: jest.fn(),
        resume: jest.fn(),
        write: jest.fn(),
        setNonBlocking: jest.fn(),
      };
    }),
  };
});

// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, jest, test} from '@jest/globals';
import {Device, devices, HID} from 'node-hid';
import ConcreteHidAdapter from '../../../../src/wot/bindings/binding-hid/NodeHidAdapter';
import {beforeEach} from '@jest/globals';

describe('NodeHidAdapter', () => {
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

    test('getting a known device should not call devices', async () => {
      (devices as jest.Mock).mockClear();
      await adapter.getDevice('testDevice');
      expect(devices).not.toHaveBeenCalled();
    });
  });
});

describe('wrap', () => {
  const device: Device = {
    vendorId: 0,
    productId: 0,
    path: 'testDevice',
    serialNumber: 'testSerial',
    manufacturer: 'testManufacturer',
    product: 'testProduct',
    release: 0,
    interface: 0,
    usagePage: 0,
    usage: 0,
  };
  const hid = new HID(device.path as string);
  const hidDevice = ConcreteHidAdapter.wrap(device, hid);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('wraps node-hid Device to HIDDevice', () => {
    expect(hidDevice).toBeDefined();
  });

  test('open calls HID constructor', async () => {
    await hidDevice.open();
    expect(HID).toHaveBeenCalledWith(device.path);
  });

  test('close calls hid.close', async () => {
    await hidDevice.close();
    expect(hid.close).toHaveBeenCalled();
  });

  test('forget calls hid.close', async () => {
    await hidDevice.forget();
    expect(hid.close).toHaveBeenCalled();
  });

  test('sendReport calls hid.write', async () => {
    const reportId = 0;
    const data = new Uint8Array([0]);
    await hidDevice.sendReport(reportId, data);
    expect(hid.write).toHaveBeenCalledWith(
      Buffer.concat([Buffer.from([reportId]), Buffer.from(data)])
    );
  });

  test('sendFeatureReport calls hid.sendFeatureReport', async () => {
    const data = new Uint8Array([0]);
    await hidDevice.sendFeatureReport(1, data);
    expect(hid.sendFeatureReport).toHaveBeenCalledWith(data);
  });

  test('receiveFeatureReport on node is not compatible with web, returns DataView containing [0]', async () => {
    const data = await hidDevice.receiveFeatureReport(1);
    expect(data).toEqual(new DataView(new Uint8Array([0]).buffer));
  });

  test('dispatchEvent returns true', async () => {
    expect(await hidDevice.dispatchEvent(new Event('test'))).toBe(true);
  });
});
