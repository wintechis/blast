/**
 * WebBluetooth protocol binding
 */
import {
  ProtocolClientFactory,
  ProtocolClient,
  ContentSerdes,
} from '@node-wot/core';
import WebBluetoothClientNew from './webBluetooth-client.js';
import {BinaryDataStreamCodec} from '../../codecs/BinaryDataCodec.js';

export default class WebBluetoothClientFactoryNew
  implements ProtocolClientFactory
{
  public readonly scheme: string = 'ble-web+gatt';

  public contentSerdes: ContentSerdes = ContentSerdes.get();

  constructor() {
    this.contentSerdes.addCodec(new BinaryDataStreamCodec());
  }

  public getClient(): ProtocolClient {
    console.debug(
      '[binding-webBluetoothNew]',
      `WebBluetoothClientFactory creating client for ${this.scheme}`
    );
    return new WebBluetoothClientNew();
  }

  public init = (): boolean => true;
  public destroy = (): boolean => true;
}
