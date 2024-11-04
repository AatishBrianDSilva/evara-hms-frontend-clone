import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import {
  IPatientBilling,
  IPatientRefund,
} from '../../../types/patientDashboard/billings';
import generateQueryParams from '../../../utils/generateQueryParams';
import { baseQuery } from '../../baseQuery';

interface AddBillingPayload {
  estimations: string[];
}

interface EditBillingPayload {
  _id: string;
  updates: {
    discount: number;
  };
}

interface ProcessBillingPayload {
  billings: {
    billingId: string;
    payments: {
      amount: number | undefined;
      method: string;
      paymentDate: Date | null;
      details?: string;
    }[];
  }[];
}

interface EditBillingPaymentModePayload {
  _id: string;
  payments: {
    amount: number | undefined;
    _id: string;
    method: string;
    paymentDate: Date | null;
    details: string;
    type: string;
  }[];
}

interface AddRefundPayload {
  billingId: string;
  refundAmount: number;
  refundDetails: {
    method: string;
    reason: string;
  };
}

export const billingApi = createApi({
  reducerPath: 'billingApi',
  baseQuery: baseQuery,
  tagTypes: ['Billing', 'Estimations', 'Refund', 'Stocks'],
  endpoints: builder => ({
    getBillings: builder.query<
      ApiResponse<PaginatedResponse<IPatientBilling>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `billings?${queryParams}`, method: 'GET' };
      },
      providesTags: (_result, _error, _args) => ['Billing'],
    }),
    getBillingById: builder.query<ApiResponse<IPatientBilling>, string>({
      query: (id: string) => {
        return { url: `billings/${id}`, method: 'GET' };
      },
      providesTags: (_result, _error, id) => [{ type: 'Billing', id }],
    }),
    addBilling: builder.mutation<
      ApiResponse<IPatientBilling>,
      AddBillingPayload
    >({
      query: billingData => ({
        url: 'billings/add',
        method: 'POST',
        body: billingData,
      }),
      invalidatesTags: ['Billing', 'Estimations'],
    }),
    editBilling: builder.mutation<
      ApiResponse<IPatientBilling>,
      EditBillingPayload
    >({
      query: billingData => ({
        url: `billings/${billingData._id}`,
        method: 'PUT',
        body: billingData,
      }),
      invalidatesTags: ['Billing'],
    }),
    editPaidBillingMode: builder.mutation<
      ApiResponse<IPatientBilling>,
      EditBillingPaymentModePayload
    >({
      query: billingData => ({
        url: `billings/payment-mode/${billingData._id}`,
        method: 'PUT',
        body: billingData.payments,
      }),
      invalidatesTags: ['Billing'],
    }),
    deleteBilling: builder.mutation<ApiResponse<null>, string>({
      query: id => ({
        url: `billings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Billing'],
    }),
    processBilling: builder.mutation<ApiResponse<null>, ProcessBillingPayload>({
      query: data => ({
        url: `billings/process`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Billing'],
    }),
    getAllServices: builder.query<ApiResponse<any>, IQueryOptions>({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `master/services/all?${queryParams}`, method: 'GET' };
      },
    }),
    addRefund: builder.mutation<ApiResponse<IPatientBilling>, AddRefundPayload>(
      {
        query: refundData => ({
          url: 'billings/refund',
          method: 'POST',
          body: refundData,
        }),
        invalidatesTags: ['Billing', 'Stocks'],
      },
    ),
    getRefunds: builder.query<
      ApiResponse<PaginatedResponse<IPatientRefund>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `billings/refunds?${queryParams}`, method: 'GET' };
      },
      providesTags: (_result, _error, _args) => ['Refund'],
    }),
    getRefundById: builder.query<ApiResponse<IPatientRefund>, string>({
      query: (id: string) => {
        return { url: `billings/refunds/${id}`, method: 'GET' };
      },
      providesTags: (_result, _error, id) => [{ type: 'Refund', id }],
    }),
  }),
});

export const {
  useAddBillingMutation,
  useGetBillingsQuery,
  useGetBillingByIdQuery,
  useEditBillingMutation,
  useDeleteBillingMutation,
  useProcessBillingMutation,
  useGetAllServicesQuery,
  useAddRefundMutation,
  useGetRefundsQuery,
  useGetRefundByIdQuery,
  useEditPaidBillingModeMutation,
} = billingApi;
