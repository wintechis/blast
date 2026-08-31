/**
 * @fileoverview Bluetooth GATT protocol binding for eclipse/thingweb.node-wot
 */
import { Content, ProtocolClient } from '@node-wot/core';
import { Subscription } from 'rxjs';
import { BluetoothForm } from './Bluetooth.js';
import { BluetoothAdapter } from './BluetoothAdapter.js';
export default class GattClient implements ProtocolClient {
    private bluetoothAdapter;
    private subscriptions;
    constructor(bluetoothAdapter: BluetoothAdapter);
    toString(): string;
    readResource(form: BluetoothForm): Promise<Content>;
    writeResource(form: BluetoothForm, content: Content): Promise<void>;
    invokeResource(form: BluetoothForm, content: Content): Promise<Content>;
    unlinkResource(form: BluetoothForm): Promise<void>;
    subscribeResource(form: BluetoothForm, next: (content: Content) => void, _error?: (error: Error) => void): Promise<Subscription>;
    start(): Promise<void>;
    stop(): Promise<void>;
    setSecurity(): boolean;
    requestThingDescription(uri: string): Promise<Content>;
    /**
     * Deconsructs form in object
     * @param {Form} form form to analyze
     * @returns {Object} Object containing all parameters
     */
    deconstructForm: (form: BluetoothForm) => Record<string, string>;
}
