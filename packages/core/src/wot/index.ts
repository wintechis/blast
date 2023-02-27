import * as WoT from 'wot-typescript-definitions';
import {Servient} from '@node-wot/core';
import {JsonPlaceholderReplacer} from 'json-placeholder-replacer';
import {HttpsClientFactory} from '@node-wot/binding-http';
import {BluetoothClientFactory} from './bindings/binding-bluetooth/Bluetooth';
import {BluetoothAdapter} from './bindings/binding-bluetooth/BluetoothAdapter';
import ConcreteBluetoothAdapter from 'BluetoothAdapter';
export {EddystoneHelpers} from './bindings/binding-bluetooth/EddystoneHelpers';

let servient: Servient;
let wot: typeof WoT;

export const getServient = function (
  bluetoothAdapter: BluetoothAdapter
): Servient {
  const httpConfig = {
    allowSelfSigned: true, // client configuration
  };

  if (!servient) {
    servient = new Servient();
    servient.addClientFactory(new BluetoothClientFactory(bluetoothAdapter));
    servient.addClientFactory(new HttpsClientFactory(httpConfig));
  }
  return servient;
};

const getWot = async function (
  bluetoothAdapter?: BluetoothAdapter
): Promise<typeof WoT> {
  if (!wot) {
    if (bluetoothAdapter) {
      wot = await getServient(bluetoothAdapter).start();
    } else {
      wot = await getServient(new ConcreteBluetoothAdapter()).start();
    }
  }
  return wot;
};

export const resetServient = async function (): Promise<void> {
  if (servient) {
    const things = servient.getThings();
    Object.entries(things).forEach(([id, td]) => {
      servient.destroyThing(id);
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
    };
    // deep copy td, because the original td is imported as module and can't be modified.
    td = JSON.parse(JSON.stringify(td));
    td = fillPlaceholder(td, map);
  }
  const wotServient = await getWot();
  return wotServient.consume(td);
};

const fillPlaceholder = function (
  data: Record<string, unknown>,
  map: Record<string, unknown> = {}
): WoT.ThingDescription {
  const placeHolderReplacer = new JsonPlaceholderReplacer();
  placeHolderReplacer.addVariableMap(map);
  return placeHolderReplacer.replace(data) as WoT.ThingDescription;
};
