/**
 * @fileoverview WebBluetooth protocol binding for eclipse/thingweb.node-wot
 */

import {Content, ProtocolClient} from '@node-wot/core';
import {Form, SecurityScheme} from '@node-wot/td-tools';
import {Subscription} from 'rxjs';
import {
  getDeviceById,
  startLEScan,
  stopLEScan,
  subscribe,
  unsubscribe,
  getCharacteristic,
} from '../../../webBluetooth.js';
import {WebBluetoothForm} from './webBluetooth.js';
import {
  convertToNodeReadable,
  readableStreamToBuffer,
} from '../binding-helpers.js';
import {throwError} from '../../../blast_interpreter.js';
import {getThingsLog} from '../../../blast_things.js';

export default class WebBluetoothClientNew implements ProtocolClient {
  public toString(): string {
    return '[WebBluetoothClientNew]';
  }
  public async readResource(form: WebBluetoothForm): Promise<Content> {
    const deconstructedForm = this.deconstructForm(form);
    let value: any;

    const characteristic = await getCharacteristic(
      deconstructedForm.deviceId,
      deconstructedForm.serviceId,
      deconstructedForm.characteristicId
    );

    try {
      const thingsLog = getThingsLog();
      thingsLog(
        `Invoke <code>ReadValue</code> on characteristic <code>${deconstructedForm.characteristicId}</code>` +
          ` from service <code>${deconstructedForm.serviceId}</code>`,
        'Bluetooth',
        deconstructedForm.deviceId
      );
      value = await characteristic.readValue();
      thingsLog(
        `Finished <code>ReadValue</code> on characteristic <code>${deconstructedForm.characteristicId}</code>` +
          ` from service <code>${
            deconstructedForm.serviceId
          }</code> - value: <code>${value.toString()}</code>`,
        'Bluetooth',
        deconstructedForm.deviceId
      );
    } catch (error) {
      console.error(error);
      throwError(
        `Error reading from Bluetooth device ${deconstructedForm.deviceId}`
      );
    }

    const buff = new Uint8Array(value.buffer);
    // Convert to readable
    const body = convertToNodeReadable(buff);

    // Return
    return {
      type: form.contentType || 'application/x.binary-data-stream',
      body: body,
    };
  }

  public async writeResource(
    form: WebBluetoothForm,
    content: Content
  ): Promise<void> {
    // Extract information out of form
    const deconstructedForm = this.deconstructForm(form);

    let buffer;
    //Convert readableStreamToBuffer
    if (typeof content != 'undefined') {
      buffer = await readableStreamToBuffer(content.body);
    } else {
      // If content not definied write buffer < 00 >
      buffer = Buffer.alloc(1);
    }

    const characteristic = await getCharacteristic(
      deconstructedForm.deviceId,
      deconstructedForm.serviceId,
      deconstructedForm.characteristicId
    );

    // Select what operation should be executed
    switch (deconstructedForm.bleOperation) {
      case 'sbo:write-without-response':
        try {
          const thingsLog = getThingsLog();
          thingsLog(
            'Invoke <code>WriteValueWithoutResponse</code> on characteristic ' +
              `<code>${
                deconstructedForm.characteristicId
              }</code> with value <code>${buffer.toString()}</code>`,
            'Bluetooth',
            deconstructedForm.deviceId
          );
          await characteristic.writeValueWithoutResponse(buffer);
          thingsLog(
            'Finished <code>WriteValueWithoutResponse</code> on characteristic ' +
              `<code>${
                deconstructedForm.characteristicId
              }</code> with value <code>${buffer.toString()}</code>`,
            'Bluetooth',
            deconstructedForm.deviceId
          );
        } catch (error) {
          const errorMsg =
            'Error writing to Bluetooth device.\nMake sure the device is compatible with the connected block.';
          console.error(error);
          throwError(errorMsg);
        }
        break;

      case 'sbo:write':
        try {
          const thingsLog = getThingsLog();
          thingsLog(
            'Invoke <code>WriteValueWithResponse</code> on characteristic ' +
              `<code>${
                deconstructedForm.characteristicId
              }</code> with value <code>${buffer.toString()}</code>`,
            'Bluetooth',
            deconstructedForm.deviceId
          );
          await characteristic.writeValueWithResponse(buffer);
          thingsLog(
            'Finished <code>WriteValueWithResponse</code> on characteristic ' +
              `<code>${
                deconstructedForm.characteristicId
              }</code> with value <code>${buffer.toString()}</code>`,
            'Bluetooth',
            deconstructedForm.deviceId
          );
        } catch (error) {
          const errorMsg =
            'Error writing to Bluetooth device.\nMake sure the device is compatible with the connected block.';
          console.error(error);
          throwError(errorMsg);
        }
        break;

      default: {
        throw new Error(
          `[binding-Bluetooth] unknown operation ${deconstructedForm.operation}`
        );
      }
    }
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

  /**
   * Deconsructs form in object
   * @param {Form} form form to analyze
   * @returns {Object} Object containing all parameters
   */
  deconstructForm = function (form: WebBluetoothForm) {
    const deconstructedForm: Record<string, any> = {};

    // Remove gatt://
    deconstructedForm.path = form.href.split('//')[1];

    // If deviceID contains '/' it gets also split.
    // path string is check if it is a UUID; everything else is added together to deviceID
    let pathElements = deconstructedForm.path.split('/');

    let deviceId;
    let characteristicId;
    let serviceId;

    if (pathElements.length != 3) {
      const regex = new RegExp(
        '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      );

      deviceId = pathElements[0];
      for (let i = 1; i < pathElements.length; i++) {
        if (regex.test(pathElements[i]) == false) {
          deviceId = deviceId + '/' + pathElements[i];
        } else {
          // second last element is service id
          if (i == pathElements.length - 2) {
            serviceId = pathElements[i];
          }
          // Last element is characteristic
          if (i == pathElements.length - 1) {
            characteristicId = pathElements[i];
          }
        }
      }
    }

    // DeviceId
    deconstructedForm.deviceId = deviceId;

    // Extract serviceId
    deconstructedForm.serviceId = serviceId;

    // Extract characteristicId
    deconstructedForm.characteristicId = characteristicId;

    // Extract operation -> e.g. readproperty; writeproperty
    deconstructedForm.operation = form.op;

    // Get BLE operation type
    deconstructedForm.bleOperation = form['sbo:methodName'];

    return deconstructedForm;
  };

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
