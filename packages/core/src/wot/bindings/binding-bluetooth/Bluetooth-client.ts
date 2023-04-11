/**
 * @fileoverview WebBluetooth protocol binding for eclipse/thingweb.node-wot
 */

import {
  Content,
  ProtocolClient,
  ProtocolHelpers,
  createLoggers,
} from '@node-wot/core';
import {Subscription} from 'rxjs';
import {BluetoothForm} from './Bluetooth';
import {BluetoothAdapter} from './BluetoothAdapter';
import {Readable} from 'stream';

const {debug} = createLoggers('binding-bluetooth', 'bluetooth-client');

export default class WebBluetoothClient implements ProtocolClient {
  bluetoothAdapter: BluetoothAdapter;
  subscriptions: Subscription[];

  constructor(bluetoothAdapter: BluetoothAdapter) {
    debug('created client');
    this.bluetoothAdapter = bluetoothAdapter;
    this.subscriptions = [];
  }

  public toString(): string {
    return '[WebBluetoothClient]';
  }
  public async readResource(form: BluetoothForm): Promise<Content> {
    const deconstructedForm = this.deconstructForm(form);

    const characteristic = await this.bluetoothAdapter.getCharacteristic(
      deconstructedForm.deviceId,
      deconstructedForm.serviceId,
      deconstructedForm.characteristicId
    );

    debug(
      `invoking "readValue" on characteristic ${deconstructedForm.characteristicId}`
    );

    const value = await characteristic.readValue();

    let buff;
    if (form['bdo:signed']) {
      buff = new Int8Array(value.buffer);
    } else {
      buff = new Uint8Array(value.buffer);
    }
    // Convert to readable
    const body = Readable.from(buff);

    return {
      type: form.contentType || 'application/x.binary-data-stream',
      body: body,
      toBuffer: () => {
        return ProtocolHelpers.readStreamFully(body);
      },
    };
  }

  public async writeResource(
    form: BluetoothForm,
    content: Content
  ): Promise<void> {
    // Extract information out of form
    const deconstructedForm = this.deconstructForm(form);
    let arrBuffer;
    //Convert readableStreamToBuffer
    if (typeof content !== 'undefined') {
      const buffer = await content.toBuffer();
      arrBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      );
    } else {
      // If content not defined write buffer < 00 >
      arrBuffer = new ArrayBuffer(1);
    }

    const characteristic = await this.bluetoothAdapter.getCharacteristic(
      deconstructedForm.deviceId,
      deconstructedForm.serviceId,
      deconstructedForm.characteristicId
    );

    // Select what operation should be executed
    switch (deconstructedForm.bleOperation) {
      case 'sbo:write-without-response':
        debug(
          `invoking "writeValueWithoutResponse" on characteristic ${deconstructedForm.characteristicId}`
        );
        await characteristic.writeValueWithoutResponse(arrBuffer);
        break;

      case 'sbo:write':
        debug(
          `invoking "writeValueWithResponse" on characteristic ${deconstructedForm.characteristicId}`
        );
        await characteristic.writeValueWithResponse(arrBuffer);
        break;

      default: {
        throw new Error(
          `unknown operation ${deconstructedForm['sbo:methodName']}`
        );
      }
    }
  }

  public invokeResource(
    form: BluetoothForm,
    content: Content
  ): Promise<Content> {
    // TODO check if href is service/char/operation, then write,
    // might also be gatt://operation, i.e watchAdvertisements
    return this.writeResource(form, content).then(() => {
      return {
        type: 'text/plain',
        body: Readable.from(''),
        toBuffer: () => Promise.resolve(Buffer.from('')),
      };
    });
  }

  public unlinkResource(): Promise<void> {
    throw new Error('not implemented');
  }

  public async subscribeResource(
    form: BluetoothForm,
    next: (content: Content) => void,
    error?: (error: Error) => void
  ): Promise<Subscription> {
    // Extract information out of form
    const {deviceId, serviceId, characteristicId, bleOperation} =
      this.deconstructForm(form);

    if (bleOperation !== 'subscribe') {
      throw new Error(`operation ${bleOperation} is not supported`);
    }

    debug(
      `subscribing to characteristic with serviceId ${serviceId} characteristicId ${characteristicId}`
    );

    const handler = (event: Event) => {
      debug(`Received "characteristicvaluechanged" event: ${event}`);
      const value = (event.target as BluetoothRemoteGATTCharacteristic)
        .value as DataView;
      let buff;
      if (form['bdo:signed']) {
        buff = new Int8Array(value.buffer);
      } else {
        buff = new Uint8Array(value.buffer);
      }
      // Convert to readable
      const body = Readable.from(buff);

      const content = new Content(
        form.contentType || 'application/x.binary-data-stream',
        body
      );
      next(content);
    };

    const characteristic = await this.bluetoothAdapter.getCharacteristic(
      deviceId,
      serviceId,
      characteristicId
    );

    try {
      characteristic.addEventListener('characteristicvaluechanged', handler);

      await characteristic.startNotifications();

      const subscription = new Subscription(() => {
        characteristic.removeEventListener(
          'characteristicvaluechanged',
          handler
        );
        characteristic.stopNotifications();
        characteristic.removeEventListener(
          'characteristicvaluechanged',
          handler
        );
      });
      this.subscriptions.push(subscription);
      return subscription;
    } catch (err) {
      if (error) {
        error(err as Error);
      }
      throw new Error(`failed to subscribe to characteristic ${err}`);
    }
  }

  public async start(): Promise<void> {
    // do nothing
  }

  public async stop(): Promise<void> {
    debug('Stopping client');
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public setSecurity(): boolean {
    return false;
  }

  /**
   * Deconsructs form in object
   * @param {Form} form form to analyze
   * @returns {Object} Object containing all parameters
   */
  deconstructForm = function (form: BluetoothForm) {
    const deconstructedForm: Record<string, string> = {};

    // Remove gatt://
    deconstructedForm.path = form.href.split('//')[1];

    // If deviceID contains '/' it gets also split.
    // path string is check if it is a UUID; everything else is added together to deviceID
    const pathElements = deconstructedForm.path.split('/');

    if (pathElements.length !== 3) {
      const regex = new RegExp(
        '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      );

      let deviceId = pathElements[0];

      for (let i = 1; i < pathElements.length; i++) {
        if (regex.test(pathElements[i]) === false) {
          deviceId = deviceId + '/' + pathElements[i];
        } else {
          // second last element is service id
          if (i === pathElements.length - 2) {
            deconstructedForm.serviceId = pathElements[i];
          }
          // Last element is characteristic
          if (i === pathElements.length - 1) {
            deconstructedForm.characteristicId = pathElements[i];
          }
        }
      }
      // DeviceId
      deconstructedForm.deviceId = deviceId;
    } else {
      // DeviceId
      deconstructedForm.deviceId = pathElements[0];

      // Extract serviceId
      deconstructedForm.serviceId = pathElements[1];

      // Extract characteristicId
      deconstructedForm.characteristicId = pathElements[2];
    }

    // Extract operation -> e.g. readproperty; writeproperty
    deconstructedForm.operation = form.op?.toString() || '';

    // Get BLE operation type
    deconstructedForm.bleOperation = form['sbo:methodName'];

    return deconstructedForm;
  };
}
