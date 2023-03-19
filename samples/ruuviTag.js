import {createThing} from '../packages/core/dist/blast.node.js';
import {RuuviTag} from '../packages/core/dist/blast.tds.js';

const mac = 'C43B4FC3FECA';

const thing = await createThing(RuuviTag, mac);

const handler = async (data) => {
  let value = await data.value();
  console.log(value);
};

thing.subscribeEvent('manufacturerData', handler);
