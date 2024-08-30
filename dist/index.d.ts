declare const getWot: () => Promise<any>;
declare const resetServient: () => Promise<any>;
declare const createExposedThing: (td: WoT.ThingDescription, id: string | undefined) => Promise<any>;
declare const createThing: (td: WoT.ThingDescription, id: string | undefined) => Promise<any>;
declare const createThingWithHandlers: (td: WoT.ThingDescription, id: string | undefined, addHandlers: (thing: WoT.ExposedThing) => void) => Promise<any>;
export { getWot, resetServient, createExposedThing, createThing, createThingWithHandlers, };
