import {HidAdapter} from '@blast/core';
import {createLoggers} from '@node-wot/core';

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
    // Generate a unique id for the new device. crypto.randomUUID replaces the uuid
    // package; it needs a secure context (WebHID requires one anyway) but also raises
    // this bundle's floor to Chrome 92, three versions above WebHID's own Chrome 89.
    // See the browser support note in packages/browser-demo/README.md.
    const id = crypto.randomUUID();
    const hidAdapterDevice = device as HIDAdapterDevice;
    hidAdapterDevice.id = id;
    if (!device.opened) {
      await device.open();
    }
    hidAdapterDevices.push(hidAdapterDevice);
  }
  return hidAdapterDevices;
};
