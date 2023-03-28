import {HidAdapter} from './HidAdapter';
import {Device, devices, HID} from 'node-hid';
import {createLoggers} from '@node-wot/core';

const {debug} = createLoggers('binding-hid', 'WebHidAdapter');

export default class ConcreteHidAdapter implements HidAdapter {
  devices: Map<string, HIDDevice> = new Map();

  public async getDevice(path: string): Promise<HIDDevice> {
    debug(`Getting device at path ${path}`);
    if (this.devices.has(path)) {
      return this.devices.get(path) as HIDDevice;
    }
    const hidDevices = devices();
    const device = hidDevices.find(device => device.path === path);
    if (!device) {
      throw new Error(`Device with id ${path} not found`);
    }
    const hidDevice = ConcreteHidAdapter.wrap(
      device,
      new HID(device.path as string)
    );
    this.devices.set(path, hidDevice);
    return hidDevice;
  }

  // Wrap node-hid to implement HIDDevice interface.
  static wrap(device: Device, hid: HID): HIDDevice {
    return {
      open: async () => {
        new HID(device.path as string);
      },
      close: async () => {
        hid.close();
      },
      forget: async () => {
        hid.close();
      },
      sendReport: async (reportId: number, data: BufferSource) => {
        hid.write(data as Buffer);
      },
      sendFeatureReport: async (reportId: number, data: BufferSource) => {
        // use hid.sendFeatureReport() with reportId as first byte
        hid.sendFeatureReport(data as Buffer);
      },
      receiveFeatureReport: async (reportId: number) => {
        // node-hid needs to know the report length, return empty DataView
        return new DataView(new ArrayBuffer(0));
      },
      opened: true,
      vendorId: device.vendorId,
      productId: device.productId,
      productName: device.product || '',
      collections: [],
      oninputreport: (event: HIDInputReportEvent) => {
        // TODO
      },
      addEventListener: (type, listener) => {
        if (type === 'inputreport') {
          hid.on('data', listener as EventListener);
        }
      },
      removeEventListener: (type, listener) => {
        // Not implemented in node-hid, readme says:
        // To remove an event handler, close the device with device.close()
      },
      dispatchEvent: event => {
        // Not implemented in node-hid
        return true;
      },
    };
  }
}
