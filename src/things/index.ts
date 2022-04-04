import * as WoT from 'wot-typescript-definitions';
import {Servient} from '@node-wot/core';

let servient: Servient;
let wot: typeof WoT;
const things: {[key: string]: WoT.ExposedThing} = {};

export const getServient = function (): Servient {
  if (!servient) {
    servient = new Servient();
  }
  return servient;
};

export const getWoT = async function (): Promise<typeof WoT> {
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
    things[td.id] = await (await getWoT()).produce(td);
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
