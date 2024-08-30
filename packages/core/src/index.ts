import * as WoT from 'wot-typescript-definitions';
import {
  ConsumedThing,
  Content,
  Servient,
  ExposedThing,
  ProtocolHelpers,
} from '@node-wot/core';
import {InteractionOutput} from '@node-wot/core/dist/interaction-output.js';
import {JsonPlaceholderReplacer} from 'json-placeholder-replacer';
import {HttpClientFactory, HttpsClientFactory} from '@node-wot/binding-http';
import {
  GattClientFactory,
  GapClientFactory,
} from './bindings/binding-bluetooth/Bluetooth.js';
import {BluetoothAdapter} from './bindings/binding-bluetooth/BluetoothAdapter.js';
export {BluetoothAdapter} from './bindings/binding-bluetooth/BluetoothAdapter.js';
import {HidClientFactory} from './bindings/binding-hid/Hid.js';
import {HidAdapter} from './bindings/binding-hid/HidAdapter.js';
export {HidAdapter} from './bindings/binding-hid/HidAdapter.js';
import {ErrorListener} from 'wot-typescript-definitions';
import {FormElementBase} from 'wot-thing-description-types';
export {EddystoneHelpers} from './bindings/binding-bluetooth/EddystoneHelpers.js';
import {Readable} from 'stream';
import {ReadableStream as PolyfillStream} from 'web-streams-polyfill';

export default class Blast {
  private servient: Servient;
  private wot: typeof WoT | undefined;

  constructor(
    ConcreteBluetoothAdapter?: new () => BluetoothAdapter | undefined,
    ConcreteHidAdapter?: new () => HidAdapter | undefined
  ) {
    const httpConfig = {
      port: 8083,
      allowSelfSigned: true, // client configuration
    };
    this.servient = new Servient();
    if (ConcreteBluetoothAdapter) {
      const bluetoothAdapter = new ConcreteBluetoothAdapter();
      if (bluetoothAdapter) {
        this.servient.addClientFactory(new GattClientFactory(bluetoothAdapter));
        this.servient.addClientFactory(new GapClientFactory(bluetoothAdapter));
      }
    }
    if (ConcreteHidAdapter) {
      const hidAdapter = new ConcreteHidAdapter();
      if (hidAdapter) {
        this.servient.addClientFactory(new HidClientFactory(hidAdapter));
      }
    }
    this.servient.addClientFactory(new HttpClientFactory(httpConfig));
    this.servient.addClientFactory(new HttpsClientFactory(httpConfig));
  }

  public async getWot(): Promise<typeof WoT> {
    if (!this.wot) {
      this.wot = await this.servient.start();
    }
    return this.wot;
  }

  public async resetServient(): Promise<void> {
    if (this.servient) {
      // destroy exposed things
      const things = this.servient.getThings();
      Object.entries(things).forEach(async ([id]) => {
        const thing = this.servient.getThing(id);
        if (thing) {
          await thing.destroy();
        }
      });
      try {
        await this.servient.shutdown();
      } catch (e) {
        // ignore
      }
    }
  }

  public async createExposedThing(
    td: WoT.ThingDescription,
    id: string | undefined
  ): Promise<WoT.ExposedThing> {
    if (id) {
      const map = {
        MacOrWebBluetoothId: id,
        HIDPATH: id,
      };
      // deep copy td, because the original td is imported as module and can't be modified.
      td = structuredClone(td);
      td = fillPlaceholder(td, map);
    }
    const wot = await this.getWot();
    const exposedThing = await wot.produce(td);
    return exposedThing;
  }

  public async createThing(
    td: WoT.ThingDescription,
    id: string | undefined
  ): Promise<WoT.ConsumedThing> {
    const exposedThing = await this.createExposedThing(td, id);
    const wot = await this.getWot();
    const consumedThing = await wot.consume(exposedThing.getThingDescription());
    return consumedThing;
  }

