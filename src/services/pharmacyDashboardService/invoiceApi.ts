import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../types/global';
import { IPharmacyInvoice } from '../../types/pharmacyDashboard/invoices';
import { baseQuery } from '../baseQuery';
import generateQueryParams from '../../utils/generateQueryParams';

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery: baseQuery,
  tagTypes: ['Invoices'],
  endpoints: builder => ({
    getInvoices: builder.query<
      ApiResponse<PaginatedResponse<IPharmacyInvoice>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/invoice?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['Invoices'],
    }),
  }),
});

export const { useGetInvoicesQuery } = invoiceApi;
