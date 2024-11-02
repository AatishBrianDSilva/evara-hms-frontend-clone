import { createApi } from '@reduxjs/toolkit/query/react';
import generateQueryParams from '../utils/generateQueryParams';
import { IQueryOptions, ApiResponse, PaginatedResponse } from '../types/global';
import { baseQuery } from './baseQuery';
import { IAppointment } from '../types/appointment';

export const appointmentsApi = createApi({
  reducerPath: 'appointmentsApi',
  baseQuery: baseQuery,
  tagTypes: ['Appointments'],
  endpoints: builder => ({
    addAppointment: builder.mutation({
      query: AppointmentData => ({
        url: 'appointments/add',
        method: 'POST',
        body: AppointmentData,
      }),
      invalidatesTags: ['Appointments'],
    }),
    updateAppointment: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `appointments/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Appointments'],
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `appointments/${id}/status`,
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: ['Appointments'],
    }),
    getAppointments: builder.query<
      ApiResponse<PaginatedResponse<IAppointment>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `appointments?${queryParams}`, method: 'GET' };
      },
      providesTags: ['Appointments'],
    }),
    getUpcomingAppointments: builder.query({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `appointments/upcoming?${queryParams}`, method: 'GET' };
      },
      providesTags: ['Appointments'],
    }),
    getAppointmentById: builder.query({
      query: (id: string) => {
        return { url: `appointments/${id}`, method: 'GET' };
      },
      providesTags: ['Appointments'],
    }),
    deleteAppointment: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `appointments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Appointments'],
    }),
  }),
});

export const {
  useAddAppointmentMutation,
  useGetAppointmentsQuery,
  useGetUpcomingAppointmentsQuery,
  useUpdateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useGetAppointmentByIdQuery,
  useDeleteAppointmentMutation,
} = appointmentsApi;
