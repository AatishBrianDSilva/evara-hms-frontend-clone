import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../utils/apiConfig";
import { IQueryOptions } from "../types/types";
import generateQueryParams from "../utils/generateQueryParams";

export const patientsApi = createApi({
  reducerPath: "patientsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Patient"],
  endpoints: (builder) => ({
    addPatient: builder.mutation({
      query: (patientData) => ({
        url: "patients/add",
        method: "POST",
        body: patientData,
      }),
      invalidatesTags: ["Patient"],
    }),
    updatePatient: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `patients/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Patient", id }],
    }),
    addPartner: builder.mutation({
      query: ({ partnerData, patientId }) => ({
        url: `patients/${patientId}/partner/add`,
        method: "POST",
        body: partnerData,
      }),
      invalidatesTags: ["Patient"],
    }),
    getPatients: builder.query({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `patients?${queryParams}`, method: "GET" };
      },
      providesTags: ["Patient"],
    }),
    getPatientById: builder.query({
      query: (id: string) => {
        return { url: `patients/${id}`, method: "GET" };
      },
      providesTags: ["Patient"],
    }),
  }),
});

export const {
  useAddPatientMutation,
  useAddPartnerMutation,
  useGetPatientsQuery,
  useUpdatePatientMutation,
  useGetPatientByIdQuery,
} = patientsApi;
