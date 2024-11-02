import { createApi } from '@reduxjs/toolkit/query/react';
import generateQueryParams from '../../../utils/generateQueryParams';
import { ApiResponse, IQueryOptions } from '../../../types/global';
import { IPatientSource } from '../../../types/masterDashboard/local';
import { baseQuery } from '../../baseQuery';

export const patientSourcesApi = createApi({
  reducerPath: 'patientSourcesApi',
  baseQuery: baseQuery,
  tagTypes: ['PatientSources'],
  endpoints: builder => ({
    addPatientSource: builder.mutation({
      query: patientSourceData => ({
        url: 'master/patient/source/add',
        method: 'POST',
        body: patientSourceData,
      }),
      invalidatesTags: ['PatientSources'],
    }),
    updatePatientSource: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `master/patient/source/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['PatientSources'],
    }),
    getPatientSources: builder.query<
      ApiResponse<IPatientSource[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `master/patient/source?${queryParams}`, method: 'GET' };
      },
      providesTags: ['PatientSources'],
    }),
    getPatientSourceById: builder.query<ApiResponse<IPatientSource>, string>({
      query: id => {
        return { url: `master/patient/source/${id}`, method: 'GET' };
      },
      providesTags: ['PatientSources'],
    }),
    deletePatientSource: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/patient/source/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PatientSources'],
    }),
  }),
});

export const {
  useAddPatientSourceMutation,
  useGetPatientSourcesQuery,
  useUpdatePatientSourceMutation,
  useGetPatientSourceByIdQuery,
  useDeletePatientSourceMutation,
} = patientSourcesApi;
