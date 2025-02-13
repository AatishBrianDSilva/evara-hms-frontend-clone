import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { analyticsBaseQuery } from '../../baseQuery';

export const expiryDetailsApi = createApi({
  reducerPath: 'expiryDetailsApi',
  baseQuery: analyticsBaseQuery,
  tagTypes: ['Stocks'],
  endpoints: builder => ({
    getExpiryDetails: builder.query<
      ApiResponse<PaginatedResponse<any>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/pharmacy/expiry-details?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['Stocks'],
    }),
  }),
});

export const { useGetExpiryDetailsQuery } = expiryDetailsApi;
