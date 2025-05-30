import {createThing} from '@blast/node';
import {ReneTag} from '@blast/tds';

const mac = 'C93BF234870A';

const thing = await createThing(ReneTag, mac);
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
