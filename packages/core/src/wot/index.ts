import * as WoT from 'wot-typescript-definitions';
import {ConsumedThing, Content, Servient, ExposedThing} from '@node-wot/core';
import {InteractionOutput} from '@node-wot/core/dist/interaction-output';
import {JsonPlaceholderReplacer} from 'json-placeholder-replacer';
import {HttpsClientFactory} from '@node-wot/binding-http';
import {BluetoothClientFactory} from './bindings/binding-bluetooth/Bluetooth';
import {BluetoothAdapter} from './bindings/binding-bluetooth/BluetoothAdapter';
import ConcreteBluetoothAdapter from 'BluetoothAdapter';
import {HidClientFactory} from './bindings/binding-hid/Hid';
import {HidAdapter} from './bindings/binding-hid/HidAdapter';
import ConcreteHidAdapter from 'HidAdapter';
import {ErrorListener} from 'wot-typescript-definitions';
import {FormElementBase} from 'wot-thing-description-types';
export {EddystoneHelpers} from './bindings/binding-bluetooth/EddystoneHelpers';

let servient: Servient;
let wot: typeof WoT;

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
  const consumedThing = ownConsume(exposedThing as ExposedThing);
  return consumedThing;
};

const fillPlaceholder = function (
  data: Record<string, unknown>,
  map: Record<string, unknown> = {}
): WoT.ThingDescription {
  const placeHolderReplacer = new JsonPlaceholderReplacer();
  placeHolderReplacer.addVariableMap(map);
  return placeHolderReplacer.replace(data) as WoT.ThingDescription;
};

const ownConsume = function (exposedThing: ExposedThing): WoT.ConsumedThing {
  const consumedThing = {} as ConsumedThing;
  consumedThing.id = exposedThing.getThingDescription().id;
  consumedThing.name = exposedThing.getThingDescription().title;

  consumedThing.getThingDescription = exposedThing.getThingDescription;

  consumedThing.subscribeEvent = async function (
    name: string,
    listener: WoT.WotListener,
    _errorListener: ErrorListener,
    _options?: WoT.InteractionOptions
  ): Promise<WoT.Subscription> {
    if (exposedThing.events[name]) {
      const eventElement = exposedThing.events[name];

      // add a dummy form to by-pass protocol-listener-registry check
      const form = {
        op: 'subscribeEvent',
      } as FormElementBase;
      eventElement.forms = [form];

      const contentListener = (data: Content): void => {
        // construct IneractionOutput from data
        const output: WoT.InteractionOutput = new InteractionOutput(data);
        output.form = form;
        listener(output);
      };

      exposedThing.__eventListeners.register(eventElement, 0, contentListener);

      return {
        active: true,
        stop: async (_options?: WoT.InteractionOptions): Promise<void> => {
          exposedThing.__eventListeners.unregister(
            eventElement,
            0,
            contentListener
          );
        },
      };
    } else {
      throw new Error(`Event '${name}' not found`);
    }
  };

  return consumedThing;
};
