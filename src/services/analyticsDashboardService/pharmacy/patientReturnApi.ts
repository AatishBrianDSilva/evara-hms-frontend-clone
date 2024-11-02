import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { baseQuery } from '../../baseQuery';

export const patientReturnApi = createApi({
  reducerPath: 'patientReturnApi',
  baseQuery: baseQuery,
  tagTypes: ['PatientReturn', 'Stocks'], // Change this to reflect the appropriate tags
  endpoints: builder => ({
    getPatientReturn: builder.query<
      ApiResponse<PaginatedResponse<any>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/pharmacy/patient-return?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['PatientReturn', 'Stocks'],
    }),
  }),
});

export const { useGetPatientReturnQuery } = patientReturnApi;
