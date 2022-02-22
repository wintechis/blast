import * as WoT from "wot-typescript-definitions";
import { Servient } from "@node-wot/core";


let servient: Servient;
let wot: typeof WoT;

export const getServient = function(): Servient {
    if (!servient) {
        servient = new Servient();
    }
    return servient;
};

export const getWoT = async function(): Promise<typeof WoT> {
    if (!wot) {
        wot = await getServient().start();
    }
    return wot;
};
