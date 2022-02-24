import * as WoT from 'wot-typescript-definitions';
import { Servient } from '@node-wot/core';
export declare const getServient: () => Servient;
export declare const getWoT: () => Promise<typeof WoT>;
export declare const getThing: (td: any) => Promise<WoT.ExposedThing>;
