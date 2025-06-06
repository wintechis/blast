import {createThing} from '@blast/node';
import {BleRgbController} from '@blast/tds';

const mac = 'BE5860018744';

const thing = await createThing(BleRgbController, mac);

await thing.writeProperty('power', {is_on: 1});

while (true) {
    await thing.writeProperty('colour', {R: 255, G: 0, B: 0});
    await thing.writeProperty('colour', {R: 0, G: 255, B: 0});
    await thing.writeProperty('colour', {R: 0, G: 0, B: 255});
}
