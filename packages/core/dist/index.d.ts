import * as WoT from 'wot-typescript-definitions';
import { Servient } from '@node-wot/core';
import { BluetoothAdapter } from './bindings/binding-bluetooth/BluetoothAdapter.js';
export { BluetoothAdapter } from './bindings/binding-bluetooth/BluetoothAdapter.js';
import { HidAdapter } from './bindings/binding-hid/HidAdapter.js';
export { HidAdapter } from './bindings/binding-hid/HidAdapter.js';
export { EddystoneHelpers } from './bindings/binding-bluetooth/EddystoneHelpers.js';
export declare class Blast {
    private servient;
    private wot;
    constructor(ConcreteBluetoothAdapter?: new () => BluetoothAdapter | undefined, ConcreteHidAdapter?: new () => HidAdapter | undefined);
    getServient(): Promise<Servient>;
    getWot(): Promise<typeof WoT>;
    resetServient(): Promise<void>;
    createExposedThing(td: WoT.ThingDescription, id: string | undefined): Promise<WoT.ExposedThing>;
    createThing(td: WoT.ThingDescription, id: string | undefined): Promise<WoT.ConsumedThing>;
    createThingWithHandlers(td: WoT.ThingDescription, id: string | undefined, addHandlers: (thing: WoT.ExposedThing) => void): Promise<WoT.ConsumedThing>;
}
export default Blast;
