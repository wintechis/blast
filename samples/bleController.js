import {createThing} from '../packages/core/dist/blast.node.js';
import {BleRgbController} from '../packages/core/dist/blast.tds.js';

const mac = 'BE5860018744';

const thing = await createThing(BleRgbController, mac);

while (true) {
    await thing.writeProperty('colour', {R: 255, G: 0, B: 0});
    await thing.writeProperty('colour', {R: 0, G: 255, B: 0});
    await thing.writeProperty('colour', {R: 0, G: 0, B: 255});
}
