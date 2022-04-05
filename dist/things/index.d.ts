import * as WoT from 'wot-typescript-definitions';
import { Servient } from '@node-wot/core';
export declare const getServient: () => Servient;
export declare const getWot: () => Promise<typeof WoT>;
export declare const getThing: (td: WoT.ThingDescription) => Promise<WoT.ExposedThing>;
export declare const removeThing: (td: WoT.ThingDescription) => Promise<void>;
/**
 * Endocdes json data to use it as parameter in a Thing affordance.
 * @param {JSON} data the data to encode
 */
export declare const encodeJson: (data: JSON) => ReadableStream;
