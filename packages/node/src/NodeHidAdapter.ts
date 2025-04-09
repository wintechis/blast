/* eslint-disable @typescript-eslint/no-unused-vars */
import {HidAdapter} from '@blast/core';
import {Device, devices, HID} from 'node-hid';
import {createLoggers} from '@node-wot/core';

const {debug} = createLoggers('binding-hid', 'WebHidAdapter');

export default class ConcreteHidAdapter extends HidAdapter {
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
    const hidDevice: HIDDevice = {
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
        // Create a single buffer with reportId as first byte followed by data
        let buffer: Buffer;

        if (data instanceof Uint8Array) {
          // If data is already a Uint8Array, convert it directly
          buffer = Buffer.from([reportId, ...Array.from(data)]);
        } else if (data instanceof ArrayBuffer) {
          // If data is an ArrayBuffer, convert it to a Uint8Array first
          const view = new Uint8Array(data);
          buffer = Buffer.from([reportId, ...Array.from(view)]);
        } else {
          // For other ArrayBufferView types
          const view = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
          buffer = Buffer.from([reportId, ...Array.from(view)]);
        }

        hid.write(buffer);
      },
      sendFeatureReport: async (reportId: number, data: BufferSource) => {
        hid.sendFeatureReport(data as Buffer);
      },
      receiveFeatureReport: async (reportId: number) => {
        // node-hid needs to know the report length, return empty DataView
        return new DataView(new ArrayBuffer(0));
      },
      opened: true,
      vendorId: device.vendorId,
      productId: device.productId,
      productName: device.product ?? '',
      collections: [],
      oninputreport: null,
      addEventListener: (
        type: 'inputreport' | string,
        listener:
          | EventListenerOrEventListenerObject
          | null
          | ((this: HIDDevice, ev: HIDInputReportEvent) => unknown),
        options?: boolean | AddEventListenerOptions
      ) => {
        // Not implemented in node-hid
      },
      removeEventListener: (
        type: 'inputreport' | string,
        listener:
          | EventListenerOrEventListenerObject
          | null
          | ((this: HIDDevice, ev: HIDInputReportEvent) => unknown)
      ) => {
        // Not implemented in node-hid
        // will be overwritten after creating the HIDDevice,
        // because it needs a reference to the HIDDevice.
      },
      dispatchEvent: (event: HIDInputReportEvent) => {
        // Not implemented in node-hid
        return true;
      },
    };
    hidDevice.addEventListener = (type, listener) => {
      if (type === 'inputreport') {
        hid.on('data', (data: Buffer) => {
          // convert to HIDInputReportEvent
          const event: HIDInputReportEvent = {
            type: 'inputreport',
            device: hidDevice,
            reportId: data[0],
            data: new DataView(data.buffer, 1),
            // Hid-client needs data only, so below properties are not implemented
            bubbles: false,
            cancelBubble: false,
            cancelable: false,
            composed: false,
            currentTarget: null,
            defaultPrevented: false,
            eventPhase: 0,
            isTrusted: false,
            returnValue: false,
            srcElement: null,
            target: null,
            timeStamp: 0,
            composedPath: function (): EventTarget[] {
              throw new Error('Function not implemented.');
            },
            initEvent: function (
              type: string,
              bubbles?: boolean | undefined,
              cancelable?: boolean | undefined
            ): void {
              throw new Error('Function not implemented.');
            },
            preventDefault: function (): void {
              throw new Error('Function not implemented.');
            },
            stopImmediatePropagation: function (): void {
              throw new Error('Function not implemented.');
            },
            stopPropagation: function (): void {
              throw new Error('Function not implemented.');
            },
            AT_TARGET: 2,
            BUBBLING_PHASE: 3,
            CAPTURING_PHASE: 1,
            NONE: 0,
          };
          (listener as EventListener)(event);
        });
      }
    };
    return hidDevice;
  }
}
