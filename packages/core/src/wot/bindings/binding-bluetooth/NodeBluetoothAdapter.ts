import {BluetoothAdapter} from './BluetoothAdapter';
import {Adapter, createBluetooth} from 'node-ble';
import {createLoggers} from '@node-wot/core';

const {debug} = createLoggers('binding-bluetooth', 'NodeBluetoothAdapters');

export default class ConcreteBluetoothAdapter implements BluetoothAdapter {
  private adapter: Adapter | null = null;

  public async getCharacteristic(
    deviceId: string,
    serviceID: string,
    characteristicId: string
  ): Promise<BluetoothRemoteGATTCharacteristic> {
    // add ':' every 2 characters
    const formattedDeviceId = deviceId?.replace(/(.{2})/g, '$1:').slice(0, -1);

    if (!this.adapter) {
      const {bluetooth} = createBluetooth();
      this.adapter = await bluetooth.defaultAdapter();
    }

    if (!(await this.adapter.isDiscovering())) {
      debug('Starting discovery');
      await this.adapter.startDiscovery();
    }

    debug(`Looking for device ${formattedDeviceId}`);
    const device = await this.adapter.waitDevice(formattedDeviceId, 10000);
    if (!device) {
      throw new Error(`Device with id ${formattedDeviceId} not found`);
    }
    debug(`Found device ${formattedDeviceId}`);

    debug(`Connecting to device ${formattedDeviceId}`);
    await device.connect();
    const gattServer = await device.gatt();

    debug(`Getting service ${serviceID} on device ${formattedDeviceId}`);
    const service = await gattServer.getPrimaryService(serviceID);

    debug(
      `Getting characteristic ${characteristicId} on device ${formattedDeviceId}`
    );
    return service.getCharacteristic(
      characteristicId
    ) as unknown as Promise<BluetoothRemoteGATTCharacteristic>;
  }
}