  public async createThingWithHandlers(
    td: WoT.ThingDescription,
    id: string | undefined,
    addHandlers: (thing: WoT.ExposedThing) => void
  ): Promise<WoT.ConsumedThing> {
    const exposedThing = await this.createExposedThing(td, id);
    addHandlers(exposedThing);
    const consumedThing = ownConsume(exposedThing as ExposedThing);
    return consumedThing;
  }
}

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
    const eventElement = exposedThing.events[name];
    if (eventElement) {
      // add a dummy form to by-pass protocol-listener-registry check
      const form = {
        op: 'subscribeEvent',
        "contentType": "application/octet-stream;length=1;",
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

  consumedThing.invokeAction = async function (
    actionName: string,
    params?: WoT.InteractionInput,
    options: WoT.InteractionOptions = {}
  ): Promise<InteractionOutput> {
    // add a dummy form to by-pass protocol-listener-registry check
    const form = {
      op: 'invokeAction',
    } as FormElementBase;
    exposedThing.actions[actionName].forms = [form];

    let readable = new Readable();
    if (params) {
      readable = interactionInputToReadable(params);
    }

    let type = exposedThing.actions[actionName].input?.type as string;
    if (!type) {
      throw new Error(`Action '${actionName}' has no input type`);
    }
    switch (type) {
      case 'string':
      case 'boolean':
      case 'number':
        type = 'text/plain';
        break;
      default:
        type = 'application/json';
    }

    const content = new Content(type, readable);
    let outputContent = await exposedThing.handleInvokeAction(
      actionName,
      content,
      {formIndex: 0, ...options}
    );
    if (outputContent === undefined) {
      outputContent = new Content(type, new Readable());
    }
    const output = new InteractionOutput(outputContent);
    return output;
  };

  consumedThing.readProperty = async function (
    propertyName: string,
    options: WoT.InteractionOptions = {}
  ): Promise<InteractionOutput> {
    const propertyElement = exposedThing.properties[propertyName];
    if (!propertyElement) {
      throw new Error(`Property '${propertyName}' not found`);
    }
    // add a dummy form to by-pass protocol-listener-registry check
    const form = {
      op: 'readProperty',
    } as FormElementBase;
    propertyElement.forms = [form];

    const outputContent = await exposedThing.handleReadProperty(propertyName, {
      formIndex: 0,
      ...options,
    });
    const output = new InteractionOutput(outputContent, form);
    return output;
  };

  consumedThing.writeProperty = async function (
    propertyName: string,
    value: WoT.InteractionInput,
    options: WoT.InteractionOptions = {}
  ): Promise<void> {
    const propertyElement = exposedThing.properties[propertyName];
    if (!propertyElement) {
      throw new Error(`Property '${propertyName}' not found`);
    }
    // add a dummy form to by-pass protocol-listener-registry check
    const form = {
      op: 'writeProperty',
    } as FormElementBase;
    propertyElement.forms = [form];

    let readable = new Readable();
    if (value) {
      readable = interactionInputToReadable(value);
    }

    let type = exposedThing.properties[propertyName].type as string;
    if (!type) {
      throw new Error(`Property '${propertyName}' has no type`);
    }
    switch (type) {
      case 'string':
      case 'boolean':
      case 'number':
        type = 'text/plain';
        break;
      default:
        type = 'application/json';
    }

    const content = new Content(type, readable);
    await exposedThing.handleWriteProperty(propertyName, content, {
      formIndex: 0,
      ...options,
    });
  };

  return consumedThing;
};

const interactionInputToReadable = function (
  input: WoT.InteractionInput
): Readable {
  let body;
  if (
    typeof ReadableStream !== 'undefined' &&
    input instanceof ReadableStream
  ) {
    body = ProtocolHelpers.toNodeStream(input);
  } else if (input instanceof PolyfillStream) {
    body = ProtocolHelpers.toNodeStream(input);
  } else if (Array.isArray(input) || typeof input === 'object') {
    body = Readable.from(Buffer.from(JSON.stringify(input), 'utf-8'));
  } else {
    body = Readable.from(Buffer.from(input.toString(), 'utf-8'));
  }
  return body;
};
