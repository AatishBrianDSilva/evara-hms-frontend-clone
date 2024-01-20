// services/registrationApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../utils/apiConfig";

export const ivfRegistrationApi = createApi({
  reducerPath: "registrationApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL + "/dev" }),
  endpoints: (builder) => ({
    addPatient: builder.mutation({
      query: (patientData) => ({
        url: "patients/add",
        method: "POST",
        body: patientData,
      }),
    }),
    // You can add more endpoints here
  }),
});

export const { useAddPatientMutation } = ivfRegistrationApi;
