import {createThing} from '../packages/core/dist/blast.node.cjs';
import {RuuviTag} from '../packages/core/dist/blast.tds.cjs';

const mac = 'C43B4FC3FECA';

const thing = await createThing(RuuviTag, mac);

const handler = async (data) => {
  let valueArray = await data.value();
  console.log('temperature: ' + valueArray[1] + '°C');
  console.log('humidity: ' + valueArray[2] + '%');
  console.log('pressure: ' + valueArray[3] + 'Pa');
  console.log('acceleration-x: ' + valueArray[4] + 'G');
  console.log('acceleration-y: ' + valueArray[5] + 'G');
  console.log('acceleration-z: ' + valueArray[6] + 'G');
  // not decoded by the codecs, because of its offset.
  // see https://docs.ruuvi.com/communication/bluetooth-advertisements/data-format-5-rawv2
  console.log('power-info: ' + valueArray[7]);
  console.log('movement-counter: ' + valueArray[8]);
  console.log('measurement-sequence-number: ' + valueArray[9]);
};

thing.subscribeEvent('UART data', handler);
