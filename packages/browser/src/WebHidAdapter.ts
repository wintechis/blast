import {HidAdapter} from '../../core/src/index';
import {createLoggers} from '@node-wot/core';
import {v4} from 'uuid';

const {debug} = createLoggers('binding-hid', 'WebHidAdapter');

interface HIDAdapter extends HID {
  requestDeviceAndAddId: (
    options: HIDDeviceRequestOptions
  ) => Promise<HIDAdapterDevice[]>;
}

interface HIDAdapterDevice extends HIDDevice {
  id: string;
}

export default class ConcreteHidAdapter implements HidAdapter {
  public async getDevice(id: string): Promise<HIDDevice> {
    debug(`Getting device with id ${id}`);
    const devices = await navigator.hid.getDevices();
    for (const device of devices) {
      if ((device as HIDAdapterDevice).id === id) {
        return device;
      }
    }
    throw new Error(`Device with id ${id} not found`);
  }
}

(navigator.hid as HIDAdapter).requestDeviceAndAddId = async function (
  options: HIDDeviceRequestOptions
) {
  const devices = await navigator.hid.requestDevice(options);
  const hidAdapterDevices: HIDAdapterDevice[] = [];
  for (const device of devices) {
    // generate a unique id for the new device
    const id = v4();
    const hidAdapterDevice = device as HIDAdapterDevice;
    hidAdapterDevice.id = id;
    if (!device.opened) {
      await device.open();
    }
    hidAdapterDevices.push(hidAdapterDevice);
  }
  return hidAdapterDevices;
};
