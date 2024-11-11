import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { baseQuery } from '../../baseQuery';

export interface InvestigationReportsResponse {
  _id: string;
  date: string;
  patientId: string;
  doctor: string;
  investigation: string;
  amount: number;
  status: string;
  files: string[];
}
export interface ProcedureReportsResponse {
  _id: string;
  date: string;
  patientId: string;
  doctor: string;
  procedure: string;
  amount: number;
  status: string;
  files: string[];
}
export interface CryoPreservationReportsResponse {
  _id: string;
  date: string;
  patientId: string;
  doctor: string;
  cryoPreservation: string;
  amount: number;
  status: string;
  files: string[];
}
export interface TreatmentCycleReportsResponse {
  _id: string;
  date: string;
  patientId: string;
  doctor: string;
  treatmentCycle: string;
  amount: number;
  status: string;
  files: string[];
}
export interface ServiceReportResponse {
  _id: string;
  date: string;
  patientId: string;
  doctor: string;
  service: string;
  amount: number;
  status: string;
  files: string[];
}
export interface PatientPackagesReportResponse {
  _id: string;
  date: string;
  patientId: string;
  doctor: string;
  package: string;
  amount: number;
  status: string;
  files: string[];
}
export interface MasterPackagesReportResponse {
  _id: string;
  name: string;
  createdAt: string;
  gender: string;
  investigations: string;
  procedures: string;
  cryoPreservations: string;
  services: string;
  treatmentCycles: string;
  price: number;
}

export const treatmentTestingApi = createApi({
  reducerPath: 'treatmentTestingApi',
  baseQuery: baseQuery,
  endpoints: builder => ({
    getInvestigationReports: builder.query<
      ApiResponse<PaginatedResponse<InvestigationReportsResponse>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/treatments-testing/investigation-reports?${queryParams}`,
          method: 'GET',
        };
      },
    }),
    getProceduresReports: builder.query<
      ApiResponse<PaginatedResponse<ProcedureReportsResponse>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/treatments-testing/procedure-reports?${queryParams}`,
          method: 'GET',
        };
      },
    }),
    getCryoPreservationReports: builder.query<
      ApiResponse<PaginatedResponse<CryoPreservationReportsResponse>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/treatments-testing/cryo-preservation-reports?${queryParams}`,
          method: 'GET',
        };
      },
    }),
    getTreatmentCycleReports: builder.query<
      ApiResponse<PaginatedResponse<TreatmentCycleReportsResponse>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/treatments-testing/treatment-cycle-reports?${queryParams}`,
          method: 'GET',
        };
      },
    }),
    getServiceReports: builder.query<
      ApiResponse<PaginatedResponse<ServiceReportResponse>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/treatments-testing/service-reports?${queryParams}`,
          method: 'GET',
        };
      },
    }),
    getPatientPackageReports: builder.query<
      ApiResponse<PaginatedResponse<PatientPackagesReportResponse>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/treatments-testing/patient-package-reports?${queryParams}`,
          method: 'GET',
        };
      },
    }),
    getMasterPackageReports: builder.query<
      ApiResponse<PaginatedResponse<MasterPackagesReportResponse>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/treatments-testing/master-package-reports?${queryParams}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useGetInvestigationReportsQuery,
  useGetProceduresReportsQuery,
  useGetCryoPreservationReportsQuery,
  useGetTreatmentCycleReportsQuery,
  useGetServiceReportsQuery,
  useGetPatientPackageReportsQuery,
  useGetMasterPackageReportsQuery,
} = treatmentTestingApi;
