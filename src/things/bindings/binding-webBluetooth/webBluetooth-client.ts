/**
 * @fileoverview WebBluetooth protocol binding for eclipse/thingweb.node-wot
 */

import {Content, ProtocolClient} from '@node-wot/core';
import {Readable} from 'stream';
import {Form, SecurityScheme} from '@node-wot/td-tools';
import {
  readHex,
  readNumber,
  readText,
  writeWithoutResponse,
  writeWithResponse,
} from '../../../blast_webBluetooth.js';
import {Subscription} from 'rxjs/Subscription';
import {WebBluetoothForm} from './webBluetooth.js';
import {decodeReadableStream} from '../binding-helpers.js';

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

  public invokeResource(form: Form, content: Content): Promise<Content> {
    throw new Error('not implemented');
  }

  public unlinkResource(form: Form): Promise<void> {
    throw new Error('not implemented');
  }

  public subscribeResource(
    form: Form,
    next: (content: Content) => void,
    error?: (error: Error) => void,
    complete?: () => void
  ): Promise<Subscription> {
    throw new Error('not implemented');
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
    const readable = new Readable();
    switch (operation) {
      case 'readText':
        readable.push(await readText(deviceId, serviceId, characteristicId));
        break;
      case 'readNumber':
        readable.push(await readNumber(deviceId, serviceId, characteristicId));
        break;
      case 'readHex':
        readable.push(await readHex(deviceId, serviceId, characteristicId));
        break;
      default: {
        throw new Error(
          `[binding-webBluetooth] unknown return format ${operation}`
        );
      }
    }
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
    const {value} = await decodeReadableStream(content.body);

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
      default: {
        throw new Error(
          `[binding-webBluetooth] unknown operation ${operation}`
        );
      }
    }
  }
}
