import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import { IPatientBilling } from '../../../types/patientDashboard/billings';
import generateQueryParams from '../../../utils/generateQueryParams';
import { analyticsBaseQuery } from '../../baseQuery';

export const analyticsPatientBillingsApi = createApi({
  reducerPath: 'analyticsPatientBillingsApi',
  baseQuery: analyticsBaseQuery,
  tagTypes: ['Billing', 'Estimations'],
  endpoints: builder => ({
    getAnalyticsPatientBillings: builder.query<
      ApiResponse<PaginatedResponse<IPatientBilling>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/billings/patient-billings?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['Billing'],
    }),
  }),
});

export const { useGetAnalyticsPatientBillingsQuery } =
  analyticsPatientBillingsApi;
