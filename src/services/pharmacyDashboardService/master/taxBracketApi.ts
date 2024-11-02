import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { ITaxRate } from '../../../types/pharmacyDashboard/master';
import { baseQuery } from '../../baseQuery';

interface AddTaxBracketPayload {
  taxRate: number | string;
  notes?: string;
}

interface EditTaxBracketPayload {
  id: string;
  taxRate: number | string;
  notes?: string;
}

export const taxBracketApi = createApi({
  reducerPath: 'taxBracketApi',
  baseQuery: baseQuery,
  tagTypes: ['TaxBracket'],
  endpoints: builder => ({
    addTaxBracket: builder.mutation<
      ApiResponse<ITaxRate>,
      AddTaxBracketPayload
    >({
      query: taxBracketData => ({
        url: 'pharmacy-dashboard/master/tax-rates/add',
        method: 'POST',
        body: taxBracketData,
      }),
      invalidatesTags: ['TaxBracket'],
    }),
    editTaxBracket: builder.mutation<
      ApiResponse<ITaxRate>,
      EditTaxBracketPayload
    >({
      query: taxBracketData => ({
        url: `pharmacy-dashboard/master/tax-rates/${taxBracketData.id}`,
        method: 'PUT',
        body: taxBracketData,
      }),
      invalidatesTags: ['TaxBracket'],
    }),
    deleteTaxBracket: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `pharmacy-dashboard/master/tax-rates/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['TaxBracket'],
    }),
    getTaxBrackets: builder.query<
      ApiResponse<PaginatedResponse<ITaxRate>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/master/tax-rates?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['TaxBracket'],
    }),
    getTaxBracketById: builder.query<ApiResponse<ITaxRate>, string>({
      query: id => `pharmacy-dashboard/master/tax-rates/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'TaxBracket', id }],
    }),
  }),
});

export const {
  useAddTaxBracketMutation,
  useEditTaxBracketMutation,
  useDeleteTaxBracketMutation,
  useGetTaxBracketsQuery,
  useGetTaxBracketByIdQuery,
} = taxBracketApi;
