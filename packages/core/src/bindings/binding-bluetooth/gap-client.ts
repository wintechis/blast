/**
 * @fileoverview Bluetooth GAP protocol binding for eclipse/thingweb.node-wot
 */

import {
  Content,
  ProtocolClient,
  ProtocolHelpers,
  createLoggers,
} from '@node-wot/core';
import {Subscription} from 'rxjs';
import {BluetoothForm} from './Bluetooth.js';
import {BluetoothAdapter} from './BluetoothAdapter.js';
import {Readable} from 'stream';
import {Form} from 'wot-typescript-definitions';

const {debug} = createLoggers('binding-bluetooth', 'gap-client');

export default class GapClient implements ProtocolClient {
  private bluetoothAdapter: BluetoothAdapter;
  private subscriptions: Map<string, Subscription>;

  constructor(bluetoothAdapter: BluetoothAdapter) {
    debug('created client');
    this.bluetoothAdapter = bluetoothAdapter;
    this.subscriptions = new Map();
  }

  public toString(): string {
    return '[GapClient]';
  }

  public async readResource(form: Form): Promise<Content> {
    throw new Error('Method not implemented.');
  }

  public async writeResource(form: Form, content: Content): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async invokeResource(form: Form, content?: Content): Promise<Content> {
    throw new Error('Method not implemented.');
  }

  public async unlinkResource(form: Form): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public subscribeResource(
    form: BluetoothForm,
    next: (content: Content) => void,
    _error?: (error: Error) => void
  ): Promise<Subscription> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = async (event: any) => {
      debug(`Received GAP broadcast: ${event.target.manufacturerData[0].data}`);
      const value = event.target.manufacturerData[0].data as Buffer;
      next({
        type: form.contentType ?? 'application/x.binary-data-stream',
        body: Readable.from(value),
        toBuffer: () => {
          return ProtocolHelpers.readStreamFully(Readable.from(value));
        },
      });
    };

    const deviceId = form.href.split('/')[2];

    this.bluetoothAdapter.observeGAP(deviceId, handler);

    return Promise.resolve(new Subscription());
  }

  public async requestThingDescription(uri: string): Promise<Content> {
    throw new Error('BluetoothClient does not implement TD retrieval');
  }

  public async start(): Promise<void> {
    // do nothing
  }

  public async stop(): Promise<void> {
    debug('Stopping client');
    for (const subscription of this.subscriptions.values()) {
      subscription.unsubscribe();
    }
    this.subscriptions.clear();
  }

  public setSecurity(): boolean {
    return false;
  }
}
