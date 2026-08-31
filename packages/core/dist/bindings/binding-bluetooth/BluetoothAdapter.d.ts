export declare abstract class BluetoothAdapter {
    abstract getCharacteristic(deviceId: string, serviceID: BluetoothServiceUUID, characteristicId: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>;
    abstract observeGAP(deviceId: string, handler: (event: any) => void): Promise<void>;
}
