import * as WoT from 'wot-typescript-definitions';
import {
  createLoggers,
  ConsumedThing,
  Content,
  ContentSerdes,
  Helpers,
  ProtocolHelpers,
  Servient,
  ExposedThing,
} from '@node-wot/core';
import Ajv from 'ajv';
import * as util from 'util';
import {JsonPlaceholderReplacer} from 'json-placeholder-replacer';
import {HttpsClientFactory} from '@node-wot/binding-http';
import {BluetoothClientFactory} from './bindings/binding-bluetooth/Bluetooth';
import {BluetoothAdapter} from './bindings/binding-bluetooth/BluetoothAdapter';
import ConcreteBluetoothAdapter from 'BluetoothAdapter';
import {HidClientFactory} from './bindings/binding-hid/Hid';
import {HidAdapter} from './bindings/binding-hid/HidAdapter';
import ConcreteHidAdapter from 'HidAdapter';
import {ErrorListener} from 'wot-typescript-definitions';
import ProtocolListenerRegistry from '@node-wot/core/dist/protocol-listener-registry';
export {EddystoneHelpers} from './bindings/binding-bluetooth/EddystoneHelpers';

let servient: Servient;
let wot: typeof WoT;
let wotHelpers: Helpers;

const {debug} = createLoggers('wot');
const ajv = new Ajv({strict: false});

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

  consumedThing.subscribeEvent = async function (
    name: string,
    listener: WoT.WotListener,
    errorListener: ErrorListener,
    options?: WoT.InteractionOptions
  ): Promise<WoT.Subscription> {
    const td = exposedThing.getThingDescription();
    if (exposedThing.events && exposedThing.events[name]) {
      const eventElement = exposedThing.events[name];

      const contentListener = (data: Content): void => {
        // construct IneractionOutput from data
        const output: WoT.InteractionOutput = new InteractionOutput(data);
        listener(output);
      };

      (
        (exposedThing as any).__eventListeners as ProtocolListenerRegistry
      ).register(eventElement, 0, contentListener);

      return {
        active: true,
        stop: async (options?: WoT.InteractionOptions): Promise<void> => {
          (
            (exposedThing as any).__eventListeners as ProtocolListenerRegistry
          ).unregister(eventElement, 0, contentListener);
        },
      };
    } else {
      throw new Error(`Event '${name}' not found`);
    }
  };

  return consumedThing;
};

class InteractionOutput implements WoT.InteractionOutput {
  private content: Content;
  private parsedValue: unknown;
  private buffer?: ArrayBuffer;
  private _stream?: ReadableStream;
  dataUsed: boolean;
  form?: WoT.Form;
  schema?: WoT.DataSchema;

  public get data(): ReadableStream {
    if (this._stream) {
      return this._stream;
    }

    if (this.dataUsed) {
      throw new Error("Can't read the stream once it has been already used");
    }
    // Once the stream is created data might be pulled unpredictably
    // therefore we assume that it is going to be used to be safe.
    this.dataUsed = true;
    return (this._stream = ProtocolHelpers.toWoTStream(
      this.content.body
    ) as ReadableStream);
  }

  constructor(content: Content, form?: WoT.Form, schema?: WoT.DataSchema) {
    this.content = content;
    this.form = form;
    this.schema = schema;
    this.dataUsed = false;
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    if (this.buffer) {
      return this.buffer;
    }

    if (this.dataUsed) {
      throw new Error("Can't read the stream once it has been already used");
    }

    const data = await this.content.toBuffer();
    this.dataUsed = true;
    this.buffer = data;

    return data;
  }

  async value<T>(): Promise<T> {
    // the value has been already read?
    if (this.parsedValue) {
      return this.parsedValue as T;
    }

    if (this.dataUsed) {
      throw new Error("Can't read the stream once it has been already used");
    }

    // read fully the stream
    const data = await this.content.toBuffer();
    this.dataUsed = true;
    this.buffer = data;

    // call the contentToValue
    // TODO: should be fixed contentToValue MUST define schema as nullable
    const value = ContentSerdes.get().contentToValue(
      {type: this.content.type, body: data},
      this.schema ?? {}
    );

    // any data (schema)?
    if (this.schema) {
      // validate the schema
      const validate = ajv.compile<T>(this.schema);

      if (!validate(value)) {
        debug(
          `schema = ${util.inspect(this.schema, {depth: 10, colors: true})}`
        );
        debug(`value: ${value}`);
        debug(`Errror: ${validate.errors}`);
        throw new DataSchemaError(
          'Invalid value according to DataSchema',
          value as WoT.DataSchemaValue
        );
      }
    }

    this.parsedValue = value;
    return this.parsedValue as T;
  }
}

class NotSupportedError extends Error {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    // TS limitation see https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, NotSupportedError.prototype);
  }
}

class DataSchemaError extends Error {
  value: WoT.DataSchemaValue;
  constructor(message: string, value: WoT.DataSchemaValue) {
    super(message);
    this.value = value;
    // Set the prototype explicitly.
    // TS limitation see https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, NotSupportedError.prototype);
  }
}
