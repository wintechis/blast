import { readEddystoneProperty, setActiveSlot, writeEddystoneProperty } from "../../../blast_eddystone.js";
export class EddystoneThing {
    constructor(deviceWoT, webBluetoothId, tdDiretory) {
        this.thingModel = {
            "@context": ["https://www.w3.org/2019/wot/td/v1"],
            "@type": ["Thing"],
            id: "blast:bluetooth:iBKS105",
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
        this.deviceWoT = deviceWoT;
        this.webBluetoothId = webBluetoothId;
        if (tdDiretory)
            this.tdDirectory = tdDiretory;
    }
    async init() {
        // produce thing
        this.thing = await this.deviceWoT.produce(this.thingModel);
        this.td = this.thing.getThingDescription();
        this.initializeProperties();
        return this.thing;
    }
    ;
    initializeProperties() {
        const properties = this.td.properties;
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
    async setActiveSlot(slot) {
        if (this.slot !== slot) {
            await setActiveSlot(this.webBluetoothId, slot);
            this.slot = slot;
        }
    }
    async getActiveSlot() {
        if (!this.slot) {
            this.slot = this.getActiveSlot();
        }
        return this.slot;
    }
}
//# sourceMappingURL=EddyStoneThing.js.map