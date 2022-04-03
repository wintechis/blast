import * as WoT from 'wot-typescript-definitions';
export default class XiamoiThermometer {
    private thing;
    private exposedThing;
    private webBluetoothId;
    private td;
    private temperature;
    private humidity;
    private subscribed;
    private xiaomiServiceUUID;
    private dataCharacteristicUUID;
    thingModel: WoT.ThingDescription;
    constructor(webBluetoothId: string);
    private addPropertyHandlers;
    private getTemperature;
    private getHumidity;
    private subscribeToSensorData;
    destroy(): void;
    readProperty(property: string): Promise<any>;
    getThingDescription(): Promise<WoT.ThingDescription>;
}
