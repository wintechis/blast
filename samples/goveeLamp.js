import {createThing} from '../packages/core/dist/blast.node.cjs';
import {GoveeLedBulb} from '../packages/core/dist/blast.tds.js';

const mac = 'A4C1389D7900';

const thing = await createThing(GoveeLedBulb, mac);

// Turn lamp on and off
let power = true;
let checksum = generateChecksum([0x33, 0x01, power ? 0x01 : 0x00]);
await thing.writeProperty("power", {power: power, checksum: checksum})
power = false;
checksum = generateChecksum([0x33, 0x01, power ? 0x01 : 0x00]);
await thing.writeProperty("power", {power: power, checksum: checksum})
power = true;
checksum = generateChecksum([0x33, 0x01, power ? 0x01 : 0x00]);
await thing.writeProperty("power", {power: power, checksum: checksum})

// // Change color
// await thing.writeProperty('colour', {red: 255, green: 0, blue: 0});
// await thing.writeProperty('colour', {red: 0, green: 255, blue: 0});
// await thing.writeProperty('colour', {red: 0, green: 0, blue: 255});
// await thing.writeProperty('colour', {red: 252, green: 127, blue: 3});

// // Change brightness
// await thing.writeProperty('brightness', {value: 10});
// await thing.writeProperty('brightness', {value: 128});
// await thing.writeProperty('brightness', {value: 255});
// await thing.writeProperty('brightness', {value: 10});

function generateChecksum(data) {
  let sum = 0;
  for (const byte of data) {
    sum = sum ^ byte;
  }
  return sum;
}

// Exit program
process.exit(0)
