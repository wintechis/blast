import {createThing} from '../packages/core/dist/blast.node.cjs';
import {GoveeLedBulb} from '../packages/core/dist/blast.tds.js';

const mac = 'A4C1389D7900';

const thing = await createThing(GoveeLedBulb, mac);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Turn lamp on and off
let commandId = 0x33;
let packetId = 0x01;

let power = true;
let checksum = generateChecksum([commandId, packetId, power ? 0x01 : 0x00]);
await thing.writeProperty("power", {power, checksum})
await sleep(1000);
power = false;
checksum = generateChecksum([commandId, packetId, power ? 0x01 : 0x00]);
await thing.writeProperty("power", {power, checksum})
await sleep(1000);
power = true;
checksum = generateChecksum([commandId, packetId, power ? 0x01 : 0x00]);
await thing.writeProperty("power", {power, checksum})

// Change color
packetId = 0x05;
let packetId2 = 0x02;

let color = {red: 255, green: 0, blue: 0};
checksum = generateChecksum([commandId, packetId, packetId2, ...Object.values(color)]);
await thing.writeProperty('colour', {...color, checksum});
await sleep(1000);

color = {red: 0, green: 255, blue: 0};
checksum = generateChecksum([commandId, packetId, packetId2, ...Object.values(color)]);
await thing.writeProperty('colour', {...color, checksum});
await sleep(1000);

color = {red: 0, green: 0, blue: 255};
checksum = generateChecksum([commandId, packetId, packetId2, ...Object.values(color)]);
await thing.writeProperty('colour', {...color, checksum});
await sleep(1000);

color = {red: 252, green: 127, blue: 3};
checksum = generateChecksum([commandId, packetId, packetId2, ...Object.values(color)]);
await thing.writeProperty('colour', {...color, checksum});
await sleep(1000);

// Change brightness
packetId = 0x04;
let brightness = 10;
checksum = generateChecksum([commandId, packetId, brightness]);
await thing.writeProperty('brightness', {brightness, checksum});
await sleep(1000);

brightness = 128;
await thing.writeProperty('brightness', {brightness, checksum});
await sleep(1000);

brightness = 255;
await thing.writeProperty('brightness', {brightness, checksum});
await sleep(1000);

brightness = 10;
await thing.writeProperty('brightness', {brightness, checksum});

function generateChecksum(data) {
  let sum = 0;
  for (const byte of data) {
    sum = sum ^ byte;
  }
  return sum;
}

// Exit program
process.exit(0)
