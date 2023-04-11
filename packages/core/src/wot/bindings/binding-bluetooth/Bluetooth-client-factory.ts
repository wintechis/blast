/**
 * WebBluetooth protocol binding
 */
import {
  ProtocolClientFactory,
  ProtocolClient,
  ContentSerdes,
  createLoggers,
} from '@node-wot/core';
import BluetoothClient from './Bluetooth-client';
import {BinaryDataStreamCodec} from '../../codecs/BinaryDataCodec';
import {BluetoothAdapter} from './BluetoothAdapter';

const {debug} = createLoggers('binding-bluetooth', 'bluetooth-client-factory');

export default class BluetoothClientFactory implements ProtocolClientFactory {
  public readonly scheme: string = 'gatt';
  private readonly clients: Set<ProtocolClient> = new Set();
  public contentSerdes: ContentSerdes = ContentSerdes.get();
  adapter: BluetoothAdapter;

  constructor(adapter: BluetoothAdapter) {
    this.contentSerdes.addCodec(new BinaryDataStreamCodec());
    this.adapter = adapter;
  }

  public getClient(): ProtocolClient {
    debug(`Creating client for ${this.scheme}`);
    const client = new BluetoothClient(this.adapter);
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
