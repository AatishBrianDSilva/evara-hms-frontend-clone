import { createApi } from '@reduxjs/toolkit/query/react';
import generateQueryParams from '../utils/generateQueryParams';
import { ApiResponse, IQueryOptions, PaginatedResponse } from '../types/global';
import { baseQuery } from './baseQuery';
import { IPatient } from '../types/patient';

export const patientsApi = createApi({
  reducerPath: 'patientsApi',
  baseQuery: baseQuery,
  tagTypes: ['Patient'],
  endpoints: builder => ({
    addPatient: builder.mutation({
      query: patientData => ({
        url: 'patients/add',
        method: 'POST',
        body: patientData,
      }),
      invalidatesTags: ['Patient'],
    }),
    updatePatient: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `patients/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Patient', id }],
    }),
    addPartner: builder.mutation({
      query: ({ partnerData, patientId }) => ({
        url: `patients/${patientId}/partner/add`,
        method: 'POST',
        body: partnerData,
      }),
      invalidatesTags: ['Patient'],
    }),
    getPatients: builder.query<
      ApiResponse<PaginatedResponse<IPatient>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `patients?${queryParams}`, method: 'GET' };
      },
      providesTags: ['Patient'],
    }),
    getPatientById: builder.query({
      query: (id: string) => {
        return { url: `patients/${id}`, method: 'GET' };
      },
      providesTags: ['Patient'],
    }),
    deletePatient: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `patients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Patient'],
    }),
  }),
});

export const {
  useAddPatientMutation,
  useAddPartnerMutation,
  useGetPatientsQuery,
  useUpdatePatientMutation,
  useGetPatientByIdQuery,
  useDeletePatientMutation,
} = patientsApi;
