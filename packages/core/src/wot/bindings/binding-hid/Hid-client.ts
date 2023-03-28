/**
 * @fileoverview WebBluetooth protocol binding for eclipse/thingweb.node-wot
 */

import {
  Content,
  ProtocolClient,
  ProtocolHelpers,
  createLoggers,
} from '@node-wot/core';
import {Form, SecurityScheme} from '@node-wot/td-tools';
import {HidForm} from './Hid';
import {Subscription} from 'rxjs';
import {HidAdapter} from './HidAdapter';
import {Readable} from 'stream';

const {debug} = createLoggers('binding-bluetooth', 'bluetooth-client');

export default class WebBluetoothClient implements ProtocolClient {
  hidAdapter: HidAdapter;

  constructor(hidAdapter: HidAdapter) {
    debug('created client');
    this.hidAdapter = hidAdapter;
  }

  public toString(): string {
    return '[WebBluetoothClient]';
  }
  public async readResource(form: HidForm): Promise<Content> {
    const {operation} = this.deconstructForm(form.href);
    const id = form['hid:path'];
    if (id === undefined) {
      throw new Error('hid:path cannot be undefined');
    }
    if (operation !== 'getFeatureReport') {
      throw new Error(`Cannot read from ${form.href}`);
    }
    const device = await this.hidAdapter.getDevice(id);
    if (!device) {
      throw new Error(`Device ${id} not found`);
    }
    const reportId = form['hid:reportId'];
    const reportLength = form['hid:reportLength'];

    if (reportId === undefined) {
      throw new Error('Report ID cannot be undefined');
    }

    if (reportLength === undefined) {
      throw new Error('Report length cannot be undefined');
    }

    const data = await device.receiveFeatureReport(reportId);

    let buf;
    if (form['signed']) {
      buf = new Int8Array(data.buffer);
    } else {
      buf = new Uint8Array(data.buffer);
    }

    const body = Readable.from(buf);

    return {
      type: form.contentType || 'application/octet-stream',
      body,
      toBuffer: () => {
        return ProtocolHelpers.readStreamFully(body);
      },
    };
  }

  public async writeResource(form: HidForm, content: Content): Promise<void> {
    const {operation} = this.deconstructForm(form.href);
    const id = form['hid:path'];
    if (id === undefined) {
      throw new Error('hid:path cannot be undefined');
    }
    if (operation !== 'sendFeatureReport') {
      throw new Error(`Cannot write to ${form.href}`);
    }
    const device = await this.hidAdapter.getDevice(id);
    if (!device) {
      throw new Error(`Device ${id} not found`);
    }

    const buf = await content.toBuffer();

    let value;
    if (form['signed']) {
      value = new Int8Array(buf)[buf.length - 1];
    } else {
      value = new Uint8Array(buf)[buf.length - 1];
    }

    let data: number[] = [];
    if (form['hid:data'] !== undefined) {
      data = form['hid:data'];
      if (form['hid:valueIndex'] !== undefined) {
        data[form['hid:valueIndex']] = value;
      }
    }

    const reportId = form['hid:reportId'] || data[0];

    device.sendFeatureReport(reportId, Buffer.from(data));
  }

  public invokeResource(form: Form, content: Content): Promise<Content> {
    throw new Error('not implemented');
  }

  public unlinkResource(form: Form): Promise<void> {
    throw new Error('not implemented');
  }

  public async subscribeResource(
    form: Form,
    next: (content: Content) => void,
    error?: (error: Error) => void,
    complete?: () => void
  ): Promise<Subscription> {
    throw new Error('not implemented');
  }

  public async start(): Promise<void> {
    // do nothing
  }

  public async stop(): Promise<void> {
    // do nothing
  }

  public setSecurity(
    metadata: SecurityScheme[],
    credentials?: unknown
  ): boolean {
    return false;
  }

  private deconstructForm(href: string): {path: string; operation: string} {
    const path = href.split('/').slice(0, -1).join('/');
    const operation = href.split('/').pop() || '';
    return {path, operation};
  }
}
