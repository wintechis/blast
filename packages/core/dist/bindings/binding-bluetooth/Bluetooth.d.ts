import { Form } from '@node-wot/core';
export { default as BluetoothClient } from './gatt-client.js';
export { default as GattClientFactory } from './gatt-client-factory.js';
export { default as GapClientFactory } from './gap-client-factory.js';
export declare class BluetoothForm extends Form {
    'wbt:id'?: string;
    'sbo:methodName': string;
}
