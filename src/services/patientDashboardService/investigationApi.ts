import { createApi } from '@reduxjs/toolkit/query/react';

import generateQueryParams from '../../utils/generateQueryParams';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../types/global';
import { IPatientInvestigation } from '../../types/patientDashboard/investigation';
import { baseQuery } from '../baseQuery';

interface AddPatientInvestigationPayload {
  caseId: string;
  patient: string;
  patientCode: string;
  doctor: string;
  investigation: string;
  date: string;
}

export const investigationApi = createApi({
  reducerPath: 'investigationApi',
  baseQuery: baseQuery,
  tagTypes: ['Investigation'],
  endpoints: builder => ({
    getInvestigations: builder.query<
      ApiResponse<PaginatedResponse<IPatientInvestigation>>,
      IQueryOptions
    >({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `investigations?${queryParams}`, method: 'GET' };
      },
      providesTags: (_result, _error, _args) => ['Investigation'],
    }),
    getInvestigationById: builder.query<
      ApiResponse<IPatientInvestigation>,
      string
    >({
      query: (id: string) => {
        return { url: `investigations/${id}`, method: 'GET' };
      },
      providesTags: (_result, _error, id) => [{ type: 'Investigation', id }],
    }),
    addInvestigation: builder.mutation<
      ApiResponse<IPatientInvestigation>,
      AddPatientInvestigationPayload[]
    >({
      query: investigationData => ({
        url: 'investigations/add',
        method: 'POST',
        body: investigationData,
      }),
      invalidatesTags: ['Investigation'],
    }),
    editInvestigation: builder.mutation<
      ApiResponse<IPatientInvestigation>,
      any
    >({
      query: investigationData => ({
        url: `investigations/${investigationData._id}`,
        method: 'PUT',
        body: investigationData,
      }),
      invalidatesTags: ['Investigation'],
    }),
    deleteInvestigation: builder.mutation<ApiResponse<null>, string>({
      query: id => ({
        url: `investigations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Investigation'],
    }),
  }),
});

export const {
  useAddInvestigationMutation,
  useGetInvestigationsQuery,
  useGetInvestigationByIdQuery,
  useEditInvestigationMutation,
  useDeleteInvestigationMutation,
} = investigationApi;
