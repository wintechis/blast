import { Servient } from '@node-wot/core';
import { WebBluetoothClientFactory } from './binding-webBluetooth/webBluetooth.js';
let servient;
let wot;
const things = {};
export const getServient = function () {
    if (!servient) {
        servient = new Servient();
        servient.addClientFactory(new WebBluetoothClientFactory());
    }
    return servient;
};
export const getWot = async function () {
    if (!wot) {
        wot = await getServient().start();
    }
    return wot;
};
export const getThing = async function (td) {
    if (!td.id) {
        throw new Error('Missing id in ThingDescription');
    }
    if (!things[td.id]) {
        things[td.id] = await (await getWot()).produce(td);
    }
    return things[td.id];
};
export const removeThing = async function (td) {
    if (!td.id) {
        throw new Error('Missing id in ThingDescription');
    }
    if (things[td.id]) {
        await things[td.id].destroy();
        delete things[td.id];
    }
};
/**
 * Endocdes json data to use it as parameter in a Thing affordance.
 * @param {JSON} data the data to encode
 */
export const encodeJson = function (data) {
    const encoder = new TextEncoder();
    const jsonStr = encoder.encode(JSON.stringify(data));
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(jsonStr);
            controller.close();
        },
    });
    return stream;
};
//# sourceMappingURL=index.js.map