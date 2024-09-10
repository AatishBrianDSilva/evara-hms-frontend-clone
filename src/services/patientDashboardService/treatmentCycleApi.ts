import { createApi } from "@reduxjs/toolkit/query/react";

import generateQueryParams from "../../utils/generateQueryParams";
import { ApiResponse, IQueryOptions } from "../../types/global";
import { IPatientTreatmentCycle } from "../../types/patientDashboard/treatmentCycle";
import { baseQuery } from "../baseQuery";

interface AddPatientTreatmentCyclePayload {
  caseId: string;
  patient: string;
  patientCode: string;
  doctor: string;
  cycle: string;
  date: string;
}

interface IEditTreatmentCyclePayload {
  payload: {
    id: string;
    details: any;
    documentId: string;
  };
  options: IQueryOptions;
}

export const treatmentCycleApi = createApi({
  reducerPath: "treatmentCycleApi",
  baseQuery: baseQuery,
  tagTypes: ["TreatmentCycle"],
  endpoints: (builder) => ({
    getTreatmentCycles: builder.query<
      ApiResponse<IPatientTreatmentCycle[]>,
      IQueryOptions
    >({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `treatment-cycles?${queryParams}`, method: "GET" };
      },
      providesTags: (_result, _error, _args) => ["TreatmentCycle"],
    }),
    getTreatmentCycleById: builder.query<
      ApiResponse<IPatientTreatmentCycle>,
      string
    >({
      query: (id: string) => {
        return { url: `treatment-cycles/${id}`, method: "GET" };
      },
      providesTags: (_result, _error, id) => [{ type: "TreatmentCycle", id }],
    }),
    addTreatmentCycle: builder.mutation<
      ApiResponse<IPatientTreatmentCycle>,
      AddPatientTreatmentCyclePayload[]
    >({
      query: (treatmentCycleData) => ({
        url: "treatment-cycles/add",
        method: "POST",
        body: treatmentCycleData,
      }),
      invalidatesTags: ["TreatmentCycle"],
    }),
    editTreatmentCycle: builder.mutation<
      ApiResponse<IPatientTreatmentCycle>,
      IEditTreatmentCyclePayload
    >({
      query: ({ payload, options }) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `treatment-cycles/${payload.id}?${queryParams}`,
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags: ["TreatmentCycle"],
    }),
    deleteTreatmentCycle: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `treatment-cycles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TreatmentCycle"],
    }),
  }),
});

export const {
  useAddTreatmentCycleMutation,
  useGetTreatmentCyclesQuery,
  useGetTreatmentCycleByIdQuery,
  useEditTreatmentCycleMutation,
  useDeleteTreatmentCycleMutation,
} = treatmentCycleApi;
