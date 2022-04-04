import { Servient } from '@node-wot/core';
let servient;
let wot;
const things = {};
export const getServient = function () {
    if (!servient) {
        servient = new Servient();
    }
    return servient;
};
export const getWoT = async function () {
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
        things[td.id] = await (await getWoT()).produce(td);
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
//# sourceMappingURL=index.js.map