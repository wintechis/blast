import {getServient, getWot} from '../../packages/core/dist/blast.node.js';
import core from '@node-wot/core';

const servient = getServient()
const wotHelper = new core.Helpers(servient);
const wotServient = await getWot();
const td = await wotHelper.fetch('http://localhost:8084/ruuvihttp/');
const consumedThing = await wotServient.consume(td);

consumedThing.observeProperty('temperature', async (data) => {
  const temperature = await data.value();
  console.log("------------------------------");
  console.log("temperature : ", temperature, "°C");
  console.log("------------------------------");
});

consumedThing.observeProperty('movement-counter', async (data) => {
  const movementCounter = await data.value();
  console.log("------------------------------");
  console.log("movement-counter : ", movementCounter);
  console.log("------------------------------");
});
