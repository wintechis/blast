import {configureStore} from '@reduxjs/toolkit';

import connectedReducer from './connectedThingsReducers';

interface ThingsStoreState {
  connectedThings: ReturnType<typeof connectedReducer>;
}

const reducer = {
  connectedThings: connectedReducer,
};

const preloadedState: ThingsStoreState = {
  connectedThings: [],
};

export const thingsStore = configureStore({
  reducer,
  preloadedState,
});

export type RootState = ReturnType<typeof thingsStore.getState>;
export type AppDispatch = typeof thingsStore.dispatch;
