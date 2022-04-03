import {ExposedThing} from '@node-wot/core';
import * as WoT from 'wot-typescript-definitions';
import {readText, writeWithoutResponse} from '../../blast_webBluetooth.js';
import {getThing, removeThing} from '../index.js';

export default class HuskyDuino {
  public thing: WoT.ExposedThing | null = null;
  private td: WoT.ThingDescription;
  private exposedThing: ExposedThing | null = null;
  private webBluetoothId: string;
  private HuskyServiceUUID = '5be35d20-f9b0-11eb-9a03-0242ac130003';

  public thingModel: WoT.ThingDescription = {
    '@context': ['https://www.w3.org/2019/wot/td/v1'],
    '@type': ['Thing'],
    id: 'blast:bluetooth:HuskyDuino',
    title: 'HuskyDuino',
    description: 'A HuskyLens interface running on Arduino',
    securityDefinitions: {
      nosec_sc: {
        scheme: 'nosec',
      },
    },
    security: 'nosec_sc',
    properties: {
      algorithm: {
        description: 'The currently active algorithm',
        type: 'number',
        readOnly: false,
        writeOnly: false,
      },
      id: {
        description: 'The ID of the face or object',
        type: 'number',
        readOnly: false,
        writeOnly: false,
      },
    },
    actions: {
      forgetAll: {
        title: 'Forget all faces and objects',
        description: 'Forget all faces and objects',
        input: {
          type: 'null',
        },
      },
    },
  };

  constructor(webBluetoothId: string) {
    this.webBluetoothId = webBluetoothId;
    getThing(this.thingModel).then(thing => {
      this.thing = thing;
      this.exposedThing = thing as unknown as ExposedThing;
      this.td = thing.getThingDescription();
      this.setPropertyHandlers();
      this.setActionHandlers();
      this.thing.expose();
    });
  }

  private setPropertyHandlers(): void {
    this.thing?.setPropertyWriteHandler('algorithm', parameters => {
      return this.setAlgorithm(parameters as unknown as string);
    });
    this.thing?.setPropertyReadHandler('id', parameters => {
      return this.getId();
    });
    this.thing?.setPropertyWriteHandler('id', parameters => {
      return this.learn(parameters as unknown as string);
    });
  }

  private setActionHandlers(): void {
    this.thing?.setActionHandler('forgetAll', parameters => {
      return this.forgetAll();
    });
  }

  /**
   * Set algorithm the Huskylens should use.
   * @param alg the algorithm to use
   */
  private async setAlgorithm(alg: string): Promise<void> {
    const characteristicUUID = '5be35d26-f9b0-11eb-9a03-0242ac130003';
    return writeWithoutResponse(
      this.webBluetoothId,
      this.HuskyServiceUUID,
      characteristicUUID,
      alg
    );
  }

  /**
   * Learn a face or object.
   * @param id the ID of the face or object
   */
  private async learn(id: string): Promise<void> {
    const characteristicUUID = '5be35eca-f9b0-11eb-9a03-0242ac130003';
    return writeWithoutResponse(
      this.webBluetoothId,
      this.HuskyServiceUUID,
      characteristicUUID,
      id
    );
  }

  /**
   * Get the ID of the face or object.
   */
  public async getId(): Promise<string> {
    const characteristicUUID = '5be3628a-f9b0-11eb-9a03-0242ac130003';
    return readText(
      this.webBluetoothId,
      this.HuskyServiceUUID,
      characteristicUUID
    );
  }

  /**
   * Forget all faces and objects.
   */
  private async forgetAll(): Promise<any> {
    const characteristicUUID = '5be361b8-f9b0-11eb-9a03-0242ac130003';
    await writeWithoutResponse(
      this.webBluetoothId,
      this.HuskyServiceUUID,
      characteristicUUID,
      '0x01'
    );
  }

  public async writeProperty(property: string, value: any): Promise<void> {
    while (!this.exposedThing) {
      // Wait for the thing to be created
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.exposedThing.writeProperty(property, value);
  }

  public async readProperty(property: string): Promise<any> {
    while (!this.exposedThing) {
      // Wait for the thing to be created
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.exposedThing.readProperty(property);
  }

  public async invokeAction(action: string, parameters: any): Promise<any> {
    while (!this.exposedThing) {
      // Wait for the thing to be created
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.exposedThing.invokeAction(action, parameters);
  }

  public async getThingDescription(): Promise<WoT.ThingDescription> {
    while (!this.thing) {
      // Wait for the thing to be created
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.td;
  }

  public destroy(): void {
    removeThing(this.td.id);
  }
}
