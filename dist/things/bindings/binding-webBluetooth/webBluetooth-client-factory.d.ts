/**
 * WebBluetooth protocol binding
 */
import { ProtocolClientFactory, ProtocolClient } from '@node-wot/core';
export default class WebBluetoothClientFactory implements ProtocolClientFactory {
    readonly scheme: string;
    getClient(): ProtocolClient;
    init: () => boolean;
    destroy: () => boolean;
}
