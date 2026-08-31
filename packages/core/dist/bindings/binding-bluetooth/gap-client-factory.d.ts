/**
 * @fileoverview Bluetooth GAP protocol binding
 */
import { ProtocolClientFactory, ProtocolClient, ContentSerdes } from '@node-wot/core';
import { BluetoothAdapter } from './BluetoothAdapter.js';
export default class GapClientFactory implements ProtocolClientFactory {
    readonly scheme: string;
    private readonly clients;
    contentSerdes: ContentSerdes;
    private adapter;
    constructor(adapter: BluetoothAdapter);
    getClient(): ProtocolClient;
    destroy(): boolean;
    init: () => boolean;
}
