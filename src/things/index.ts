import * as WoT from 'wot-typescript-definitions';
import {Servient} from '@node-wot/core';
import {WebBluetoothClientFactory} from './bindings/binding-webBluetooth/webBluetooth.js';
import {WebHidClientFactory} from './bindings/binding-webHid/webHid.js';

let servient: Servient;
let wot: typeof WoT;
const things: {[key: string]: WoT.ExposedThing} = {};

export const getServient = function (): Servient {
  if (!servient) {
    servient = new Servient();
    servient.addClientFactory(new WebBluetoothClientFactory());
    servient.addClientFactory(new WebHidClientFactory());
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
