import * as WoT from 'wot-typescript-definitions';
import {Servient} from '@node-wot/core';
import {Form} from '@node-wot/td-tools';
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

export const createThing = async function (
  td: WoT.ThingDescription,
  id: string | undefined
): Promise<WoT.ConsumedThing> {
  if (id) {
    td = setIds(td, id);
  }
  const wotServient = await getWot();
  return wotServient.consume(td);
};

const setIds = function (
  td: WoT.ThingDescription,
  id: string
): WoT.ThingDescription {
  for (const key in td.properties) {
    if (td.properties[key].forms) {
      td.properties[key].forms.forEach((form: Form) => {
        form.href = form.href.replace('${MacOrWebBluetoothId}', id);
      });
    }
  }
  for (const key in td.actions) {
    if (td.actions[key].forms) {
      td.actions[key].forms.forEach((form: Form) => {
        form.href = form.href.replace('${MacOrWebBluetoothId}', id);
      });
    }
  }
  for (const key in td.events) {
    if (td.events[key].forms) {
      td.events[key].forms.forEach((form: Form) => {
        form.href = form.href.replace('${MacOrWebBluetoothId}', id);
        if (form['wbt:id'] !== undefined) {
          form['wbt:id'] = (form['wbt:id'] as string)?.replace(
            '${MacOrWebBluetoothId}',
            id
          );
        }
      });
    }
  }
  return td;
};
