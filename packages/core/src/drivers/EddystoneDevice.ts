import * as WoT from 'wot-typescript-definitions';
import {getWot} from '../wot/index';

export default class EddystoneDevice {
  public thing: WoT.ConsumedThing | null = null;

  public async init(webBluetoothId: string) {
    const td: WoT.ThingDescription = {
      '@context': ['https://www.w3.org/2019/wot/td/v1'],
      '@type': ['Thing'],
      id: 'blast:bluetooth:EddystoneDevice',
      title: 'Eddystone Device',
      description: 'A Bluetooth device implementing the Eddystone protocol',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      security: 'nosec_sc',
      properties: {
        activeSlot: {
          title: 'Active Slot',
          description: 'The active slot of the Eddystone device',
          type: 'integer',
          readOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87502-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': webBluetoothId,
            },
            {
              op: 'writeproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87502-8ed3-4bdf-8a39-a01bebede295/writeEddystoneProperty',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        advertisedTxPower: {
          title: 'Advertised Tx Power',
          description: 'The advertised TX power of the iBeacon',
          unit: 'dBm',
          type: 'integer',
          readOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87505-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': webBluetoothId,
            },
            {
              op: 'writeproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87505-8ed3-4bdf-8a39-a01bebede295/writeEddystoneProperty',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        advertisedData: {
          title: 'Advertised Data',
          description: 'The advertised data of the eddystone device',
          unit: '',
          type: 'string',
          readOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c8750a-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': webBluetoothId,
            },
            {
              op: 'writeproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c8750a-8ed3-4bdf-8a39-a01bebede295/writeEddystoneProperty',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        advertisingInterval: {
          title: 'Advertising Interval',
          description: 'The advertising interval of the eddystone device',
          unit: 'ms',
          type: 'integer',
          readOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87503-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': webBluetoothId,
            },
            {
              op: 'writeproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87503-8ed3-4bdf-8a39-a01bebede295/writeEddystoneProperty',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        capabilities: {
          title: 'Capabilities',
          description: 'The capabilities of the eddystone device',
          type: 'array',
          readOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87501-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        lockState: {
          title: 'Lock State',
          description: 'The lock state of the eddystone device',
          unit: '',
          type: 'string',
          readOnly: true,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87506-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        publicEcdhKey: {
          title: 'Public ECDH Key',
          description: 'The public ECDH key of the eddystone device',
          unit: '',
          type: 'string',
          readOnly: true,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87508-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': webBluetoothId,
            },
          ],
        },
        radioTxPower: {
          title: 'Radio Tx Power',
          description: 'The radio TX power of the eddystone device',
          unit: 'dBm',
          type: 'integer',
          readOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87504-8ed3-4bdf-8a39-a01bebede295/readEddystoneProperty',
              'wbt:id': webBluetoothId,
            },
            {
              op: 'writeproperty',
              href: 'gatt://a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87504-8ed3-4bdf-8a39-a01bebede295/writeEddystoneProperty',
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
