import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { analyticsBaseQuery } from '../../baseQuery';

export const internalConsumptionReportApi = createApi({
  reducerPath: 'internalConsumptionReportApi',
  baseQuery: analyticsBaseQuery,
  tagTypes: ['Stocks'],
  endpoints: builder => ({
    getInternalConsumptionReport: builder.query<
      ApiResponse<PaginatedResponse<any>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/pharmacy/internal-consumption?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['Stocks'],
    }),
  }),
});

export const { useGetInternalConsumptionReportQuery } =
  internalConsumptionReportApi;
