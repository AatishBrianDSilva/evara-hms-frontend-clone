// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { patientsApi } from "../services/patientsApi";
import patientsReducer from "../features/Patients/patientsSlice";

import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  // whitelist: ["patients"],
};

const rootReducer = combineReducers({
  [patientsApi.reducerPath]: patientsApi.reducer,
  patients: patientsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // These actions are ignored during serializability checks. It's required by redux-persist
      },
    }).concat(patientsApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
