import { Content, ProtocolClient } from '@node-wot/core';
import { Form, SecurityScheme } from '@node-wot/td-tools';
import { Subscription } from 'rxjs/Subscription';
import { WebBluetoothForm } from './webBluetooth.js';
/**
 * @fileoverview WebBluetooth protocol binding for ecluse/thingweb.node-wot
 */
export default class WebBluetoothClient implements ProtocolClient {
    toString(): string;
    readResource(form: WebBluetoothForm): Promise<Content>;
    writeResource(form: WebBluetoothForm, content: Content): Promise<void>;
    invokeResource(form: Form, content: Content): Promise<Content>;
    unlinkResource(form: Form): Promise<void>;
    subscribeResource(form: Form, next: (content: Content) => void, error?: (error: Error) => void, complete?: () => void): Promise<Subscription>;
    start(): Promise<void>;
    stop(): Promise<void>;
    setSecurity(metadata: SecurityScheme[], credentials?: unknown): boolean;
    private deconstructPath;
    private read;
    private write;
    private deconstructContent;
}
