import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { analyticsBaseQuery } from '../../baseQuery';

// Define the HSN report row type
export interface IHSNReportRow {
  hsnCode: string;
  quantity: number;
  taxableValue: number;
  rateOfTax: number;
  cgst: number;
  sgst: number;
  invoiceValue: number;
}

export const hsnReportsApi = createApi({
  reducerPath: 'hsnReportApi',
  baseQuery: analyticsBaseQuery,
  tagTypes: ['HSNReport'],
  endpoints: builder => ({
    getHSNReports: builder.query<
      ApiResponse<PaginatedResponse<IHSNReportRow>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/billings/hsn-report?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: ['HSNReport'],
    }),
  }),
});

export const { useGetHSNReportsQuery } = hsnReportsApi;
