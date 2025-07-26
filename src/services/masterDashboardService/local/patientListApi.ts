// src/services/masterDashboardService/local/patientListApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import generateQueryParams from '../../../utils/generateQueryParams';
import { baseQuery } from '../../baseQuery';
import { ApiResponse, PaginatedResponse } from '../../../types/global';
import { ResponseHandler } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';

export interface IPatient {
  _id: string;
  patientId: string;
  caseId: string;
  branchId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  mobile: string;
  createdAt: string;
  status: string;
}

export interface IListArgs {
  page?: number;
  limit?: number;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
  filters?: {
    searchQuery?: string;
    branch?: string;
    allData?: boolean;
  };
}

export const patientListApi = createApi({
  reducerPath: 'patientListApi',
  baseQuery,
  tagTypes: ['Patients'],
  endpoints: builder => ({
    getPatientsList: builder.query<
      ApiResponse<PaginatedResponse<IPatient>>,
      IListArgs
    >({
      query: ({ page, limit, dateRange, filters }) => {
        // build up an IQueryOptions‐style object:
        const optsForQS = {
          page,
          limit,
          // any top‑level searchQuery you want (optional)
          searchQuery: filters?.searchQuery,
          // and then the two nested buckets:
          filters: {
            branch: filters?.branch,
            allData: filters?.allData,
          },
          dateRange: {
            startDate: dateRange?.startDate,
            endDate: dateRange?.endDate,
          },
        };

        // now generateQueryParams will flatten both `filters` and `dateRange`
        const qs = generateQueryParams(optsForQS);

        return {
          url: `master/patient/list?${qs}`,
          method: 'GET',
        };
      },
      providesTags: ['Patients'],
    }),

    downloadPatients: builder.mutation<Blob, IListArgs>({
      query: ({ page, limit, dateRange, filters }) => {
        // ⚡ build the same nested shape you use for the list
        const optsForQS = {
          page,
          limit,
          filters: {
            ...filters,
            // if you want to force allData when user clicks “allData”
            allData: filters?.allData ? 'true' : undefined,
          },
          dateRange: {
            startDate: dateRange?.startDate,
            endDate: dateRange?.endDate,
          },
        };
        const qs = generateQueryParams(optsForQS);
        return {
          url: `master/patient/download?${qs}`,
          method: 'GET',
          responseHandler: 'blob' as ResponseHandler,
        };
      },
    }),
  }),
});

export const { useGetPatientsListQuery, useDownloadPatientsMutation } =
  patientListApi;
