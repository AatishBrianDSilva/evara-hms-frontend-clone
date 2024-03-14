import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../utils/apiConfig";
import { IQueryOptions } from "../types/types";
import generateQueryParams from "../utils/generateQueryParams";

export const appointmentsApi = createApi({
  reducerPath: "appointmentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Appointments"],
  endpoints: (builder) => ({
    addAppointment: builder.mutation({
      query: (AppointmentData) => ({
        url: "appointments/add",
        method: "POST",
        body: AppointmentData,
      }),
      invalidatesTags: ["Appointments"],
    }),
    updateAppointment: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `appointments/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Appointments", id },
      ],
    }),
    getAppointments: builder.query({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `appointments?${queryParams}`, method: "GET" };
      },
      providesTags: ["Appointments"],
    }),
    getUpcomingAppointments: builder.query({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `appointments/upcoming?${queryParams}`, method: "GET" };
      },
      providesTags: ["Appointments"],
    }),
    getAppointmentById: builder.query({
      query: (id: string) => {
        return { url: `appointments/${id}`, method: "GET" };
      },
      providesTags: ["Appointments"],
    }),
  }),
});

export const {
  useAddAppointmentMutation,
  useGetAppointmentsQuery,
  useGetUpcomingAppointmentsQuery,
  useUpdateAppointmentMutation,
  useGetAppointmentByIdQuery,
} = appointmentsApi;
