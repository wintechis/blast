import { Servient } from "@node-wot/core";
let servient;
let wot;
let thingDescriptions = {};
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
export const addThingDescription = function (thingDescription) {
    thingDescriptions[thingDescription.id] = thingDescription;
};
//# sourceMappingURL=index.js.map