/**
 * WebBluetooth protocol binding
 */
import {
  ProtocolClientFactory,
  ProtocolClient,
  ContentSerdes,
} from '@node-wot/core';
import WebBluetoothClient from './webBluetooth-client.js';
import {BinaryDataStreamCodec} from '../../../codecs/BinaryDataCodec.js';

export default class WebBluetoothClientFactory
  implements ProtocolClientFactory
{
  public readonly scheme: string = 'gatt';

  public contentSerdes: ContentSerdes = ContentSerdes.get();

  constructor() {
    this.contentSerdes.addCodec(new BinaryDataStreamCodec());
  }

  public getClient(): ProtocolClient {
    console.debug(
      '[binding-webBluetooth]',
      `WebBluetoothClientFactory creating client for ${this.scheme}`
    );
    return new WebBluetoothClient();
  }

  public init = (): boolean => true;
  public destroy = (): boolean => true;
}
