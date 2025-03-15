import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import { IPatientBilling } from '../../../types/patientDashboard/billings';
import generateQueryParams from '../../../utils/generateQueryParams';
import { analyticsBaseQuery } from '../../baseQuery';

export const analyticsPatientPaymentsApi = createApi({
  reducerPath: 'analyticsPatientPaymentssApi',
  baseQuery: analyticsBaseQuery,
  tagTypes: ['Billing', 'Estimations'],
  endpoints: builder => ({
    getAnalyticsPatientPayments: builder.query<
      ApiResponse<PaginatedResponse<IPatientBilling>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/billings/patient-payments?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['Billing'],
    }),
  }),
});

export const { useGetAnalyticsPatientPaymentsQuery } =
  analyticsPatientPaymentsApi;
