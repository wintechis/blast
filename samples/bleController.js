import Blast from '../packages/core/dist/blast.node.min.js';
const {BleRgbController} = Blast;

const mac = 'BE5860018744';

const bleRgbController = new BleRgbController();
const thing = await bleRgbController.init(mac);

while (true) {
    await thing.writeProperty('colour', {R: 255, G: 0, B: 0});
    await thing.writeProperty('colour', {R: 0, G: 255, B: 0});
    await thing.writeProperty('colour', {R: 0, G: 0, B: 255});
}
