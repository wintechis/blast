/**
 * @fileoverview WebBluetooth protocol binding for eclipse/thingweb.node-wot
 */

import {Content, ProtocolClient, ProtocolHelpers} from '@node-wot/core';
import {Form, SecurityScheme} from '@node-wot/td-tools';
import {Subscription} from 'rxjs';
import {
  getDeviceById,
  readHex,
  readNumber,
  readText,
  startLEScan,
  stopLEScan,
  subscribe,
  unsubscribe,
  writeWithoutResponse,
  writeWithResponse,
} from '../../../blast_webBluetooth.js';
import {
  eddystoneProperties,
  readEddystoneProperty,
  writeEddystoneProperty,
} from './../../../blast_eddystone.js';
import {WebBluetoothForm} from './webBluetooth.js';
import {
  readableStreamToString,
  convertToNodeReadable,
} from '../binding-helpers.js';
import {Readable} from 'stream';

export default class WebBluetoothClient implements ProtocolClient {
  public toString(): string {
    return '[WebBluetoothClient]';
  }
  public readResource(form: WebBluetoothForm): Promise<Content> {
    const path = form.href.split('//')[1];
    const deviceId = form['wbt:id'];
    const deconstructedPath = this.deconstructPath(path);
    const {serviceId, characteristicId, operation} = deconstructedPath;

    return this.read(deviceId, serviceId, characteristicId, operation);
  }

  public writeResource(
    form: WebBluetoothForm,
    content: Content
  ): Promise<void> {
    const path = form.href.split('//')[1];
    const deviceId = form['wbt:id'];
    const deconstructedPath = this.deconstructPath(path);
    const {serviceId, characteristicId, operation} = deconstructedPath;

    return this.write(
      deviceId,
      serviceId,
      characteristicId,
      operation,
      content
    );
  }

  public invokeResource(
    form: WebBluetoothForm,
    content: Content
  ): Promise<Content> {
    // TODO check if href is service/char/operation, then write,
    // might also be gatt://operation, i.e watchAdvertisements
    return this.writeResource(form, content).then(() => {
      return {
        type: 'text/plain',
        body: convertToNodeReadable(''),
      };
    });
  }

  public unlinkResource(form: Form): Promise<void> {
    throw new Error('not implemented');
  }

  public async subscribeResource(
    form: WebBluetoothForm,
    next: (content: Content) => void,
    error?: (error: Error) => void,
    complete?: () => void
  ): Promise<Subscription> {
    // Check if href is gatt://service/characteristic/subscibre, then subscribe to characteristic
    //if href is gatt://watchAdvertisements then subscribe to watchAdvertisements
    const path = form.href.split('//')[1];
    if (path === 'watchadvertisements') {
      console.debug('[binding-webBluetooth]', 'invoking watchAdvertisements');
      return this.watchAdvertisements(form, next, error, complete);
    } else if (path === 'startLEScan') {
      console.debug('[binding-webBluetooth]', 'invoking startLEScan');
      return this.startLEScan(form, next, error, complete);
    } else {
      return this.subscribeToCharacteristic(form, next, error, complete);
    }
  }

  public async start(): Promise<void> {
    // do nothing
  }

  public async stop(): Promise<void> {
    // do nothing
  }

  public setSecurity(
    metadata: SecurityScheme[],
    credentials?: unknown
  ): boolean {
    return false;
  }

  private deconstructPath(path: string) {
    // path can either be device/service/characteristic/operation or device/service/operation or device/operation
    let serviceId: BluetoothServiceUUID,
      characteristicId: BluetoothCharacteristicUUID,
      operation;
    const pathArray = path.split('/');
    if (pathArray.length === 3) {
      // path is device/service/characteristic?{parameter1, parameter2}
      [serviceId, characteristicId, operation] = pathArray;
      return {
        serviceId,
        characteristicId,
        operation,
      };
    } else {
      // path is invalid
      console.warn(`[binding-webBluetooth] invalid path ${path}`);
      throw new Error('href is not valid');
    }
  }

