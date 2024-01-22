import {createThing} from '../packages/core/dist/blast.node.cjs';
import {RuuviTag} from '../packages/core/dist/blast.tds.js';
import {BleRgbController} from '../packages/core/dist/blast.tds.js';

const ledMac = 'BE5860018744';
const ruuviMac = 'C43B4FC3FECA';

// Subscribe to Ruuvi GAP broadcasts
const ruuvi = await createThing(RuuviTag, ruuviMac);
const handler = async (data) => {
  data = await data.value();
  console.log(data);
};
ruuvi.subscribeEvent('GapBroadcast', handler);

// Control LED
const led = await createThing(BleRgbController, ledMac);
await led.writeProperty('power', {is_on: 1});
while (true) {
    await led.writeProperty('colour', {R: 255, G: 0, B: 0});
    await led.writeProperty('colour', {R: 0, G: 255, B: 0});
    await led.writeProperty('colour', {R: 0, G: 0, B: 255});
}
