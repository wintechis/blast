// eslint-disable-next-line node/no-unpublished-import
import {BluetoothAdapter} from '../../core/src/index';
import {createLoggers} from '@node-wot/core';

const {debug} = createLoggers('binding-bluetooth', 'WebBluetoothAdapter');

export default class ConcreteBluetoothAdapter extends BluetoothAdapter {
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

  public async observeGAP(
    deviceId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (event: any) => void
  ): Promise<void> {
    const filters: BluetoothLEScanFilter[] = [];
    if (deviceId) {
      filters.push({name: deviceId});
    }
    debug(`Starting scan with filters ${filters}`);
    await navigator.bluetooth.requestLEScan({filters});
    navigator.bluetooth.addEventListener('advertisementreceived', handler);
  }
}
