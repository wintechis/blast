import {createThing} from '../packages/core/dist/blast.node.js';
import {PhilipsHue} from '../packages/core/dist/blast.tds.js';

const mac = 'F6DBD9E9C0D1';

const thing = await createThing(PhilipsHue, mac);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Turn Hue off
console.log("Power off")
await thing.writeProperty('power', 0);
await sleep(1000);
// Turn Hue on
console.log("Power on")
await thing.writeProperty('power', 1);
await sleep(1000);
// Read current power status
console.log("Read power status...")
let status = await thing.readProperty('power');
console.log('Current power status:', await status.value());

// Change brightness to min (1)
console.log("Brightness to min (1)")
await thing.writeProperty('brightness', 1);
await sleep(1000);
console.log("Brightness to 127")
// Change brightness to 127
await thing.writeProperty('brightness', 127);
await sleep(1000);
// Read current brightness value
console.log("Read rightness...")
let brightness = await thing.readProperty('brightness');
console.log('Current brightness:', await brightness.value());
await sleep(1000);
// Change brightness to max (254)
console.log("Brightness to max (254)")
await thing.writeProperty('brightness', 254);
await sleep(1000);

// Change color to red (max allowed value is 254, min allowed value is 1)
// Input here is integer number
console.log("Color to red")
await thing.writeProperty("colour", {R: 254, G: 1, B: 1})
await sleep(1000);
// Change color to green
console.log("Color to green")
await thing.writeProperty("colour", {R: 1, G: 254, B: 1})
await sleep(1000);
// Change color to blue
console.log("Color to blue")
await thing.writeProperty("colour", {R: 1, G: 1, B: 254})
await sleep(1000);
// Change color to white
console.log("Color to white")
await thing.writeProperty("colour", {R: 85, G: 85, B: 85})
await sleep(1000);

// Some more example color codes at https://github.com/walter5138/hue_ble_bash/blob/master/hue_color

// Note: Sample leads to EventEmitter memory leak.
//       Needs to be adressed in the future.
