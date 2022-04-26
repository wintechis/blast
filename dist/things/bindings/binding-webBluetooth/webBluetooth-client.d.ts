/**
 * @fileoverview WebBluetooth protocol binding for eclipse/thingweb.node-wot
 */
import { Content, ProtocolClient } from '@node-wot/core';
import { Form, SecurityScheme } from '@node-wot/td-tools';
import { WebBluetoothForm } from './webBluetooth.js';
import { Subscription } from 'rxjs/Subscription';
export default class WebBluetoothClient implements ProtocolClient {
    toString(): string;
    readResource(form: WebBluetoothForm): Promise<Content>;
    writeResource(form: WebBluetoothForm, content: Content): Promise<void>;
    invokeResource(form: WebBluetoothForm, content: Content): Promise<Content>;
    unlinkResource(form: Form): Promise<void>;
    subscribeResource(form: WebBluetoothForm, next: (content: Content) => void, error?: (error: Error) => void, complete?: () => void): Promise<Subscription>;
    start(): Promise<void>;
    stop(): Promise<void>;
    setSecurity(metadata: SecurityScheme[], credentials?: unknown): boolean;
    private deconstructPath;
    private read;
    private write;
}
