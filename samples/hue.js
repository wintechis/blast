import {createThing} from '../packages/core/dist/blast.node.js';
import {PhilipsHue} from '../packages/core/dist/blast.tds.js';

const mac = 'F6DBD9E9C0D1';

const thing = await createThing(PhilipsHue, mac);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// Turn Hue off
await thing.writeProperty('power', 0);
await sleep(1000);
// Turn Hue on
await thing.writeProperty('power', 1);
await sleep(1000);
// Read current power status
let status = await thing.readProperty('power');
console.log('Current power status:', await status.value());

// Change brightness to min (1)
await thing.writeProperty('brightness', 1);
// Change brightness to 127
await thing.writeProperty('brightness', 127);
// Read current brightness value
let brightness = await thing.readProperty('brightness');
console.log('Current brightness:', await brightness.value());
// Change brightness to max (254)
await thing.writeProperty('brightness', 254);
