import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponse } from '../../types/global';
import { IPharmacyInvoice } from '../../types/pharmacyDashboard/invoices';
import { baseQuery } from '../baseQuery';

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery: baseQuery,
  tagTypes: ['Invoices'],
  endpoints: builder => ({
    getInvoices: builder.query<ApiResponse<IPharmacyInvoice[]>, void>({
      query: () => 'pharmacy-dashboard/invoice',
      providesTags: (_result, _error, _args) => ['Invoices'],
    }),
  }),
});

export const { useGetInvoicesQuery } = invoiceApi;
