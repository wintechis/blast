import {createThing} from '../packages/core/dist/blast.node.cjs';
import {Blinkstick} from '../packages/core/dist/blast.tds.js';
import {HidHelpers} from '../packages/core/dist/blast.hidHelpers.js';

const device = await HidHelpers.selectDevice();
const thing = await createThing(Blinkstick, device.path);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// set all LEDs to red and back to black with 100ms delay between each
for (let i = 0; i < 8; i++) {
  await thing.writeProperty('color', [5, 0, i, 255, 0, 0]);
  if (i > 0) {
    await thing.writeProperty('color', [5, 0, i - 1, 0, 0, 0]);
  }
  await wait(100);
}
await thing.writeProperty('color', [5, 0, 7, 0, 0, 0]);
