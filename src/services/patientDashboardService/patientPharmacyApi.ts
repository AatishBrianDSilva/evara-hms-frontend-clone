import { createApi } from "@reduxjs/toolkit/query/react";

import generateQueryParams from "../../utils/generateQueryParams";
import { ApiResponse, IQueryOptions, PaginatedResponse } from "../../types/global";
import { IPatientPharmacy } from "../../types/patientDashboard/patientPharmacy";
import { baseQuery } from "../baseQuery";

interface AddPatientPharmacyPayload {
  doctor: string | null | undefined;
  date: Date | null | undefined;
  items: {
    stock: string | null | undefined;
    details: {
      location: string | null | undefined;
      quantity: number;
      batchNumber: string | null | undefined;
    }[];
  }[];
  patient: string;
}

export const patientPharmacyApi = createApi({
  reducerPath: "patientPharmacyApi",
  baseQuery: baseQuery,
  tagTypes: ["PatientPharmacy"],
  endpoints: (builder) => ({
    getPatientPharmacys: builder.query<
      ApiResponse<PaginatedResponse<IPatientPharmacy>>,
      { options?: IQueryOptions; id: string }
    >({
      query: ({ options, id }) => {
        const queryParams = generateQueryParams(options);
        return { url: `pharmacy/${id}?${queryParams}`, method: "GET" };
      },
      providesTags: (_result, _error, _args) => ["PatientPharmacy"],
    }),
    getPatientPharmacyById: builder.query<ApiResponse<IPatientPharmacy>, string>({
      query: (id: string) => {
        return { url: `pharmacy/patient/${id}`, method: "GET" };
      },
      providesTags: (_result, _error, id) => [{ type: "PatientPharmacy", id }],
    }),
    addPatientPharmacy: builder.mutation<ApiResponse<IPatientPharmacy>, AddPatientPharmacyPayload>({
      query: (patientPharmacyData) => ({
        url: "pharmacy/add",
        method: "POST",
        body: patientPharmacyData,
      }),
      invalidatesTags: ["PatientPharmacy"],
    }),
    deletePatientPharmacy: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `pharmacy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PatientPharmacy"],
    }),

    getAllPharmacy: builder.query<any, void>({
      query: () => {
        return { url: `pharmacy/all`, method: "GET" };
      },
      providesTags: (_result, _error, _args) => ["PatientPharmacy"],
    }),
  }),
});

export const {
  useAddPatientPharmacyMutation,
  useGetPatientPharmacysQuery,
  useGetPatientPharmacyByIdQuery,
  useDeletePatientPharmacyMutation,
  useGetAllPharmacyQuery,
} = patientPharmacyApi;
