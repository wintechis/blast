export interface BluetoothAdapter {
  getCharacteristic(
    deviceId: string,
    serviceID: BluetoothServiceUUID,
    characteristicId: BluetoothCharacteristicUUID
  ): Promise<BluetoothRemoteGATTCharacteristic>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  observeGAP(deviceId: string, handler: (event: any) => void): Promise<void>;
}
