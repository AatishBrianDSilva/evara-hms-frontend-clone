import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { analyticsBaseQuery } from '../../baseQuery';

export const purchaseOrderReportApi = createApi({
  reducerPath: 'purchaseOrderReportApi',
  baseQuery: analyticsBaseQuery,
  tagTypes: ['Stocks', 'PurchaseOrder'],
  endpoints: builder => ({
    getPurchaseOrderReport: builder.query<
      ApiResponse<PaginatedResponse<any>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/pharmacy/purchase-order-report?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['Stocks'],
    }),
  }),
});

export const { useGetPurchaseOrderReportQuery } = purchaseOrderReportApi;
