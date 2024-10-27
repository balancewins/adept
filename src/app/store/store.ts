import { combineReducers, configureStore } from "@reduxjs/toolkit";

import {
  companiesListReducers,
  initialState as companiesListInitialState,
} from "../pages/companies-list";

export const rootReducer = combineReducers({
  companiesList: companiesListReducers,
});

export const store = configureStore({
  preloadedState: {
    companiesList: companiesListInitialState,
  },
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
