import { readEddystoneProperty, writeEddystoneProperty } from "../../../blast_eddystone.js";
/**
 * List of Eddystone readable properties,
 * names have to match cases in {@link readEddystoneProperty}
 */
const readableProperties = [
    "advertisedTxPower",
    "advertisementData",
    "advertisingInterval",
    "lockState",
    "publicEcdhKey",
    "radioTxPower",
];
/** List of Eddystsone writable proprteis,
 *  names have to match cases in {@link writeEddystoneProperty}
 */
const writableProperties = [
    "advertisedTxPower",
    "advertisementData",
    "advertisingInterval",
    "radioTxPower",
];
/**
 * Sets all propertyHandlers to use the BLAST Web Bluetooth library.
 */
export function setWebBluetoothHandlers(thing) {
    for (const property of readableProperties) {
        thing.setPropertyReadHandler(property, () => {
            return readEddystoneProperty(thing.id, property);
        });
    }
    for (const property of writableProperties) {
        thing.setPropertyWriteHandler(property, (value) => {
            return writeEddystoneProperty(thing.id, property, value);
        });
    }
}
;
//# sourceMappingURL=index.js.map