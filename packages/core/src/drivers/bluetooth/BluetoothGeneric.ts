import * as WoT from 'wot-typescript-definitions';
import {getWot} from '../index.js';

export default class BluetoothGeneric {
  public thing: WoT.ConsumedThing | null = null;

  public async init(webBluetoothId: string) {
    const td: WoT.ThingDescription = {
      '@context': ['https://www.w3.org/2019/wot/td/v1'],
      '@type': ['Thing'],
      id: 'blast:bluetooth:BluetoothGeneric',
      title: 'Genereic Bluetooth device',
      description: 'A generic Bluetooth device',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      security: 'nosec_sc',
      properties: {
        barometricPressureTrend: {
          title: 'Barometric pressure trend',
          description: 'The barometric pressure trend in hPa.',
          unit: 'hPa',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://00001802-0000-1000-8000-00805f9b34fb/00002a1c-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        batteryLevel: {
          title: 'Battery level',
          description: 'Battery level in %.',
          unit: '%',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://0000180f-0000-1000-8000-00805f9b34fb/00002a19-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        deviceName: {
          title: 'Device name',
          description: 'User defined name of the device',
          type: 'string',
          readOnly: false,
          forms: [
            {
              op: 'writeproperty',
              href: 'gatt://00001800-0000-1000-8000-00805f9b34fb/00002a00-0000-1000-8000-00805f9b34fb/writeWithoutResponse',
              'wbt:id': webBluetoothId,
            },
            {
              op: 'readproperty',
              href: 'gatt://00001800-0000-1000-8000-00805f9b34fb/00002a00-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        elevation: {
          title: 'Elevation',
          description: 'The elevation measured by the device.',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://00001803-0000-1000-8000-00805f9b34fb/00002a6c-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        firmwareRevision: {
          title: 'Firmware revision',
          description: "Revision of the device's firmware",
          type: 'string',
          readOnly: true,
          forms: [
            {
              href: 'gatt://0000180a-0000-1000-8000-00805f9b34fb/00002a26-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        hardwareRevision: {
          title: 'Hardware revision',
          description: "Revision of the device's hardware",
          type: 'string',
          readOnly: true,
          forms: [
            {
              href: 'gatt://0000180a-0000-1000-8000-00805f9b34fb/00002a27-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        humidity: {
          title: 'Humidity',
          description: 'The relative humidity in %',
          unit: '%',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://00001803-0000-1000-8000-00805f9b34fb/00002a6f-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        irradiance: {
          title: 'Irradiance',
          description: 'Irradiance measured by the device.',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://00001803-0000-1000-8000-00805f9b34fb/00002a77-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        intermediateTemperature: {
          title: 'Intermediate temperature',
          description: 'The intermediate temperature measured by the device.',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://00001809-0000-1000-8000-00805f9b34fb/00002a1e-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        manufacturerName: {
          title: 'Manufacturer name',
          type: 'string',
          readOnly: true,
          forms: [
            {
              href: 'gatt://0000180a-0000-1000-8000-00805f9b34fb/00002a29-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        modelNumber: {
          title: 'Model number',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://0000180a-0000-1000-8000-00805f9b34fb/00002a24-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        movementCounter: {
          title: 'Movement counter',
          description:
            'A counter incremented everytime the device starts moving.',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://00001809-0000-1000-8000-00805f9b34fb/00002a56-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        pressure: {
          title: 'Pressure',
          description: 'Barometric pressure in hPa',
          unit: 'hPa',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://00001809-0000-1000-8000-00805f9b34fb/00002a6d-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        serialNumber: {
          title: 'Serial number',
          type: 'string',
          readOnly: true,
          forms: [
            {
              href: 'gatt://0000180a-0000-1000-8000-00805f9b34fb/00002a25-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        softwareRevision: {
          title: 'Software revision',
          description: "Revision of the device's software",
          type: 'string',
          readOnly: true,
          forms: [
            {
              href: 'gatt://0000180a-0000-1000-8000-00805f9b34fb/00002a28-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        temperature: {
          title: 'Temperature',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://00001809-0000-1000-8000-00805f9b34fb/00002a6e-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        temperatureMeasurement: {
          title: 'Temperature measurement',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://00001809-0000-1000-8000-00805f9b34fb/00002a1c-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        temperatureType: {
          title: 'Temperature type',
          type: 'string',
          readOnly: true,
          forms: [
            {
              href: 'gatt://00001809-0000-1000-8000-00805f9b34fb/00002a1d-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        txPowerLevel: {
          title: 'Tx Power Level',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://00001804-0000-1000-8000-00805f9b34fb/00002a07-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        weight: {
          title: 'Weight',
          type: 'number',
          readOnly: true,
          forms: [
            {
              href: 'gatt://00001808-0000-1000-8000-00805f9b34fb/00002a9d-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': webBluetoothId,
            },
          ],
        },
      },
    };
    const wot = await getWot();
    const thing = await wot.consume(td);
    this.thing = thing;
    return thing;
  }
}
