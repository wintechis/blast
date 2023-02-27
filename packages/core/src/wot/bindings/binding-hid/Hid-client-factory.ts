/**
 * Hid protocol binding
 */
import {
  ProtocolClientFactory,
  ProtocolClient,
  ContentSerdes,
  createLoggers,
} from '@node-wot/core';
import HidClient from './Hid-client';
import {HidAdapter} from './HidAdapter';

const {debug} = createLoggers('binding-hid', 'hid-client-factory');

export default class HidClientFactory implements ProtocolClientFactory {
  public readonly scheme: string = 'hid';
  public contentSerdes: ContentSerdes = ContentSerdes.get();
  adapter: HidAdapter;

  constructor(adapter: HidAdapter) {
    this.adapter = adapter;
  }

  public getClient(): ProtocolClient {
    debug(`Creating client for ${this.scheme}`);
    return new HidClient(this.adapter);
  }

  public init = (): boolean => true;
  public destroy = (): boolean => true;
}
