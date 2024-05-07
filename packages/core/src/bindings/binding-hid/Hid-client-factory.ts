/**
 * Hid protocol binding
 */
import {
  ProtocolClientFactory,
  ProtocolClient,
  createLoggers,
} from '@node-wot/core';
import HidClient from './Hid-client.js';
import {HidAdapter} from './HidAdapter.js';

const {debug} = createLoggers('binding-hid', 'hid-client-factory');

export default class HidClientFactory implements ProtocolClientFactory {
  public readonly scheme: string = 'hid';
  private readonly clients: Set<ProtocolClient> = new Set();
  private adapter: HidAdapter;

  constructor(adapter: HidAdapter) {
    this.adapter = adapter;
  }

  public getClient(): ProtocolClient {
    debug(`Creating client for ${this.scheme}`);
    const client = new HidClient(this.adapter);
    this.clients.add(client);
    return client;
  }

  public destroy(): boolean {
    debug(`stopping all clients for '${this.scheme}'`);
    this.clients.forEach(client => client.stop());
    return true;
  }

  public init = (): boolean => true;
}
