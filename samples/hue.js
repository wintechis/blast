import {createThing} from '@blast/node';
import {PhilipsHue} from '@blast/tds';

const mac = 'D7FF4B11BC6F';

const thing = await createThing(PhilipsHue, mac);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Turn Hue off
console.log('Power off');
await thing.writeProperty('power', 0);
await sleep(1000);
// Turn Hue on
console.log('Power on');
await thing.writeProperty('power', 1);
await sleep(1000);
// Read current power status
console.log('Read power status...');
let status = await thing.readProperty('power');
console.log('Current power status:', await status.value());

// Change brightness to min (1)
console.log('Brightness to min (1)');
await thing.writeProperty('brightness', 1);
await sleep(1000);
console.log('Brightness to 127');
// Change brightness to 127
await thing.writeProperty('brightness', 127);
await sleep(1000);
// Read current brightness value
console.log('Read brightness...');
let brightness = await thing.readProperty('brightness');
console.log('Current brightness:', await brightness.value());
await sleep(1000);
// Change brightness to max (254)
console.log('Brightness to max (254)');
await thing.writeProperty('brightness', 254);
await sleep(1000);

// Change color to red (max allowed value is 254, min allowed value is 1)
// Input here is integer number
console.log('Color to red');
await thing.writeProperty('colour', {red: 255, green: 0, blue: 0});
await sleep(1000);
// Change color to green
console.log('Color to green');
await thing.writeProperty('colour', {red: 0, green: 255, blue: 0});
await sleep(1000);
// Change color to blue
console.log('Color to blue');
await thing.writeProperty('colour', {red: 0, green: 0, blue: 255});
await sleep(1000);
// Change color to orange
console.log('Color to orange');
await thing.writeProperty('colour', {red: 252, green: 127, blue: 3});

// Exit program
process.exit(0);

// Note: Sample leads to EventEmitter memory leak.
//       Needs to be adressed in the future.
