/**
 * Hid protocol binding
 */
import { ProtocolClientFactory, ProtocolClient } from '@node-wot/core';
import { HidAdapter } from './HidAdapter.js';
export default class HidClientFactory implements ProtocolClientFactory {
    readonly scheme: string;
    private readonly clients;
    private adapter;
    constructor(adapter: HidAdapter);
    getClient(): ProtocolClient;
    destroy(): boolean;
    init: () => boolean;
}
