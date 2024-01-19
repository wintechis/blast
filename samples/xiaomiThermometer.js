import {createThing} from '../packages/core/dist/blast.node.cjs';
import {XiaomiThermometer} from '../packages/core/dist/blast.tds.js';

const mac = 'A4C13852B4DD';

const thing = await createThing(XiaomiThermometer, mac);

const handler = async (data) => {
  let value = await data.value();
  console.log('Temperature:', value[0], '°C');
  console.log('Humidity:', value[1], '%');
};

thing.subscribeEvent('measurements', handler);
