/**
 * @fileoverview Bluetooth GAP protocol binding for eclipse/thingweb.node-wot
 */
import { Content, ProtocolClient } from '@node-wot/core';
import { Subscription } from 'rxjs';
import { BluetoothForm } from './Bluetooth.js';
import { BluetoothAdapter } from './BluetoothAdapter.js';
import { Form } from 'wot-typescript-definitions';
export default class GapClient implements ProtocolClient {
    private bluetoothAdapter;
    private subscriptions;
    constructor(bluetoothAdapter: BluetoothAdapter);
    toString(): string;
    readResource(form: Form): Promise<Content>;
    writeResource(form: Form, content: Content): Promise<void>;
    invokeResource(form: Form, content?: Content): Promise<Content>;
    unlinkResource(form: Form): Promise<void>;
    subscribeResource(form: BluetoothForm, next: (content: Content) => void, _error?: (error: Error) => void): Promise<Subscription>;
    requestThingDescription(uri: string): Promise<Content>;
    start(): Promise<void>;
    stop(): Promise<void>;
    setSecurity(): boolean;
}
