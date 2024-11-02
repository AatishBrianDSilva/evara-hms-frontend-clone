import { createApi } from '@reduxjs/toolkit/query/react';
import generateQueryParams from '../utils/generateQueryParams';
import { ApiResponse, IQueryOptions, PaginatedResponse } from '../types/global';
import { IDoctor } from '../types/doctor';
import { baseQuery } from './baseQuery';

export const doctorsApi = createApi({
  reducerPath: 'doctorsApi',
  baseQuery: baseQuery,
  tagTypes: ['Doctors'],
  endpoints: builder => ({
    addDoctor: builder.mutation({
      query: doctorData => ({
        url: 'master/doctors/add',
        method: 'POST',
        body: doctorData,
      }),
      invalidatesTags: ['Doctors'],
    }),
    updateDoctor: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `master/doctors/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Doctors'],
    }),
    getDoctors: builder.query<
      ApiResponse<PaginatedResponse<IDoctor>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `master/doctors?${queryParams}`, method: 'GET' };
      },
      providesTags: ['Doctors'],
    }),
    getDoctorById: builder.query<ApiResponse<IDoctor>, string>({
      query: id => {
        return { url: `master/doctors/${id}`, method: 'GET' };
      },
      providesTags: ['Doctors'],
    }),
    deleteDoctor: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/doctors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Doctors'],
    }),
  }),
});

export const {
  useAddDoctorMutation,
  useGetDoctorsQuery,
  useUpdateDoctorMutation,
  useGetDoctorByIdQuery,
  useDeleteDoctorMutation,
} = doctorsApi;
