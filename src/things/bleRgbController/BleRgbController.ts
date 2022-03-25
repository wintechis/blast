import {ExposedThing} from '@node-wot/core';
import * as WoT from 'wot-typescript-definitions';
import {getThing, removeThing} from '../index.js';
import {writeWithoutResponse} from '../../blast_webBluetooth.js';

export default class BleRgbController {
  private thing: WoT.ExposedThing | null = null;
  private exposedThing: ExposedThing | null = null;
  private webBluetoothId: string;
  private td: WoT.ThingDescription;
  private LEDServiceUUID: BluetoothServiceUUID =
    '0000fff0-0000-1000-8000-00805f9b34fb';
  private characteristicUUID: BluetoothCharacteristicUUID =
    '0000fff3-0000-1000-8000-00805f9b34fb';

  public thingModel: WoT.ThingDescription = {
    '@context': ['https://www.w3.org/2019/wot/td/v1'],
    '@type': ['Thing'],
    id: 'blast:Bluetooth:ledController',
    title: 'BLE RGB Controller',
    description:
      'A Bluetooth Low Energy (BLE) controller that can be used to control RGB LED lights.',
    securityDefinitions: {
      nosec_sc: {
        scheme: 'nosec',
      },
    },
    security: 'nosec_sc',
    properties: {
      colour: {
        title: 'colour',
        description: 'The colour of the LED light.',
        unit: '',
        type: 'string',
        readOnly: false,
        writeOnly: true,
      },
    },
  };

  constructor(webBluetoothId: string) {
    this.webBluetoothId = webBluetoothId;
    getThing(this.thingModel).then(thing => {
      this.thing = thing;
      this.exposedThing = this.thing as unknown as ExposedThing;
      this.td = thing.getThingDescription();
      this.addPropertyHandlers();
      this.thing.expose();
    });
  }

  private addPropertyHandlers() {
    this.thing?.setPropertyWriteHandler('colour', value => {
      return this.setColour(value as unknown as string);
    });
  }

  private async setColour(colour: string): Promise<void> {
    const value = '7e000503' + colour.substring(1, 7) + '00ef';
    await writeWithoutResponse(
      this.webBluetoothId,
      this.LEDServiceUUID,
      this.characteristicUUID,
      value
    );
  }

  public destroy() {
    removeThing(this.td?.id);
  }

  public async writeProperty(property: string, value: any) {
    while (!this.exposedThing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.exposedThing.writeProperty(property, value);
  }

  public async getThingDescription(): Promise<WoT.ThingDescription> {
    while (!this.thing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.td;
  }
}
