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
  public contentSerdes: ContentSerdes = ContentSerdes.get();
  adapter: BluetoothAdapter;

  constructor(adapter: BluetoothAdapter) {
    this.contentSerdes.addCodec(new BinaryDataStreamCodec());
    this.adapter = adapter;
  }

  public getClient(): ProtocolClient {
    debug(`Creating client for ${this.scheme}`);
    return new BluetoothClient(this.adapter);
  }

  public init = (): boolean => true;
  public destroy = (): boolean => true;
}
