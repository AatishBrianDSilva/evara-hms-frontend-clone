import { createApi } from "@reduxjs/toolkit/query/react";
import generateQueryParams from "../../../utils/generateQueryParams";
import { ApiResponse, IQueryOptions } from "../../../types/global";
import { IAppointmentSource } from "../../../types/masterDashboard/local";
import { baseQuery } from "../../baseQuery";

export const appointmentSourcesApi = createApi({
  reducerPath: "appointmentSourcesApi",
  baseQuery: baseQuery,
  tagTypes: ["AppointmentSources"],
  endpoints: (builder) => ({
    addAppointmentSource: builder.mutation({
      query: (appointmentSourceData) => ({
        url: "master/appointment/source/add",
        method: "POST",
        body: appointmentSourceData,
      }),
      invalidatesTags: ["AppointmentSources"],
    }),
    updateAppointmentSource: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `master/appointment/source/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["AppointmentSources"],
    }),
    getAppointmentSources: builder.query<ApiResponse<IAppointmentSource[]>, IQueryOptions>({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return { url: `master/appointment/source?${queryParams}`, method: "GET" };
      },
      providesTags: ["AppointmentSources"],
    }),
    getAppointmentSourceById: builder.query<ApiResponse<IAppointmentSource>, string>({
      query: (id) => {
        return { url: `master/appointment/source/${id}`, method: "GET" };
      },
      providesTags: ["AppointmentSources"],
    }),
    deleteAppointmentSource: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/appointment/source/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AppointmentSources"],
    }),
  }),
});

export const {
  useAddAppointmentSourceMutation,
  useGetAppointmentSourcesQuery,
  useUpdateAppointmentSourceMutation,
  useGetAppointmentSourceByIdQuery,
  useDeleteAppointmentSourceMutation,
} = appointmentSourcesApi;
