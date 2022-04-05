/**
 * @fileoverview WebBluetooth protocol binding for eclipse/thingweb.node-wot
 */
import { Content, ProtocolClient } from '@node-wot/core';
import { Form, SecurityScheme } from '@node-wot/td-tools';
import { Subscription } from 'rxjs/Subscription';
import { webHidForm } from './webHid.js';
export default class WebHidClient implements ProtocolClient {
    toString(): string;
    readResource(form: webHidForm): Promise<Content>;
    writeResource(form: webHidForm, content: Content): Promise<void>;
    invokeResource(form: Form, content: Content): Promise<Content>;
    unlinkResource(form: Form): Promise<void>;
    subscribeResource(form: Form, next: (content: Content) => void, error?: (error: Error) => void, complete?: () => void): Promise<Subscription>;
    start(): Promise<void>;
    stop(): Promise<void>;
    setSecurity(metadata: SecurityScheme[], credentials?: unknown): boolean;
    private sendReport;
    private sendFeatureReport;
}
