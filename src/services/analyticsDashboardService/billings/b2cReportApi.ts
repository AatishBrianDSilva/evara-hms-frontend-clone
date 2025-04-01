import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { analyticsBaseQuery } from '../../baseQuery';

// Define the B2C report row type
export interface IB2CReportRow {
  date: string;
  invoiceNo: string;
  taxableValue: number;
  rateOfTax: number;
  cgst: number;
  sgst: number;
  discount: number;
  invoiceValue: number;
  hsnCode: string;
}

export const b2cReportsApi = createApi({
  reducerPath: 'b2cReportsApi',
  baseQuery: analyticsBaseQuery,
  tagTypes: ['B2CReport'],
  endpoints: builder => ({
    getB2CReports: builder.query<
      ApiResponse<PaginatedResponse<IB2CReportRow>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/billings/b2c-report?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: ['B2CReport'],
    }),
  }),
});

export const { useGetB2CReportsQuery } = b2cReportsApi;
