import {HidAdapter} from './HidAdapter';
import {createLoggers} from '@node-wot/core';

const {debug} = createLoggers('binding-hid', 'WebHidAdapter');

export default class ConcreteHidAdapter implements HidAdapter {
  devices: Map<string, HIDDevice> = new Map();

  public async getDevice(id: string): Promise<HIDDevice> {
    debug(`Getting device with id ${id}`);
    if (this.devices.has(id)) {
      return this.devices.get(id) as HIDDevice;
    }
    const devices = await navigator.hid.getDevices();
    const device = devices.find(
      device => device.productId === parseInt(id, 16)
    );
    if (!device) {
      throw new Error(`Device with id ${id} not found`);
    }
    this.devices.set(id, device);
    return device;
  }
}
