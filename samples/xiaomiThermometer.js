import {createThing} from '../packages/core/dist/blast.node.js';
import {XiaomiThermometer} from '../packages/core/dist/blast.tds.js';

const mac = 'A4C13852B4DD';

const thing = await createThing(XiaomiThermometer, mac);

const handler = (measurements) => {
  console.log(measurements);
};

thing.subscribeEvent('measurements', handler);
