/**
 * @fileoverview Hid bindings for eclipse/thingweb.node-wot
 */
import { Content, ProtocolClient } from '@node-wot/core';
import { HidForm } from './Hid.js';
import { Subscription } from 'rxjs';
import { HidAdapter } from './HidAdapter.js';
export default class HidClient implements ProtocolClient {
    hidAdapter: HidAdapter;
    subscriptions: Map<string, Subscription>;
    constructor(hidAdapter: HidAdapter);
    toString(): string;
    readResource(form: HidForm): Promise<Content>;
    writeResource(form: HidForm, content: Content): Promise<void>;
    invokeResource(form: HidForm, content: Content): Promise<Content>;
    unlinkResource(form: HidForm): Promise<void>;
    subscribeResource(form: HidForm, next: (content: Content) => void, error?: (error: Error) => void, complete?: () => void): Promise<Subscription>;
    start(): Promise<void>;
    stop(): Promise<void>;
    requestThingDescription(uri: string): Promise<Content>;
    setSecurity(): boolean;
}
