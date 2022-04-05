import * as WoT from 'wot-typescript-definitions';
import {Servient} from '@node-wot/core';
import {WebBluetoothClientFactory} from './binding-webBluetooth/webBluetooth.js';

let servient: Servient;
let wot: typeof WoT;
const things: {[key: string]: WoT.ExposedThing} = {};

export const getServient = function (): Servient {
  if (!servient) {
    servient = new Servient();
    servient.addClientFactory(new WebBluetoothClientFactory());
  }
  return servient;
};

export const getWot = async function (): Promise<typeof WoT> {
  if (!wot) {
    wot = await getServient().start();
  }
  return wot;
};

export const getThing = async function (
  td: WoT.ThingDescription
): Promise<WoT.ExposedThing> {
  if (!td.id) {
    throw new Error('Missing id in ThingDescription');
  }
  if (!things[td.id]) {
    things[td.id] = await (await getWot()).produce(td);
  }
  return things[td.id];
};

export const removeThing = async function (
  td: WoT.ThingDescription
): Promise<void> {
  if (!td.id) {
    throw new Error('Missing id in ThingDescription');
  }
  if (things[td.id]) {
    await things[td.id].destroy();
    delete things[td.id];
  }
};

/**
 * Endocdes json data to use it as parameter in a Thing affordance.
 * @param {JSON} data the data to encode
 */
export const encodeJson = function (data: JSON): ReadableStream {
  const encoder = new TextEncoder();
  const jsonStr = encoder.encode(JSON.stringify(data));

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(jsonStr);
      controller.close();
    },
  });

  return stream;
};
