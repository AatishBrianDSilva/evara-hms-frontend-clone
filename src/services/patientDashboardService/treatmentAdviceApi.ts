import { createApi } from '@reduxjs/toolkit/query/react';
import generateQueryParams from '../../utils/generateQueryParams';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../types/global';
import { ITreatmentAdvice } from '../../types/patientDashboard/treatmentAdvice';
import { baseQuery } from '../baseQuery';

interface AddTreatmentAdvicePayload {
  caseId: string;
  patientCode: string;
  treatmentAdvice: string;
  tentativeDate: string;
  status: string;
  comments: string;
  callDetails: {
    callDate: string;
    callTime: string;
    comments: string;
  }[];
}

export const treatmentAdviceApi = createApi({
  reducerPath: 'treatmentAdviceApi',
  baseQuery: baseQuery,
  tagTypes: ['TreatmentAdvice'],
  endpoints: builder => ({
    getTreatmentAdvices: builder.query<
      ApiResponse<PaginatedResponse<ITreatmentAdvice>>,
      IQueryOptions
    >({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `treatment-advice?${queryParams}`, method: 'GET' };
      },
      providesTags: (_result, _error, _args) => ['TreatmentAdvice'],
    }),
    addTreatmentAdvice: builder.mutation<
      ApiResponse<ITreatmentAdvice>,
      AddTreatmentAdvicePayload
    >({
      query: adviceData => ({
        url: 'treatment-advice/add',
        method: 'POST',
        body: adviceData,
      }),
      invalidatesTags: ['TreatmentAdvice'],
    }),
    deleteTreatmentAdvice: builder.mutation<ApiResponse<null>, string>({
      query: id => ({
        url: `treatment-advice/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TreatmentAdvice'],
    }),
  }),
});

export const {
  useAddTreatmentAdviceMutation,
  useGetTreatmentAdvicesQuery,
  useDeleteTreatmentAdviceMutation,
} = treatmentAdviceApi;
