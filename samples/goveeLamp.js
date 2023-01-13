import {createThing} from '../packages/core/dist/blast.node.js';
import {GoveeLamp} from '../packages/core/dist/blast.tds.js';

const mac = 'A4C138D81103';

const thing = await createThing(GoveeLamp, mac);

// Turn lamp on and off
await thing.writeProperty("power", {state: 1})
await thing.writeProperty("power", {state: 0})
await thing.writeProperty("power", {state: 1})

// Change color
await thing.writeProperty('colour', {red: 255, green: 0, blue: 0});
await thing.writeProperty('colour', {red: 0, green: 255, blue: 0});
await thing.writeProperty('colour', {red: 0, green: 0, blue: 255});
await thing.writeProperty('colour', {red: 252, green: 127, blue: 3});

// Change brightness
await thing.writeProperty('brightness', {value: 10});
await thing.writeProperty('brightness', {value: 128});
await thing.writeProperty('brightness', {value: 255});
await thing.writeProperty('brightness', {value: 10});

// Exit program
process.exit(0)