  private async read(
    deviceId: string,
    serviceId: BluetoothServiceUUID,
    characteristicId: BluetoothCharacteristicUUID,
    operation = 'readText'
  ) {
    let property: string;
    let value = '';
    switch (operation) {
      case 'readText':
        console.debug(
          '[binding-webBluetooth]',
          `invoking readText with serviceId ${serviceId} characteristicId ${characteristicId}`
        );
        value = await readText(deviceId, serviceId, characteristicId);
        break;
      case 'readNumber':
        console.debug(
          '[binding-webBluetooth]',
          `invoking readNumber with serviceId ${serviceId} characteristicId ${characteristicId}`
        );
        value = (
          await readNumber(deviceId, serviceId, characteristicId)
        ).toString();
        break;
      case 'readHex':
        console.debug(
          '[binding-webBluetooth]',
          `invoking readHex with serviceId ${serviceId} characteristicId ${characteristicId}`
        );
        value = await readHex(deviceId, serviceId, characteristicId);
        break;
      case 'readEddystoneProperty':
        property = eddystoneProperties.get(characteristicId) || '';
        if (property) {
          console.debug(
            '[binding-webBluetooth]',
            `invoking readEddystoneProperty with property ${property}`
          );
          value = (await readEddystoneProperty(deviceId, property)).toString();
        }
        break;
      default: {
        throw new Error(
          `[binding-webBluetooth] unknown return format ${operation}`
        );
      }
    }
    const readable = convertToNodeReadable(value);
    return {
      type: 'text/plain',
      body: readable,
    };
  }

  private async write(
    deviceId: string,
    serviceId: BluetoothServiceUUID,
    characteristicId: BluetoothCharacteristicUUID,
    operation: string,
    content: Content
  ) {
    const value = await readableStreamToString(content.body);
    let property = '';

    switch (operation) {
      case 'writeWithResponse':
        console.debug(
          '[binding-webBluetooth]',
          `invoking writeWithResponse with value ${value}`
        );
        await writeWithResponse(deviceId, serviceId, characteristicId, value);
        break;
      case 'writeWithoutResponse':
        console.debug(
          '[binding-webBluetooth]',
          `invoking writeWithoutResponse with value ${value}`
        );
        await writeWithoutResponse(
          deviceId,
          serviceId,
          characteristicId,
          value
        );
        break;
      case 'writeEddystoneProperty':
        property = eddystoneProperties.get(characteristicId) || '';
        if (property) {
          console.debug(
            '[binding-webBluetooth]',
            `invoking writeEddystoneProperty on property ${property} with value ${value}`
          );
          await writeEddystoneProperty(deviceId, property, value);
        }
        break;
      default: {
        throw new Error(
          `[binding-webBluetooth] unknown operation ${operation}`
        );
      }
    }
  }

  private async subscribeToCharacteristic(
    form: WebBluetoothForm,
    next: (content: Content) => void,
    error?: (error: Error) => void,
    complete?: () => void
  ): Promise<Subscription> {
    const path = form.href.split('//')[1];
    const deviceId = form['wbt:id'];
    const deconstructedPath = this.deconstructPath(path);
    const {serviceId, characteristicId, operation} = deconstructedPath;

    if (operation !== 'subscribe') {
      throw new Error(
        `[binding-webBluetooth] operation ${operation} is not supported`
      );
    }

    console.debug(
      '[binding-webBluetooth]',
      `subscribing to characteristic with serviceId ${serviceId} characteristicId ${characteristicId}`
    );

    const handler = (event: Event) => {
      const value = (event.target as any).value as DataView;
      const array = new Uint8Array(value.buffer);
      // Convert value a DataView to ReadableStream
      const content = {
        type: form.contentType || 'text/plain',
        body: convertToNodeReadable(array),
      };
      next(content);
    };

    await subscribe(deviceId, serviceId, characteristicId, handler);

    return new Subscription(() => {
      unsubscribe(deviceId, serviceId, characteristicId, handler);
    });
  }

  private async watchAdvertisements(
    form: WebBluetoothForm,
    next: (content: Content) => void,
    error?: (error: Error) => void,
    complete?: () => void
  ): Promise<Subscription> {
    const deviceId = form['wbt:id'];
    const device = await getDeviceById(deviceId);
    const handler = (event: BluetoothAdvertisingEvent) => {
      // Convert event to Content
      const content = {
        type: form.contentType || 'text/plain',
        body: convertToNodeReadable(JSON.stringify(event)),
      };
      next(content);
    };
    device.addEventListener('advertisementreceived', handler);
    await device.watchAdvertisements();
    return new Subscription(() => {
      device.removeEventListener(
        'addvertisementreceived',
        handler as (evt: Event) => void
      );
    });
  }

  private async startLEScan(
    form: WebBluetoothForm,
    next: (content: Content) => void,
    error?: (error: Error) => void,
    complete?: () => void
  ): Promise<Subscription> {
    await startLEScan();
    return new Subscription(() => {
      stopLEScan();
    });
  }
}
