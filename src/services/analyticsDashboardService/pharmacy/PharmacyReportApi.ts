import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { baseQuery } from '../../baseQuery';

export const pharmacyReportApi = createApi({
  reducerPath: 'pharmacyReportApi',
  baseQuery: baseQuery,
  tagTypes: ['Stocks', 'Pharmacy'],
  endpoints: builder => ({
    getPharmacyReport: builder.query<
      ApiResponse<PaginatedResponse<any>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/pharmacy/pharmacy-report?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['Stocks'],
    }),
  }),
});

export const { useGetPharmacyReportQuery } = pharmacyReportApi;
