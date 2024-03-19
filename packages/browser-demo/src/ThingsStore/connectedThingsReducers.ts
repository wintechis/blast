import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {implementedThing} from './types';

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
    clear: () => initialState,
  },
});

export const {add, remove} = connectedThingsSlice.actions;

export default connectedThingsSlice.reducer;
