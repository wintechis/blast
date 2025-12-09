declare const getWot: () => Promise<any>;
declare const resetServient: () => Promise<any>;
declare const createExposedThing: (td: WoT.ThingDescription, id: string | undefined) => Promise<any>;
declare const createThing: (td: WoT.ThingDescription, id: string | undefined) => Promise<any>;
declare const createThingWithHandlers: (td: WoT.ThingDescription, id: string | undefined, addHandlers: (thing: WoT.ExposedThing) => void) => Promise<any>;
declare const _default: {
    getWot: () => Promise<any>;
    resetServient: () => Promise<any>;
    createExposedThing: (td: WoT.ThingDescription, id: string | undefined) => Promise<any>;
    createThing: (td: WoT.ThingDescription, id: string | undefined) => Promise<any>;
    createThingWithHandlers: (td: WoT.ThingDescription, id: string | undefined, addHandlers: (thing: WoT.ExposedThing) => void) => Promise<any>;
};
export default _default;
export { getWot, resetServient, createExposedThing, createThing, createThingWithHandlers, };
