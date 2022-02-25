// eslint-disable-next-line node/no-unpublished-import
import * as WoT from 'wot-typescript-definitions';
import {
  getActiveSlot,
  readEddystoneProperty,
  setActiveSlot,
  writeEddystoneProperty,
} from '../../blast_eddystone.js';
import {getThing} from '../index.js';

export class EddystoneDevice {
  public thing: WoT.ExposedThing | null = null;
  public td: WoT.ThingDescription;
  private webBluetoothId: string;
  private slot = -1;

  public thingModel: WoT.ThingDescription = {
    '@context': ['https://www.w3.org/2019/wot/td/v1'],
    '@type': ['Thing'],
    id: 'blast:bluetooth:iBKS105', // this should normally be an URI, need to figure out a how to properly identify tds
    title: 'iBKS105',
    description: 'Accent Systems iBKS105 iBeacon',
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
      },
      advertisedData: {
        title: 'Advertised Data',
        description: 'The advertised data of the eddystone device',
        unit: '',
        type: 'string',
        readOnly: false,
      },
      advertisingInterval: {
        title: 'Advertising Interval',
        description: 'The advertising interval of the eddystone device',
        unit: 'ms',
        type: 'integer',
        readOnly: false,
      },
      lockState: {
        title: 'Lock State',
        description: 'The lock state of the eddystone device',
        unit: '',
        type: 'string',
        readOnly: true,
      },
      publicEcdhKey: {
        title: 'Public ECDH Key',
        description: 'The public ECDH key of the eddystone device',
        unit: '',
        type: 'string',
        readOnly: true,
      },
      radioTxPower: {
        title: 'Radio Tx Power',
        description: 'The radio TX power of the eddystone device',
        unit: 'dBm',
        type: 'integer',
        readOnly: false,
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
    const propertyKeys = Object.keys(properties);
    if (this.thing) {
      for (const p of propertyKeys) {
        this.thing.setPropertyReadHandler(p, () => {
          return readEddystoneProperty(this.webBluetoothId, p);
        });

        if (!properties[p].readOnly) {
          this.thing.setPropertyWriteHandler(p, value => {
            return writeEddystoneProperty(
              this.webBluetoothId,
              p,
              value as unknown as string
            );
          });
        }
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
}
