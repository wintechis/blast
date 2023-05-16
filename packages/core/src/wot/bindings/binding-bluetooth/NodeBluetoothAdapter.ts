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
    // test if deviceId is hex characters and : only
    if (!/^[0-9a-fA-F:]+$/.test(deviceId)) {
      throw new Error(`Device id ${deviceId} is not valid`);
    }
    // test if deviceId has : every 2 characters
    if (!/^([0-9a-fA-F]{2}:)*[0-9a-fA-F]{2}$/.test(deviceId)) {
      // add ':' every 2 characters
      deviceId = deviceId?.replace(/(.{2})/g, '$1:').slice(0, -1);
    }

    if (!this.adapter) {
      const {bluetooth} = createBluetooth();
      this.adapter = await bluetooth.defaultAdapter();
    }

    if (!(await this.adapter.isDiscovering())) {
      debug('Starting discovery');
      await this.adapter.startDiscovery();
    }

    debug(`Looking for device ${deviceId}`);
    const device = await this.adapter.waitDevice(deviceId, 10000);
    if (!device) {
      throw new Error(`Device with id ${deviceId} not found`);
    }
    debug(`Found device ${deviceId}`);

    debug(`Connecting to device ${deviceId}`);
    await device.connect();
    const gattServer = await device.gatt();

    debug(`Getting service ${serviceID} on device ${deviceId}`);
    const service = await gattServer.getPrimaryService(serviceID);

    debug(`Getting characteristic ${characteristicId} on device ${deviceId}`);
    return service.getCharacteristic(
      characteristicId
    ) as unknown as Promise<BluetoothRemoteGATTCharacteristic>;
  }
}
