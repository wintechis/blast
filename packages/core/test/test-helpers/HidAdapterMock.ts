import {HidAdapter} from "../../src/bindings/binding-hid/HidAdapter";

class HIDDeviceMock extends EventTarget implements HIDDevice {
  public opened = false;
  public path: string;
  public value = new DataView(new ArrayBuffer(0));
  public readonly productId: number = 0;
  public readonly vendorId: number = 0;
  public readonly productName: string = '';
  public readonly serialNumber: string = '';
  public readonly collections: HIDCollectionInfo[] = [];
  public readonly deviceInterface: number = 0;
  public readonly usage: number = 0;
  public readonly usagePage: number = 0;
  public readonly reportDescriptor: Buffer = Buffer.alloc(0);
  public readonly featureReportLength: number = 0;
  public readonly inputReportLength: number = 0;
  public readonly maxFeatureReportLength: number = 0;
  public readonly maxInputReportLength: number = 0;
  public readonly maxOutputReportLength: number = 0;

  constructor(
    path: string,
    vendorId: number,
    productId: number,
    productName: string
  ) {
    super();
    this.path = path;
    this.vendorId = vendorId;
    this.productId = productId;
    this.productName = productName;
  }

  public async open() {
    this.opened = true;
  }

  public async close() {
    this.opened = false;
  }

  public async sendReport(reportId: number, data: Buffer) {
    return;
  }

  public async getFeatureReport(reportId: number, length: number) {
    return Buffer.alloc(0);
  }

  public async sendFeatureReport(reportId: number, data: Buffer) {
    return;
  }

  public async receiveFeatureReport(reportId: number) {
    return this.value;
  }

  public async getReport(reportId: number, length: number) {
    return Buffer.alloc(0);
  }

  public async receiveReport(reportId: number, length: number) {
    return Buffer.alloc(0);
  }

  public async oninputreport(this: this, ev: HIDInputReportEvent) {
    return;
  }

  public async forget() {
    return;
  }

  public addEventListener(
    type: string,
    listener:
      | EventListenerOrEventListenerObject
      | ((this: this, ev: HIDInputReportEvent) => any)
      | null,
    options?: boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type, listener as EventListener, options);
  }

  public removeEventListener(
    type: string,
    callback:
      | EventListenerOrEventListenerObject
      | ((this: this, ev: HIDInputReportEvent) => any)
      | null,
    options?: boolean | EventListenerOptions | undefined
  ): void {
    super.removeEventListener(type, callback as EventListener, options);
  }
}

export default class HidAdapterMock extends HidAdapter {
  public devices: HIDDeviceMock[] = [];

  public getDevice(id: string): Promise<HIDDevice> {
    return new Promise((resolve, reject) => {
      const device = this.devices.find(d => d.path === id);
      if (device) {
        resolve(device as any as HIDDevice);
      } else {
        reject(new Error(`Device ${id} not found`));
      }
    });
  }

  public addDevice(
    path: string,
    value: DataView,
    vendorId = 0,
    productId = 0,
    productName = 'mock'
  ) {
    const device = new HIDDeviceMock(path, vendorId, productId, productName);
    device.value = new DataView(value.buffer as ArrayBuffer);
    this.devices.push(device);
    return device;
  }
}
