import * as WoT from 'wot-typescript-definitions';
import {
  getActiveSlot,
  readEddystoneProperty,
  setActiveSlot,
  writeEddystoneProperty,
} from '../../blast_eddystone.js';
import {getThing, removeThing} from '../index.js';

export default class EddystoneDevice {
  public thing: WoT.ExposedThing | null = null;
  private td: WoT.ThingDescription | null = null;
  private webBluetoothId: string;
  private slot = -1;

  public thingModel: WoT.ThingDescription = {
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
      advertisedTxPower: {
        title: 'Advertised Tx Power',
        description: 'The advertised TX power of the iBeacon',
        unit: 'dBm',
        type: 'integer',
        readOnly: false,
        forms: [
          {
            href: '',
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
            href: '',
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
            href: '',
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
            href: '',
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
            href: '',
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
            href: '',
          },
        ],
      },
    },
  };

  constructor(webBluetoothId: string) {
    this.webBluetoothId = webBluetoothId;
    getThing(this.thingModel).then(thing => {
      this.thing = thing;
      this.td = thing.getThingDescription();
      this.addPropertyHandlers();
      this.thing.expose();
    });
  }

  private addPropertyHandlers(): void {
    const properties = this.thingModel.properties;
    for (const p in properties) {
      this.thing?.setPropertyReadHandler(p, () => {
        return readEddystoneProperty(this.webBluetoothId, p);
      });

      if (!properties[p].readOnly) {
        this.thing?.setPropertyWriteHandler(p, value => {
          return writeEddystoneProperty(
            this.webBluetoothId,
            p,
            value as unknown as string
          );
        });
      }
    }
  }

  private async setActiveSlot(slot: number): Promise<void> {
    if ((await this.getActiveSlot()) !== slot) {
      await setActiveSlot(this.webBluetoothId, slot);
      this.slot = slot;
    }
  }

  private async getActiveSlot(): Promise<number> {
    if (!this.slot) {
      this.slot = await getActiveSlot(this.webBluetoothId);
    }
    return this.slot;
  }

  public async writeProperty(
    property: string,
    value: string,
    slot: number
  ): Promise<void> {
    this.setActiveSlot(slot);
    return writeEddystoneProperty(this.webBluetoothId, property, value);
  }

  public async readProperty(property: string, slot: number): Promise<string> {
    this.setActiveSlot(slot);
    return readEddystoneProperty(this.webBluetoothId, property);
  }

  public async getThingDescription(): Promise<WoT.ThingDescription | null> {
    while (!this.thing) {
      // Wait for the thing to be created
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.td;
  }

  public async destroy(): Promise<void> {
    if (this.td) {
      await removeThing(this.td);
    }
  }
}
