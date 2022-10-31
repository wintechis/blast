import {BluetoothAdapter} from './BluetoothAdapter';
import {Adapter, createBluetooth} from 'node-ble';

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
      const {bluetooth} = createBluetooth()
      this.adapter = await bluetooth.defaultAdapter()
    }

    if (!await this.adapter.isDiscovering()) {
      await this.adapter.startDiscovery()
    }

    const device = await this.adapter.waitDevice(formattedDeviceId);
    if (!device) {
      throw new Error(`Device with id ${formattedDeviceId} not found`);
    }

    await device.connect();
    const gattServer = await device.gatt();
    const service = await gattServer.getPrimaryService(serviceID);

    return service.getCharacteristic(
      characteristicId
    ) as unknown as Promise<BluetoothRemoteGATTCharacteristic>;
  }
}
