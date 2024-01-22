/**
 * @fileoverview Bluetooth GAP protocol binding
 */
import {
  ProtocolClientFactory,
  ProtocolClient,
  ContentSerdes,
  createLoggers,
} from '@node-wot/core';
import GapClient from './gap-client';
import {BluetoothAdapter} from './BluetoothAdapter';

const {debug} = createLoggers('binding-bluetooth', 'gap-client-factory');

export default class GapClientFactory implements ProtocolClientFactory {
  public readonly scheme: string = 'gap';
  private readonly clients: Set<ProtocolClient> = new Set();
  public contentSerdes: ContentSerdes = ContentSerdes.get();
  private adapter: BluetoothAdapter;

  constructor(adapter: BluetoothAdapter) {
    this.adapter = adapter;
  }

  public getClient(): ProtocolClient {
    debug(`Creating client for ${this.scheme}`);
    const client = new GapClient(this.adapter);
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
