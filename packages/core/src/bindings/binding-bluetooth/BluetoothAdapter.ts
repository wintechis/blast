export abstract class BluetoothAdapter {
  abstract getCharacteristic(
    deviceId: string,
    serviceID: BluetoothServiceUUID,
    characteristicId: BluetoothCharacteristicUUID
  ): Promise<BluetoothRemoteGATTCharacteristic>;

  abstract observeGAP(
    deviceId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (event: any) => void
  ): Promise<void>;
}
