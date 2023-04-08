import {createThing} from '../packages/core/dist/blast.node.js';
import {StreamDeckMini} from '../packages/core/dist/blast.tds.js';
import {HidHelpers} from '../packages/core/dist/blast.hidHelpers.js';

const device = await HidHelpers.selectDevice();
const thing = await createThing(StreamDeckMini, device.path);

thing.writeProperty('brightness', 100);

// Array of booleans to track the state of each key
const keyState = new Array(6).fill(false)


const handleInputBuffer = async function (interactionOutput) {
  const data = await interactionOutput.value();
  // button events are reported as reportId 0x01
  if (data[0] === 1) {
    const keyData = data.slice(1, 7);
    for (let i = 0; i < 6; i++) {
      const keyPressed = Boolean(keyData[i]);
      const keyIndex = i;
      const stateChanged = keyPressed !== keyState[keyIndex];
      if (stateChanged) {
        keyState[keyIndex] = keyPressed;
        if (keyPressed) {
          console.log('down', keyIndex);
        } else {
          console.log('up', keyIndex);
        }
      }
    }
  }
}

thing.subscribeEvent('inputreport', handleInputBuffer);
