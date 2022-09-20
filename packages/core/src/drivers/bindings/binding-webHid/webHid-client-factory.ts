/**
 * WebBluetooth protocol binding
 */
import {ProtocolClientFactory, ProtocolClient} from '@node-wot/core';
import WebHidClient from './webHid-client.js';

export default class WebBluetoothClientFactory
  implements ProtocolClientFactory
{
  public readonly scheme: string = 'hid';

  public getClient(): ProtocolClient {
    console.debug(
      '[binding-webHid]',
      `WebHidClientFactory creating client for ${this.scheme}`
    );
    return new WebHidClient();
  }

  public init = (): boolean => true;
  public destroy = (): boolean => true;
}
