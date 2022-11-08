export interface BluetoothAdapter {
  getCharacteristic(
    deviceId: string,
    serviceID: BluetoothServiceUUID,
    characteristicId: BluetoothCharacteristicUUID
  ): Promise<BluetoothRemoteGATTCharacteristic>;
}
