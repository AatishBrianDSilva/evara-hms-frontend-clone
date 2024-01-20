// store.js
import { configureStore } from "@reduxjs/toolkit";
import { ivfRegistrationApi } from "../services/ivfRegistrationApi";
import ivfRegistrationReducer from "../features/IVFRegistration/ivfRegistrationSlice";

export const store = configureStore({
  reducer: {
    // Add your reducers here
    [ivfRegistrationApi.reducerPath]: ivfRegistrationApi.reducer,
    ivfRegistration: ivfRegistrationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ivfRegistrationApi.middleware),
});
