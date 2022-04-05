/**
 * @fileoverview WebBluetooth protocol binding for eclipse/thingweb.node-wot
 */

import {Content, ProtocolClient} from '@node-wot/core';
import {Form, SecurityScheme} from '@node-wot/td-tools';
import {Subscription} from 'rxjs/Subscription';
import {webHidForm} from './webHid.js';
import {getWebHidDevice} from './../../../blast_things.js';
import {decodeReadableStream} from './../binding-helpers.js';

export default class WebHidClient implements ProtocolClient {
  public toString(): string {
    return '[WebHidClient]';
  }
  public readResource(form: webHidForm): Promise<Content> {
    throw new Error('not implemented');
  }

  public writeResource(form: webHidForm, content: Content): Promise<void> {
    const method = form.href.split('//')[1];
    const deviceId = form['wHid:id'];
    switch (method) {
      case 'sendReport':
        return this.sendReport(deviceId, content);
      case 'sendFeatureReport':
        return this.sendFeatureReport(deviceId, content);
      default:
        throw new Error(`[binding-webHid] Invalid href: ${form.href}`);
    }
  }

  public invokeResource(form: Form, content: Content): Promise<Content> {
    throw new Error('not implemented');
  }

  public unlinkResource(form: Form): Promise<void> {
    throw new Error('not implemented');
  }

  public subscribeResource(
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

  private async sendReport(deviceId: string, content: Content): Promise<void> {
    const device = getWebHidDevice(deviceId);
    if (!device.opened) {
      await device.open();
    }
    const {reportId, report} = await decodeReadableStream(content.body);
    console.debug(
      `[binding-webHid] invoking sendReport, with reportId: ${reportId} and report: ${report}`
    );
    await device.sendReport(reportId, report);
  }

  private async sendFeatureReport(
    deviceId: string,
    content: Content
  ): Promise<void> {
    const device = getWebHidDevice(deviceId);
    if (!device.opened) {
      await device.open();
    }
    const {reportId, report} = await decodeReadableStream(content.body);
    const data = Int8Array.from(report);
    console.debug(
      `[binding-webHid] invoking sendFeatureReport, with reportId: ${reportId} and report: ${report}`
    );
    await device.sendFeatureReport(reportId, Int8Array.from(data));
  }
}
