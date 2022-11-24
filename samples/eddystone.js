import {createThing, EddystoneHelpers} from '../packages/core/dist/blast.node.js';
import {EddystoneDevice} from '../packages/core/dist/blast.tds.js';

const mac = 'F0346FBF4875';

const thing = await createThing(EddystoneDevice, mac);

console.log('Reading capabilities...')
let data = await thing.readProperty('capabilities');
const capabilities = EddystoneHelpers.parseCapabilities(await data.value());
console.log(capabilities);

console.log('Reading advertising data...')
data = await thing.readProperty('advertisedData')
let advData = EddystoneHelpers.decodeAdvertisingData(await data.value());
console.log(advData);

// Data needs to be encoded to the correct frame type first,
// writable frametypes are: 'UID' | 'URL';
const newData = EddystoneHelpers.encodeAdvertisingData('https://harth.org', 'URL');
console.log('Writing eddystone data...');
await thing.writeProperty('advertisedData', newData);

console.log('Reading advertising data...')
data = await thing.readProperty('advertisedData')
advData = EddystoneHelpers.decodeAdvertisingData(await data.value());
console.log(advData);
