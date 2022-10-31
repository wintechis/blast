import * as WoT from 'wot-typescript-definitions';
import {Servient} from '@node-wot/core';
import {BluetoothClientFactory} from './bindings/binding-bluetooth/Bluetooth';
import {BluetoothAdapter} from './bindings/binding-bluetooth/BluetoothAdapter';
import ConcreteBluetoothAdapter from 'BluetoothAdapter';

let servient: Servient;
let wot: typeof WoT;

declare const Wot: any;

export const getServient = function (
  bluetoothAdapter: BluetoothAdapter
): Servient {
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

export const getWot = async function (
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
