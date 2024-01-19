import {createThing} from '../packages/core/dist/blast.node.cjs';
import {Microbit} from '../packages/core/dist/blast.tds.cjs';

const mac = 'F698F1183836';

const thing = await createThing(Microbit, mac);

for (const [key, value] of Object.entries(thing.properties)) {
  if (value.forms.some(form => form.op === 'readproperty')) {
    console.log(key, await (await thing.readProperty(key)).value());
  }
}

await thing.subscribeEvent("buttonAState", async (data) => { console.log("button B state:", await data.value()); });
await thing.subscribeEvent("buttonBState", async (data) => { console.log("button A state:", await data.value()); });
await thing.subscribeEvent("temperature", async (data) => { console.log("temperature:", await data.value()); });
await thing.subscribeEvent("acceleration", async (data) => { console.log("acceleration:", await data.value()); });
