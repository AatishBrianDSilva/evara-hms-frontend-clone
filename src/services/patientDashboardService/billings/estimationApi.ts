import { createApi } from "@reduxjs/toolkit/query/react";

import generateQueryParams from "../../../utils/generateQueryParams";
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from "../../../types/global";
// import { IPatientCryoPreservation } from "../../types/patientDashboard/cryoPreservations";
import { IPatientBillingEstimation } from "../../../types/patientDashboard/billings";
import { baseQuery } from "../../baseQuery";

interface AddEstimationPayload {
  patientCode: string | null;
  serviceType: string | null;
  items: {
    masterServiceId: string | null;
    doctor: string | null;
    date: Date | null;
  }[];
}

// interface EditEstimationPayload {
//   _id: string | undefined;
//   masterServiceId: string;
//   serviceId: string;
//   serviceName: string;
//   serviceType: string;
//   quantity: 0;
//   taxRate: 0.1;
//   cost: 0.1;
//   estimatedTax: 0.1;
//   estimatedPrice: 0.1;
//   estimatedTotal: 0.1;
// }

export const estimationApi = createApi({
  reducerPath: "estimationApi",
  baseQuery: baseQuery,
  tagTypes: ["Estimations"],
  endpoints: (builder) => ({
    getEstimations: builder.query<
      ApiResponse<PaginatedResponse<IPatientBillingEstimation>>,
      IQueryOptions
    >({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `billings/estimations?${queryParams}`, method: "GET" };
      },
      providesTags: (_result, _error, _args) => ["Estimations"],
    }),
    getEstimationById: builder.query<
      ApiResponse<IPatientBillingEstimation>,
      string
    >({
      query: (id: string) => {
        return { url: `billings/estimations/${id}`, method: "GET" };
      },
      providesTags: (_result, _error, id) => [{ type: "Estimations", id }],
    }),
    addEstimation: builder.mutation<
      ApiResponse<IPatientBillingEstimation>,
      AddEstimationPayload
    >({
      query: (estimationData) => ({
        url: "billings/estimations/add",
        method: "POST",
        body: estimationData,
      }),
      invalidatesTags: ["Estimations"],
    }),
    editEstimation: builder.mutation<
      ApiResponse<IPatientBillingEstimation>,
      any
    >({
      query: (id: string) => ({
        url: `billings/estimations/${id}`,
        method: "PUT",
        body: id,
      }),
      invalidatesTags: ["Estimations"],
    }),
    deleteEstimation: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `billings/estimations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Estimations"],
    }),
  }),
});

export const {
  useAddEstimationMutation,
  useGetEstimationsQuery,
  useGetEstimationByIdQuery,
  useEditEstimationMutation,
  useDeleteEstimationMutation,
} = estimationApi;
