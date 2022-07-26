/**
 * WebBluetooth protocol binding
 */
import {ProtocolClientFactory, ProtocolClient} from '@node-wot/core';
import WebBluetoothClient from './webBluetooth-client.js';

export default class WebBluetoothClientFactory
  implements ProtocolClientFactory
{
  public readonly scheme: string = 'gatt';

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
