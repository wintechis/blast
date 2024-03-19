import {createThing} from '@blast/node';
import {BleRgbController, RuuviTag} from '@blast/tds';

const ledMac = 'BE5860018744';
const ruuviMac = 'C43B4FC3FECA';

// Subscribe to Ruuvi GAP broadcasts
const ruuvi = await createThing(RuuviTag, ruuviMac);
const handler = async (data) => {
  data = await data.value();
  console.log(data);
};
console.log('Subscribing to Ruuvi GAP broadcasts');
// Control LED
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const led = await createThing(BleRgbController, ledMac);
await led.writeProperty('power', {is_on: 1});
ruuvi.subscribeEvent('GapBroadcast', handler);
await led.writeProperty('colour', {R: 255, G: 0, B: 0});
await sleep(1000);
await led.writeProperty('colour', {R: 0, G: 255, B: 0});
await sleep(1000);
await led.writeProperty('colour', {R: 0, G: 0, B: 255});
await sleep(1000);
await led.writeProperty('colour', {R: 255, G: 0, B: 0});
await sleep(1000);
await led.writeProperty('colour', {R: 0, G: 255, B: 0});
await sleep(1000);
await led.writeProperty('colour', {R: 0, G: 0, B: 255});
await sleep(1000);
await led.writeProperty('colour', {R: 255, G: 0, B: 0});
await sleep(1000);
await led.writeProperty('colour', {R: 0, G: 255, B: 0});
await sleep(1000);
await led.writeProperty('colour', {R: 0, G: 0, B: 255});
await sleep(1000);
await led.writeProperty('colour', {R: 255, G: 0, B: 0});
await sleep(1000);
await led.writeProperty('colour', {R: 0, G: 255, B: 0});
await sleep(1000);
await led.writeProperty('colour', {R: 0, G: 0, B: 255});
