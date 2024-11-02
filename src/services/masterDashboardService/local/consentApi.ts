import { createApi } from '@reduxjs/toolkit/query/react';
import generateQueryParams from '../../../utils/generateQueryParams';
import { ApiResponse, IQueryOptions } from '../../../types/global';
import { IConsent } from '../../../types/masterDashboard/local';
import { baseQuery } from '../../baseQuery';

export const consentsApi = createApi({
  reducerPath: 'consentsApi',
  baseQuery: baseQuery,
  tagTypes: ['Consents'],
  endpoints: builder => ({
    addConsent: builder.mutation({
      query: consentData => ({
        url: 'master/consents/add',
        method: 'POST',
        body: consentData,
      }),
      invalidatesTags: ['Consents'],
    }),
    updateConsent: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `master/consents/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Consents'],
    }),
    getConsents: builder.query<ApiResponse<IConsent[]>, IQueryOptions>({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `master/consents?${queryParams}`, method: 'GET' };
      },
      providesTags: ['Consents'],
    }),
    getConsentById: builder.query<ApiResponse<IConsent>, string>({
      query: id => {
        return { url: `master/consents/${id}`, method: 'GET' };
      },
      providesTags: ['Consents'],
    }),
    deleteConsent: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/consents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Consents'],
    }),
  }),
});

export const {
  useAddConsentMutation,
  useGetConsentsQuery,
  useUpdateConsentMutation,
  useGetConsentByIdQuery,
  useDeleteConsentMutation,
} = consentsApi;
