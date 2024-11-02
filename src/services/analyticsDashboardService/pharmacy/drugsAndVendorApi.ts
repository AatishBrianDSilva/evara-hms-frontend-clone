import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { baseQuery } from '../../baseQuery';

export const drugsAndVendorApi = createApi({
  reducerPath: 'drugsAndVendorApi',
  baseQuery: baseQuery,
  tagTypes: ['Billing'],
  endpoints: builder => ({
    getDrugsAndVendor: builder.query<
      ApiResponse<PaginatedResponse<any>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/pharmacy/drugs-and-vendor?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['Billing'],
    }),
  }),
});

export const { useGetDrugsAndVendorQuery } = drugsAndVendorApi;
