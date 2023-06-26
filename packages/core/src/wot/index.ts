import * as WoT from 'wot-typescript-definitions';
import {Helpers, Servient} from '@node-wot/core';
import {JsonPlaceholderReplacer} from 'json-placeholder-replacer';
import {HttpServer, HttpsClientFactory} from '@node-wot/binding-http';
import {BluetoothClientFactory} from './bindings/binding-bluetooth/Bluetooth';
import {BluetoothAdapter} from './bindings/binding-bluetooth/BluetoothAdapter';
import ConcreteBluetoothAdapter from 'BluetoothAdapter';
import {HidClientFactory} from './bindings/binding-hid/Hid';
import {HidAdapter} from './bindings/binding-hid/HidAdapter';
import ConcreteHidAdapter from 'HidAdapter';
export {EddystoneHelpers} from './bindings/binding-bluetooth/EddystoneHelpers';

let servient: Servient;
let wot: typeof WoT;
let wotHelpers: Helpers;

export const getServient = function (
  bluetoothAdapter: BluetoothAdapter,
  hidAdapter: HidAdapter
): Servient {
  const httpConfig = {
    port: 8083,
    allowSelfSigned: true, // client configuration
  };

  if (!servient) {
    servient = new Servient();
    servient.addClientFactory(new BluetoothClientFactory(bluetoothAdapter));
    servient.addClientFactory(new HttpsClientFactory(httpConfig));
    servient.addClientFactory(new HidClientFactory(hidAdapter));
    servient.addServer(new HttpServer(httpConfig));
    wotHelpers = new Helpers(servient);
  }
  return servient;
};

const getWot = async function (
  bluetoothAdapter: BluetoothAdapter = new ConcreteBluetoothAdapter(),
  hidAdapter: HidAdapter = new ConcreteHidAdapter()
): Promise<typeof WoT> {
  if (!wot) {
    wot = await getServient(bluetoothAdapter, hidAdapter).start();
  }
  return wot;
};

export const resetServient = async function (): Promise<void> {
  if (servient) {
    // destroy exposed things
    const things = servient.getThings();
    Object.entries(things).forEach(async ([id]) => {
      const thing = servient.getThing(id);
      if (thing) {
        await thing.destroy();
      }
    });
    await servient.shutdown();
  }
};

export const createThing = async function (
  td: WoT.ThingDescription,
  id: string | undefined
): Promise<WoT.ConsumedThing> {
  if (id) {
    const map = {
      MacOrWebBluetoothId: id,
      HIDPATH: id,
    };
    // deep copy td, because the original td is imported as module and can't be modified.
    td = structuredClone(td);
    td = fillPlaceholder(td, map);
  }
  const wotServient = await getWot();
  const exposedThing = await wotServient.produce(td);
  const consumedThing = await wotServient.consume(
    exposedThing.getThingDescription()
  );
  return consumedThing;
};

export const createThingWithHandlers = async function (
  td: WoT.ThingDescription,
  id: string | undefined,
  addHandlers: (thing: WoT.ExposedThing) => void
): Promise<WoT.ConsumedThing> {
  if (id) {
    const map = {
      MacOrWebBluetoothId: id,
      HIDPATH: id,
    };
    // deep copy td, because the original td is imported as module and can't be modified.
    td = structuredClone(td);
    td = fillPlaceholder(td, map);
  }
  const wotServient = await getWot();
  const exposedThing = await wotServient.produce(td);
  addHandlers(exposedThing);
  await exposedThing.expose();
  const consumedThing = await wotHelpers.fetch('http://localhost:8083/' + id);
  return consumedThing as WoT.ConsumedThing;
};

const fillPlaceholder = function (
  data: Record<string, unknown>,
  map: Record<string, unknown> = {}
): WoT.ThingDescription {
  const placeHolderReplacer = new JsonPlaceholderReplacer();
  placeHolderReplacer.addVariableMap(map);
  return placeHolderReplacer.replace(data) as WoT.ThingDescription;
};
