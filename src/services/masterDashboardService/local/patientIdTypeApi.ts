import { createApi } from '@reduxjs/toolkit/query/react';
import generateQueryParams from '../../../utils/generateQueryParams';
import { ApiResponse, IQueryOptions } from '../../../types/global';
import { IPatientIdType } from '../../../types/masterDashboard/local';
import { baseQuery } from '../../baseQuery';

export const patientIdTypesApi = createApi({
  reducerPath: 'patientIdTypesApi',
  baseQuery: baseQuery,
  tagTypes: ['PatientIdTypes'],
  endpoints: builder => ({
    addPatientIdType: builder.mutation({
      query: patientIdTypeData => ({
        url: 'master/patient/id-type/add',
        method: 'POST',
        body: patientIdTypeData,
      }),
      invalidatesTags: ['PatientIdTypes'],
    }),
    updatePatientIdType: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `master/patient/id-type/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['PatientIdTypes'],
    }),
    getPatientIdTypes: builder.query<
      ApiResponse<IPatientIdType[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `master/patient/id-type?${queryParams}`, method: 'GET' };
      },
      providesTags: ['PatientIdTypes'],
    }),
    getPatientIdTypeById: builder.query<ApiResponse<IPatientIdType>, string>({
      query: id => {
        return { url: `master/patient/id-type/${id}`, method: 'GET' };
      },
      providesTags: ['PatientIdTypes'],
    }),
    deletePatientIdType: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/patient/id-type/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PatientIdTypes'],
    }),
  }),
});

export const {
  useAddPatientIdTypeMutation,
  useGetPatientIdTypesQuery,
  useUpdatePatientIdTypeMutation,
  useGetPatientIdTypeByIdQuery,
  useDeletePatientIdTypeMutation,
} = patientIdTypesApi;
