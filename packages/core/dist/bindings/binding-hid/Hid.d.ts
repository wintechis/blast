import { Form } from '@node-wot/core';
export { default as HidClient } from './Hid-client.js';
export { default as HidClientFactory } from './Hid-client-factory.js';
export declare class HidForm extends Form {
    'hid:path': string;
    'hid:reportId'?: number;
    'hid:reportLength'?: number;
    'hid:data'?: number[];
    'hid:valueIndex'?: number;
}
