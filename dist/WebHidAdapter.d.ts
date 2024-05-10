/// <reference types="w3c-web-hid" />
import { HidAdapter } from '@blast/core';
export default class ConcreteHidAdapter implements HidAdapter {
    getDevice(id: string): Promise<HIDDevice>;
}
