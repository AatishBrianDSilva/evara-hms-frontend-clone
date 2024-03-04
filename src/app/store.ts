// store.js
import { configureStore } from "@reduxjs/toolkit";
import { patientsApi } from "../services/patientsApi";
import patientsReducer from "../features/Patients/patientsSlice";

export const store = configureStore({
  reducer: {
    [patientsApi.reducerPath]: patientsApi.reducer,
    patients: patientsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(patientsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
