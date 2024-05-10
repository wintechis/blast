import Blast from '@blast/core';
import ConcreteBluetoothAdapter from './WebBluetoothAdapter';
import ConcreteHidAdapter from './WebHidAdapter';

const blast = new Blast(ConcreteBluetoothAdapter, ConcreteHidAdapter);

const getWot = async () => blast.getWot();
const resetServient = async () => blast.resetServient();
const createExposedThing = async (
  td: WoT.ThingDescription,
  id: string | undefined
) => blast.createExposedThing(td, id);
const createThing = async (td: WoT.ThingDescription, id: string | undefined) =>
  blast.createThing(td, id);
const createThingWithHandlers = async (
  td: WoT.ThingDescription,
  id: string | undefined,
  addHandlers: (thing: WoT.ExposedThing) => void
) => blast.createThingWithHandlers(td, id, addHandlers);

export {
  getWot,
  resetServient,
  createExposedThing,
  createThing,
  createThingWithHandlers,
};
