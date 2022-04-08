import * as WoT from 'wot-typescript-definitions';
export default class EddystoneDevice {
    thing: WoT.ConsumedThing | null;
    init(webBluetoothId: string): Promise<WoT.ConsumedThing>;
}
