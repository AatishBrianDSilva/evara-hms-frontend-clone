import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../types/global';
import {
  IPaginatedPharmacyStock,
  IPharmacyStock,
} from '../../types/pharmacyDashboard/stocks';
import generateQueryParams from '../../utils/generateQueryParams';
import { baseQuery } from '../baseQuery';

export const stocksApi = createApi({
  reducerPath: 'stocksApi',
  baseQuery: baseQuery,
  tagTypes: ['Stocks', 'InternalConsumption'],
  endpoints: builder => ({
    getPaginatedStocks: builder.query<
      ApiResponse<PaginatedResponse<IPaginatedPharmacyStock>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/stocks/paginate?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => [
        'Stocks',
        'InternalConsumption',
      ],
    }),
    getStocks: builder.query<ApiResponse<IPharmacyStock[]>, void>({
      query: () => 'pharmacy-dashboard/stocks',
      providesTags: (_result, _error, _args) => [
        'Stocks',
        'InternalConsumption',
      ],
    }),
    getStockById: builder.query<ApiResponse<IPaginatedPharmacyStock>, string>({
      query: id => `pharmacy-dashboard/stocks/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Stocks', id }],
    }),
  }),
});

export const {
  useGetStocksQuery,
  useGetPaginatedStocksQuery,
  useGetStockByIdQuery,
} = stocksApi;
