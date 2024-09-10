import { createApi } from "@reduxjs/toolkit/query/react";

import generateQueryParams from "../../utils/generateQueryParams";
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from "../../types/global";
import { IPatientCryoPreservation } from "../../types/patientDashboard/cryoPreservations";
import { baseQuery } from "../baseQuery";

interface AddPatientCryoPreservationPayload {
  caseId: string;
  patient: string;
  patientCode: string;
  doctor: string;
  cryo: string;
  date: string;
}

export const cryoPreservationApi = createApi({
  reducerPath: "cryoPreservationApi",
  baseQuery: baseQuery,
  tagTypes: ["CryoPreservation"],
  endpoints: (builder) => ({
    getCryoPreservations: builder.query<
      ApiResponse<PaginatedResponse<IPatientCryoPreservation>>,
      IQueryOptions
    >({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `cryo-preservations?${queryParams}`, method: "GET" };
      },
      providesTags: (_result, _error, _args) => ["CryoPreservation"],
    }),
    getCryoPreservationById: builder.query<
      ApiResponse<IPatientCryoPreservation>,
      string
    >({
      query: (id: string) => {
        return { url: `cryo-preservations/${id}`, method: "GET" };
      },
      providesTags: (_result, _error, id) => [{ type: "CryoPreservation", id }],
    }),
    addCryoPreservation: builder.mutation<
      ApiResponse<IPatientCryoPreservation>,
      AddPatientCryoPreservationPayload[]
    >({
      query: (cryoPreservationData) => ({
        url: "cryo-preservations/add",
        method: "POST",
        body: cryoPreservationData,
      }),
      invalidatesTags: ["CryoPreservation"],
    }),
    editCryoPreservation: builder.mutation<
      ApiResponse<IPatientCryoPreservation>,
      any
    >({
      query: (cryoPreservationData) => ({
        url: `cryo-preservations/${cryoPreservationData._id}`,
        method: "PUT",
        body: cryoPreservationData,
      }),
      invalidatesTags: ["CryoPreservation"],
    }),
    deleteCryoPreservation: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `cryo-preservations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CryoPreservation"],
    }),
  }),
});

export const {
  useAddCryoPreservationMutation,
  useGetCryoPreservationsQuery,
  useGetCryoPreservationByIdQuery,
  useEditCryoPreservationMutation,
  useDeleteCryoPreservationMutation,
} = cryoPreservationApi;
