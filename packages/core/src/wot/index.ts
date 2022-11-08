import * as WoT from 'wot-typescript-definitions';
import {Servient} from '@node-wot/core';
import {BluetoothClientFactory} from './bindings/binding-bluetooth/Bluetooth';
import {BluetoothAdapter} from './bindings/binding-bluetooth/BluetoothAdapter';
import ConcreteBluetoothAdapter from 'BluetoothAdapter';

let servient: Servient;
let wot: typeof WoT;

declare const Wot: any;

const getServient = function (bluetoothAdapter: BluetoothAdapter): Servient {
  if (!servient) {
    try {
      servient = new Servient();
    } catch (e) {
      servient = new Wot.Core.Servient();
    }
    servient.addClientFactory(new BluetoothClientFactory(bluetoothAdapter));
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

export const createThing = async function (
  td: WoT.ThingDescription,
  id: string
): Promise<WoT.ConsumedThing> {
  td = setIds(td, id);
  const wotServient = await getWot();
  return wotServient.consume(td);
};

const setIds = function (
  td: WoT.ThingDescription,
  id: string
): WoT.ThingDescription {
  for (const key in td.properties) {
    if (td.properties[key].forms) {
      td.properties[key].forms.forEach(form => {
        form.href = form.href.replace('${MacOrWebBluetoothId}', id);
      });
    }
  }
  for (const key in td.actions) {
    if (td.actions[key].forms) {
      td.actions[key].forms.forEach(form => {
        form.href = form.href.replace('${MacOrWebBluetoothId}', id);
      });
    }
  }
  for (const key in td.events) {
    if (td.events[key].forms) {
      td.events[key].forms.forEach(form => {
        form.href = form.href.replace('${MacOrWebBluetoothId}', id);
      });
    }
  }
  return td;
};
