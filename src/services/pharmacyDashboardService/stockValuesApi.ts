import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../types/global';
import generateQueryParams from '../../utils/generateQueryParams';
import { baseQuery } from '../baseQuery';

// Shape of a single stock value record
export interface IStockValue {
  locationId: string;
  location: string;
  totalCost: number;
  totalMrp: number;
}

export const stockValuesApi = createApi({
  reducerPath: 'stockValuesApi',
  baseQuery: baseQuery,
  tagTypes: ['Stocks'],
  endpoints: builder => ({
    getStockValues: builder.query<
      ApiResponse<PaginatedResponse<IStockValue>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/stock-values?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['Stocks'],
    }),
  }),
});

export const { useGetStockValuesQuery } = stockValuesApi;
