import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { baseQuery } from '../../baseQuery';

interface Refund {
  _id: string;
  refundDetails: {
    refundDate?: string;
    refundAmount?: number;
    reason?: string;
    method?: string;
    files?: string[];
  };
  createdAt: string;
  patientCode?: string;
  patientName?: string;
}

// Define the refund reports API
export const refundReportsApi = createApi({
  reducerPath: 'refundReportsApi',
  baseQuery: baseQuery,
  tagTypes: ['Refunds'],
  endpoints: builder => ({
    getRefundReports: builder.query<
      ApiResponse<PaginatedResponse<Refund>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `analytics/refundReports?${queryParams}`, method: 'GET' };
      },
      providesTags: (_result, _error, _args) => ['Refunds'],
    }),
  }),
});

export const { useGetRefundReportsQuery } = refundReportsApi;
