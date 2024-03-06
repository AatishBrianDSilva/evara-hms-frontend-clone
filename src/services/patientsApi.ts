// services/registrationApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../utils/apiConfig";
import { IPaginateOptions } from "../types/types";

export const patientsApi = createApi({
  reducerPath: "patientsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    addPatient: builder.mutation({
      query: (patientData) => ({
        url: "patients/add",
        method: "POST",
        body: patientData,
      }),
    }),
    addPartner: builder.mutation({
      query: ({ partnerData, patientId }) => ({
        url: `patients/${patientId}/partners/add`,
        method: "POST",
        body: partnerData,
      }),
    }),
    getPatients: builder.query({
      query: (options: IPaginateOptions) => {
        const { page, limit, sort, select, lean, leanWithId } = options;
        const queryParams = new URLSearchParams({
          ...(page ? { page: page.toString() } : {}),
          ...(limit ? { limit: limit.toString() } : {}),
          ...(sort ? { sort: JSON.stringify(sort) } : {}),
          ...(select ? { select } : {}),
          ...(lean ? { lean: lean.toString() } : {}),
          ...(leanWithId ? { leanWithId: leanWithId.toString() } : {}),
        }).toString();
        return { url: `patients?${queryParams}`, method: "GET" };
      },
    }),
    getPatientById: builder.query({
      query: (id: string) => {
        return { url: `patients/${id}`, method: "GET" };
      },
    }),
  }),
});

export const {
  useAddPatientMutation,
  useAddPartnerMutation,
  useGetPatientsQuery,
  useGetPatientByIdQuery,
} = patientsApi;
