/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @fileoverview Hid bindings for eclipse/thingweb.node-wot
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

const {debug} = createLoggers('binding-hid', 'hid-client');

export default class HidClient implements ProtocolClient {
  hidAdapter: HidAdapter;
  subscriptions: Subscription[];

  constructor(hidAdapter: HidAdapter) {
    debug('created client');
    this.hidAdapter = hidAdapter;
    this.subscriptions = [];
  }

  public toString(): string {
    return '[Hid Client]';
  }
  public async readResource(form: HidForm): Promise<Content> {
    const id = form['hid:path'];
    if (id === undefined) {
      throw new Error('hid:path cannot be undefined');
    }
    const device = await this.hidAdapter.getDevice(id);
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
    const id = form['hid:path'];
    if (id === undefined) {
      throw new Error('hid:path cannot be undefined');
    }
    const device = await this.hidAdapter.getDevice(id);
    const methodName = form.href.split('://')[1].split('/')[0];
    const buf = await content.toBuffer();

    let data;
    if (form['hid:data'] !== undefined) {
      data = form['hid:data'];
      let value: number;
      if (form['signed']) {
        value = new Int8Array(buf)[buf.length - 1];
      } else {
        value = new Uint8Array(buf)[buf.length - 1];
      }
      if (form['hid:valueIndex'] !== undefined) {
        data[form['hid:valueIndex']] = value;
      }
    } else {
      data = new Uint8Array(buf);
    }

    const reportId = form['hid:reportId'] || data[0];
    data = Buffer.from(data);

    if (methodName === 'sendFeatureReport') {
      debug(`Sending feature report: ${reportId} ${data}`);
      await device.sendFeatureReport(reportId, data);
    } else if (methodName === 'sendReport') {
      debug(`Sending report: ${reportId} ${data}`);
      await device.sendReport(reportId, Buffer.from(data.subarray(1)));
    } else {
      throw new Error(`Method ${methodName} is not supported`);
    }
  }

  public async invokeResource(
    form: HidForm,
    content: Content
  ): Promise<Content> {
    await this.writeResource(form, content);
    return new Promise((resolve, reject) => {
      resolve(
        new Content(
          form.contentType || 'application/octet-stream',
          Readable.from([])
        )
      );
    });
  }

  public unlinkResource(form: Form): Promise<void> {
    throw new Error('not implemented');
  }

  public async subscribeResource(
    form: HidForm,
    next: (content: Content) => void,
    error?: (error: Error) => void,
    complete?: () => void
  ): Promise<Subscription> {
    const id = form['hid:path'];
    if (id === undefined) {
      throw new Error('hid:path cannot be undefined');
    }
    const device = await this.hidAdapter.getDevice(id);
    if (!device) {
      throw new Error(`Device ${id} not found`);
    }

    debug(`Subscribing to device:  ${id}`);

    const handler = (event: HIDInputReportEvent) => {
      debug(
        `Received "inputreport" event with report id: ${event.reportId} and data: ${event.data.buffer}`
      );
      let buff;
      if (form['signed']) {
        buff = new Int8Array(event.data.buffer);
      } else {
        buff = new Uint8Array(event.data.buffer);
      }
      const body = Readable.from(buff);

      const content = new Content(
        form.contentType || 'application/x.binary-data-stream',
        body
      );
      next(content);
    };

    device.addEventListener('inputreport', handler);

    const subscription = new Subscription(() => {
      debug("Removing 'inputreport' listener from device: ${id}");
      device.removeEventListener('inputreport', handler);
    });
    this.subscriptions.push(subscription);
    return subscription;
  }

  public async start(): Promise<void> {
    // do nothing
  }

  public async stop(): Promise<void> {
    debug('Stopping client');
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public setSecurity(
    metadata: SecurityScheme[],
    credentials?: unknown
  ): boolean {
    return false;
  }
}
