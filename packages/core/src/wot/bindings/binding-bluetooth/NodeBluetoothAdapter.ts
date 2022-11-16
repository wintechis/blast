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
    console.log('deviceId', deviceId);
    const formattedDeviceId = deviceId?.replace(/(.{2})/g, '$1:').slice(0, -1);
    console.log(formattedDeviceId);

    if (!this.adapter) {
      const {bluetooth} = createBluetooth();
      this.adapter = await bluetooth.defaultAdapter();
    }

    if (!(await this.adapter.isDiscovering())) {
      console.debug('[NodeBluetoothAdapter] Starting discovery');
      await this.adapter.startDiscovery();
    }

    console.debug(
      `[NodeBluetoothAdapter] Looking for device ${formattedDeviceId}`
    );
    const device = await this.adapter.waitDevice(formattedDeviceId);
    if (!device) {
      throw new Error(`Device with id ${formattedDeviceId} not found`);
    }
    console.debug(`[NodeBluetoothAdapter] Found device ${formattedDeviceId}`);

    console.debug(
      `[NodeBluetoothAdapter] Connecting to device ${formattedDeviceId}`
    );
    await device.connect();
    const gattServer = await device.gatt();

    console.debug(
      `[NodeBluetoothAdapter] Getting service ${serviceID} on device ${formattedDeviceId}`
    );
    const service = await gattServer.getPrimaryService(serviceID);

    console.debug(
      `[NodeBluetoothAdapter] Getting characteristic ${characteristicId} on device ${formattedDeviceId}`
    );
    return service.getCharacteristic(
      characteristicId
    ) as unknown as Promise<BluetoothRemoteGATTCharacteristic>;
  }
}
