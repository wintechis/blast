import { ExposedThing } from "@node-wot/core";
import * as WoT from "wot-typescript-definitions";
import {getActiveSlot, readEddystoneProperty, setActiveSlot, writeEddystoneProperty} from "../../../blast_eddystone.js";

export class EddystoneThing {
    public thing: ExposedThing;
    public deviceWoT: typeof WoT; 
    public td: WoT.ThingDescription;
    private webBluetoothId: string;
    private slot : number;

    public thingModel: WoT.ThingDescription = {
        "@context": ["https://www.w3.org/2019/wot/td/v1"],
        "@type": ["Thing"],
        id: "blast:bluetooth:iBKS105", // this should normally be an URI, need to figure out a how to properly identify tds
        title: "iBKS105",
        description: "Accent Systems iBKS105 iBeacon",
        securityDefinitions: {
            "nosec_sc": {
                "scheme": "nosec",
            },
        },
        security: "nosec_sc",
        properties: {
            advertisedTxPower: {
                title: "Advertised Tx Power",
                description: "The advertised TX power of the iBeacon",
                unit: "dBm",
                type: "integer",
                readOnly: false,
            },
            advertisedData: {
                title: "Advertised Data",
                description: "The advertised data of the eddystone device",
                unit: "",
                type: "string",
                readOnly: false,
            },
            advertisingInterval: {
                title: "Advertising Interval",
                description: "The advertising interval of the eddystone device",
                unit: "ms",
                type: "integer",
                readOnly: false,
            },
            lockState: {
                title: "Lock State",
                description: "The lock state of the eddystone device",
                unit: "",
                type: "string",
                readOnly: true,
            },
            "publicEcdhKey": {
                title: "Public ECDH Key",
                description: "The public ECDH key of the eddystone device",
                unit: "",
                type: "string",
                readOnly: true,
            },
            "radioTxPower": {
                title: "Radio Tx Power",
                description: "The radio TX power of the eddystone device",
                unit: "dBm",
                type: "integer",
                readOnly: false,
            },
        },
    };

    constructor(deviceWoT: typeof WoT, webBluetoothId: string) {
        this.deviceWoT = deviceWoT;
        this.webBluetoothId = webBluetoothId;
    }

    public async init(): Promise<void> {
        this.thing = (await this.deviceWoT.produce(this.thingModel) as unknown as ExposedThing);
        this.initializeProperties();
        this.td = this.thing.getThingDescription();
    }

    private initializeProperties(): void {
        const properties = this.thingModel.properties
        const propertyKeys = Object.keys(properties);
        for (const p of propertyKeys) {
            this.thing.setPropertyReadHandler(p, () => {
                    return readEddystoneProperty(this.webBluetoothId, p);
                });
            if (!properties[p].readOnly) {
                this.thing.setPropertyWriteHandler(p, (value) => {
                    return writeEddystoneProperty(this.webBluetoothId, p, value);
                });
            }
        }
    }

    public async setActiveSlot(slot: number): Promise<void> {
        if (this.slot !== slot) {
            await setActiveSlot(this.webBluetoothId, slot);
            this.slot = slot;
        }
    }

    public async getActiveSlot(): Promise<number> {
        if (!this.slot) {
            this.slot = getActiveSlot();
        }
        return this.slot;
    }

    public async writeProperty(property: string, value: any, slot: number): Promise<void> {
        if (!this.thing) {
            await this.init();
        }
        this.setActiveSlot(slot);
        return this.thing.writeProperty(property, value);
    }

    public async readProperty(property: string, slot: number): Promise<any> {
        if (!this.thing) {
            await this.init();
        }
        this.setActiveSlot(slot);
        return this.thing.readProperty(property);
    }
}