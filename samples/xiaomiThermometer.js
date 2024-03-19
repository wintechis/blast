import {createThing} from '@blast/node';
import {XiaomiThermometer} from '@blast/tds';

const mac = 'A4C13852B4DD';

const thing = await createThing(XiaomiThermometer, mac);

const handler = async (data) => {
  let value = await data.value();
  console.log('Temperature:', value[0], '°C');
  console.log('Humidity:', value[1], '%');
};

thing.subscribeEvent('measurements', handler);
