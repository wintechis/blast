import {Blast, EddystoneHelpers} from '@blast/core';
import ConcreteBluetoothAdapter from './WebBluetoothAdapter';
import ConcreteHidAdapter from './WebHidAdapter';

const blast = new Blast(ConcreteBluetoothAdapter, ConcreteHidAdapter);

const getServient = async () => blast.getServient();
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

// Every name here has to stay in step with what the demo's Blockly generators destructure
// off `blastCore` in the code they emit - they resolve at runtime against this bundle, so a
// missing export is not a build error, just `undefined` when the block runs.
export default {
  getServient,
  getWot,
  resetServient,
  createExposedThing,
  createThing,
  createThingWithHandlers,
  EddystoneHelpers,
};

export {
  getServient,
  getWot,
  resetServient,
  createExposedThing,
  createThing,
  createThingWithHandlers,
  EddystoneHelpers,
};
