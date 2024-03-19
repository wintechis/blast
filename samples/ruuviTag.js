import {createThing} from '@blast/node';
import {RuuviTag} from '@blast/tds';

const mac = 'C43B4FC3FECA';

const thing = await createThing(RuuviTag, mac);
const measurements = [];
for (const [key, value] of Object.entries(thing.events['GapBroadcast'].data.properties)) {
  measurements.push({name: key, unit: value.unit});
}

const handler = async (data) => {
  data = await data.value();
  for (const measurement of measurements) {
    console.log(measurement.name, ':', data[measurement.name], measurement.unit ?? '');
  }
};

thing.subscribeEvent('GapBroadcast', handler);
