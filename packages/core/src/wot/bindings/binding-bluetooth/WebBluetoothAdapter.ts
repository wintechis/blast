import {BluetoothAdapter} from './BluetoothAdapter';

export default class ConcreteBluetoothAdapter implements BluetoothAdapter {
  public async getCharacteristic(
    deviceId: string,
    serviceID: BluetoothServiceUUID,
    characteristicId: BluetoothCharacteristicUUID
  ): Promise<BluetoothRemoteGATTCharacteristic> {
    const devices = await navigator.bluetooth.getDevices();
    const device = devices.find(device => device.id === deviceId);
    if (!device) {
      throw new Error(`Device with id ${deviceId} not found`);
    }
    if (!device.gatt) {
      throw new Error(`Device with id ${deviceId} is not connected`);
    }
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(serviceID);
    return service.getCharacteristic(characteristicId);
  }
}
