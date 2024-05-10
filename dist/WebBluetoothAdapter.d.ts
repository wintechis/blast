/// <reference types="web-bluetooth" />
import { BluetoothAdapter } from '@blast/core';
export default class ConcreteBluetoothAdapter extends BluetoothAdapter {
    getCharacteristic(deviceId: string, serviceId: BluetoothServiceUUID, characteristicId: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>;
    observeGAP(deviceId: string, handler: (event: any) => void): Promise<void>;
}
