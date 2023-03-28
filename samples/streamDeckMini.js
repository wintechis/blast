import {createThing} from '../packages/core/dist/blast.node.js';
import {StreamDeckMini} from '../packages/core/dist/blast.tds.js';
import {HidHelpers} from '../packages/core/dist/blast.hidHelpers.js';

const device = await HidHelpers.selectDevice();
const thing = await createThing(StreamDeckMini, device.path);

thing.writeProperty('brightness', 100);
