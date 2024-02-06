import {RuuviTag} from '../../packages/core/dist/blast.tds.js';
import {createThing, createExposedThing, getServient} from '../../packages/core/dist/blast.node.cjs';
import bindingHttp from "@node-wot/binding-http";

const mac = 'C43B4FC3FECA';
const httpConfig = {
  port: 8084,
};
let temperature, humidity, pressure, accelerationX, accelerationY,
  accelerationZ, powerInfo, movementCounter, measurementSequenceNumber;

const newTd = {
  title: "RuuviHttp",
  properties: {
    temperature: {
      type: "number",
      observable: true,
    },
    humidity: {
      type: "number",
      observable: true,
    },
    pressure: {
      observable: true,
      type: "number",
    },
    "acceleration-x": {
      type: "number",
      observable: true,
    },
    "acceleration-y": {
      type: "number",
      observable: true,
    },
    "acceleration-z": {
      type: "number",
      observable: true,
    },
    "power-info": {
      type: "number",
      observable: true,
    },
    "movement-counter": {
      type: "integer",
      observable: true,
    },
    "measurement-sequence-number": {
      type: "integer",
      observable: true,
    },
  },
}

getServient().addServer(new bindingHttp.HttpServer(httpConfig));
const exposedThing = await createExposedThing(newTd);
const consumedThing = await createThing(RuuviTag, mac);

const handler = async (data) => {
  console.log('reveived UART data')
  let valueArray = await data.value();
  temperature = valueArray[1];
  exposedThing.emitPropertyChange('temperature');
  humidity = valueArray[2];
  exposedThing.emitPropertyChange('humidity');
  pressure = valueArray[3];
  exposedThing.emitPropertyChange('pressure');
  accelerationX = valueArray[4];
  exposedThing.emitPropertyChange('acceleration-x');
  accelerationY = valueArray[5];
  exposedThing.emitPropertyChange('acceleration-y');
  accelerationZ = valueArray[6];
  exposedThing.emitPropertyChange('acceleration-z');
  powerInfo = valueArray[7];
  exposedThing.emitPropertyChange('power-info');
  movementCounter = valueArray[8];
  exposedThing.emitPropertyChange('movement-counter');
  measurementSequenceNumber = valueArray[9];
  exposedThing.emitPropertyChange('measurement-sequence-number');
};

consumedThing.subscribeEvent('UART data', handler);

exposedThing.setPropertyReadHandler('temperature', async () => temperature);
exposedThing.setPropertyReadHandler('humidity', async () => humidity);
exposedThing.setPropertyReadHandler('pressure', async () => pressure);
exposedThing.setPropertyReadHandler('acceleration-x', async () => accelerationX);
exposedThing.setPropertyReadHandler('acceleration-y', async () => accelerationY);
exposedThing.setPropertyReadHandler('acceleration-z', async () => accelerationZ);
exposedThing.setPropertyReadHandler('power-info', async () => powerInfo);
exposedThing.setPropertyReadHandler('movement-counter', async () => movementCounter);
exposedThing.setPropertyReadHandler('measurement-sequence-number', async () => measurementSequenceNumber);

await exposedThing.expose();
