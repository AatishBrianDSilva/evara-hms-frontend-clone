import { createApi } from "@reduxjs/toolkit/query/react";

import generateQueryParams from "../../utils/generateQueryParams";
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from "../../types/global";
import { IPatientService } from "../../types/patientDashboard/service";
import { baseQuery } from "../baseQuery";

interface AddPatientServicePayload {
  caseId: string;
  patient: string;
  patientCode: string;
  doctor: string;
  service: string;
  date: string;
}

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: baseQuery,
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    getServices: builder.query<
      ApiResponse<PaginatedResponse<IPatientService>>,
      IQueryOptions
    >({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `services?${queryParams}`, method: "GET" };
      },
      providesTags: (_result, _error, _args) => ["Service"],
    }),
    getServiceById: builder.query<ApiResponse<IPatientService>, string>({
      query: (id: string) => {
        return { url: `services/${id}`, method: "GET" };
      },
      providesTags: (_result, _error, id) => [{ type: "Service", id }],
    }),
    addService: builder.mutation<
      ApiResponse<IPatientService>,
      AddPatientServicePayload[]
    >({
      query: (serviceData) => ({
        url: "services/add",
        method: "POST",
        body: serviceData,
      }),
      invalidatesTags: ["Service"],
    }),
    editService: builder.mutation<ApiResponse<IPatientService>, any>({
      query: (serviceData) => ({
        url: `services/${serviceData._id}`,
        method: "PUT",
        body: serviceData,
      }),
      invalidatesTags: ["Service"],
    }),
    deleteService: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useAddServiceMutation,
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useEditServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;
