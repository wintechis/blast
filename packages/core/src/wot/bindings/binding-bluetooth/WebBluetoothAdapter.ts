import {BluetoothAdapter} from './BluetoothAdapter';
import {createLoggers} from '@node-wot/core';

const {debug, error, warn} = createLoggers(
  'binding-bluetooth',
  'WebBluetoothAdapter'
);

export default class ConcreteBluetoothAdapter implements BluetoothAdapter {
  public async getCharacteristic(
    deviceId: string,
    serviceId: BluetoothServiceUUID,
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
    debug(`connecting to decive ${device.id}`);
    const server = await device.gatt.connect();
    debug(`Getting service ${serviceId} of device ${device.id}`);
    const service = await server.getPrimaryService(serviceId);
    debug(
      `Getting characteristic ${characteristicId} of service ${serviceId} of device ${device.id}`
    );
    return service.getCharacteristic(characteristicId);
  }
}
