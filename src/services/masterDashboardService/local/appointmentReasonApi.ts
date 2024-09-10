import { createApi } from "@reduxjs/toolkit/query/react";
import generateQueryParams from "../../../utils/generateQueryParams";
import { ApiResponse, IQueryOptions } from "../../../types/global";
import { IAppointmentReason } from "../../../types/masterDashboard/local";
import { baseQuery } from "../../baseQuery";

export const appointmentReasonsApi = createApi({
  reducerPath: "appointmentReasonsApi",
  baseQuery: baseQuery,
  tagTypes: ["AppointmentReasons"],
  endpoints: (builder) => ({
    addAppointmentReason: builder.mutation({
      query: (appointmentReasonData) => ({
        url: "master/appointment/reason/add",
        method: "POST",
        body: appointmentReasonData,
      }),
      invalidatesTags: ["AppointmentReasons"],
    }),
    updateAppointmentReason: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `master/appointment/reason/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["AppointmentReasons"],
    }),
    getAppointmentReasons: builder.query<ApiResponse<IAppointmentReason[]>, IQueryOptions>({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return { url: `master/appointment/reason?${queryParams}`, method: "GET" };
      },
      providesTags: ["AppointmentReasons"],
    }),
    getAppointmentReasonById: builder.query<ApiResponse<IAppointmentReason>, string>({
      query: (id) => {
        return { url: `master/appointment/reason/${id}`, method: "GET" };
      },
      providesTags: ["AppointmentReasons"],
    }),
    deleteAppointmentReason: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/appointment/reason/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AppointmentReasons"],
    }),
  }),
});

export const {
  useAddAppointmentReasonMutation,
  useGetAppointmentReasonsQuery,
  useUpdateAppointmentReasonMutation,
  useGetAppointmentReasonByIdQuery,
  useDeleteAppointmentReasonMutation,
} = appointmentReasonsApi;
