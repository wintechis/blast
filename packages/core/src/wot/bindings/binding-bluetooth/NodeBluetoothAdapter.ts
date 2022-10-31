import {BluetoothAdapter} from './BluetoothAdapter';
import {Adapter, createBluetooth} from 'node-ble';

export default class ConcreteBluetoothAdapter implements BluetoothAdapter {
  private adapter: Adapter | null = null;

  constructor() {
    const {bluetooth} = createBluetooth();
    bluetooth.defaultAdapter().then(adapter => {
      this.adapter = adapter;
      this.adapter.startDiscovery();
    });
  }

  public async getCharacteristic(
    deviceId: string,
    serviceID: string,
    characteristicId: string
  ): Promise<BluetoothRemoteGATTCharacteristic> {
    const device = await this.adapter?.waitDevice(deviceId);
    if (!device) {
      throw new Error(`Device with id ${deviceId} not found`);
    }
    const gattServer = await device.gatt();
    const service = await gattServer.getPrimaryService(serviceID);
    return service.getCharacteristic(
      characteristicId
    ) as unknown as Promise<BluetoothRemoteGATTCharacteristic>;
  }
}
