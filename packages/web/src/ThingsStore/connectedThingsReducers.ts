import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type thingType =
  | 'audio'
  | 'bluetooth'
  | 'hid'
  | 'gamepad'
  | 'video'
  | 'consumedDevice';

interface GamepadFilter {
  index?: number;
  id?: string;
  connected?: boolean;
  mapping?: string;
  timestamp?: number;
  axes?: number[];
  buttons?: {length: number};
}

export interface implementedThing {
  id: string;
  name: string;
  type: thingType;
  blocks: {type: string; category: string; XML?: string}[];
  filters?: BluetoothLEScanFilter[] | HIDDeviceFilter[] | GamepadFilter[];
  optionalServices?: string[];
  infoUrl?: string;
  connected?: boolean;
}

const initialState: {id: string; connectedThing: implementedThing}[] = [];

export const connectedThingsSlice = createSlice({
  name: 'connectedThings',
  initialState,
  reducers: {
    add: (
      state,
      action: PayloadAction<{name: string; thing: implementedThing}>
    ) => {
      const {name, thing} = action.payload;
      state.push({id: name, connectedThing: thing});
    },
    remove: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(thing => thing.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const {add, remove} = connectedThingsSlice.actions;

export default connectedThingsSlice.reducer;
