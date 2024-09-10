import { createApi } from "@reduxjs/toolkit/query/react";

import generateQueryParams from "../../utils/generateQueryParams";
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from "../../types/global";
import { IPatientProcedure } from "../../types/patientDashboard/procedures";
import { baseQuery } from "../baseQuery";

interface AddPatientProcedurePayload {
  caseId: string;
  patient: string;
  patientCode: string;
  doctor: string;
  procedure: string;
  date: string;
}

export const procedureApi = createApi({
  reducerPath: "procedureApi",
  baseQuery: baseQuery,
  tagTypes: ["Procedure"],
  endpoints: (builder) => ({
    getProcedures: builder.query<
      ApiResponse<PaginatedResponse<IPatientProcedure>>,
      IQueryOptions
    >({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `procedures?${queryParams}`, method: "GET" };
      },
      providesTags: (_result, _error, _args) => ["Procedure"],
    }),
    getProcedureById: builder.query<ApiResponse<IPatientProcedure>, string>({
      query: (id: string) => {
        return { url: `procedures/${id}`, method: "GET" };
      },
      providesTags: (_result, _error, id) => [{ type: "Procedure", id }],
    }),
    addProcedure: builder.mutation<
      ApiResponse<IPatientProcedure>,
      AddPatientProcedurePayload[]
    >({
      query: (procedureData) => ({
        url: "procedures/add",
        method: "POST",
        body: procedureData,
      }),
      invalidatesTags: ["Procedure"],
    }),
    editProcedure: builder.mutation<ApiResponse<IPatientProcedure>, any>({
      query: (procedureData) => ({
        url: `procedures/${procedureData._id}`,
        method: "PUT",
        body: procedureData,
      }),
      invalidatesTags: ["Procedure"],
    }),
    deleteProcedure: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `procedures/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Procedure"],
    }),
  }),
});

export const {
  useAddProcedureMutation,
  useGetProceduresQuery,
  useGetProcedureByIdQuery,
  useEditProcedureMutation,
  useDeleteProcedureMutation,
} = procedureApi;
