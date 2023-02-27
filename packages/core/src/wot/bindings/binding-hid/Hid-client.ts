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
import HID from 'node-hid';

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
    const {path, operation} = this.deconstructForm(form.href);
    if (operation !== 'getFeatureReport') {
      throw new Error(`Cannot read from ${form.href}`);
    }
    const devices = await this.hidAdapter.getDevices();
    const device = devices.find(device => device.path === path);
    if (!device || !device.path) {
      throw new Error(`Device ${path} not found`);
    }
    const reportId = form['hid:reportId'];
    const reportLength = form['hid:reportLength'];

    if (reportId === undefined) {
      throw new Error('Report ID cannot be undefined');
    }

    if (reportLength === undefined) {
      throw new Error('Report length cannot be undefined');
    }

    const hid = new HID.HID(device.path);
    const data = await hid.getFeatureReport(reportId, reportLength);
    const body = Readable.from(data);

    return {
      type: form.contentType || 'application/octet-stream',
      body,
      toBuffer: () => {
        return ProtocolHelpers.readStreamFully(body);
      },
    };
  }

  public async writeResource(form: HidForm, content: Content): Promise<void> {
    const {path, operation} = this.deconstructForm(form.href);
    if (operation !== 'setFeatureReport') {
      throw new Error(`Cannot write to ${form.href}`);
    }
    const devices = await this.hidAdapter.getDevices();
    const device = devices.find(device => device.path === path);
    if (!device || !device.path) {
      throw new Error(`Device ${path} not found`);
    }
    const hid = new HID.HID(device.path);
    const buf = await ProtocolHelpers.readStreamFully(content.body);
    // convert buffer to number
    const value = buf.readUInt8(0);
    let data: number[] = [];
    if (form['hid:data'] !== undefined) {
      data = form['hid:data'];
      if (form['hid:valueIndex'] !== undefined) {
        data[form['hid:valueIndex']] = value;
      }
    }
    hid.sendFeatureReport(data);
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
