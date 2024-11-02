import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponse, IQueryOptions } from '../types/global';
import { baseQuery } from './baseQuery';
import generateQueryParams from '../utils/generateQueryParams';
import { IAppointment } from '../types/appointment';
import { IPatient } from '../types/patient';

interface badge {
  color: string;
  count: number;
  label: string;
}

export interface ISummary {
  appointment: {
    total: number;
    badges: badge[];
  };
  treatment: {
    total: number;
    badges: badge[];
  };
  billing: {
    total: number;
    badges: badge[];
    totalBillings: number;
    totalPaid: number;
  };
  pharmacy: {
    totalAmount: number;
  };
}

export interface IPatientSummary {
  patientCount: number;
  donorsCount: number;
  patients: IPatient[];
}

export interface IPharmacySummary {
  purchaseOrders: {
    count: number;
    totalPayout: number;
  };
  criticalStock: {
    count: number;
  };
}

export const homeApi = createApi({
  reducerPath: 'homeApi',
  baseQuery: baseQuery,
  endpoints: builder => ({
    getSummary: builder.query<ApiResponse<ISummary>, IQueryOptions>({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `home/summary?${queryParams}`, method: 'GET' };
      },
    }),
    getAppointmentSummary: builder.query<
      ApiResponse<IAppointment[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `home/appointment-summary?${queryParams}`,
          method: 'GET',
        };
      },
    }),
    getPatientSummary: builder.query<
      ApiResponse<IPatientSummary>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `home/patient-summary?${queryParams}`, method: 'GET' };
      },
    }),
    getPharmacySummary: builder.query<
      ApiResponse<IPharmacySummary>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return { url: `home/pharmacy-summary?${queryParams}`, method: 'GET' };
      },
    }),
  }),
});

export const {
  useGetSummaryQuery,
  useGetAppointmentSummaryQuery,
  useGetPatientSummaryQuery,
  useGetPharmacySummaryQuery,
} = homeApi;
