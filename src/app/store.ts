// store.js
import { configureStore } from "@reduxjs/toolkit";
import { ivfRegistrationApi } from "../services/ivfRegistrationApi";
import ivfRegistrationReducer from "../features/IVFRegistration/ivfRegistrationSlice";
import moreReducer from "../features/More/moreSlice";
import patientsReducer from "../features/Patients/patientsSlice";

export const store = configureStore({
  reducer: {
    // Add your reducers here
    [ivfRegistrationApi.reducerPath]: ivfRegistrationApi.reducer,
    ivfRegistration: ivfRegistrationReducer,
    more: moreReducer,
    patients: patientsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ivfRegistrationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
