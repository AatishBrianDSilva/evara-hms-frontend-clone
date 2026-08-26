import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { analyticsBaseQuery } from '../../baseQuery';

export interface InvestigationReportsResponse {
  _id: string;
  date: string;
  patientId: string;
  patientName?: string;
  doctor: string;
  investigation: string;
  amount: number;
  discount?: number | null;
  netBilled?: number | null;
  status: string;
  files: string[];
}
export interface ProcedureReportsResponse {
  _id: string;
  date: string;
  patientId: string;
  patientName?: string;
  doctor: string;
  procedure: string;
  amount: number;
  discount?: number | null;
  netBilled?: number | null;
  status: string;
  files: string[];
}
export interface CryoPreservationReportsResponse {
  _id: string;
  date: string;
  expiryDate?: string | null;
  patientId: string;
  patientName?: string;
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
  patientName?: string;
  doctor: string;
  treatmentCycle: string;
  amount: number;
  discount?: number | null;
  netBilled?: number | null;
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

export interface ProcedureMonthlyStatsResponse {
  id: string;
  month: string;
  procedure: string;
  count: number;
  totalAmount: number;
}

export interface OpuFetReportsResponse {
  _id: string;
  cycleId: string;
  date: string;
  month: string;
  patientId: string;
  patientName: string;
  doctor: string;
  cycleName: string;
  cycleNo: number;
  reportName: string;
  reportType: string;
  reportStatus: string;
  cycleStatus: string;
  files?: string[];
}

export const treatmentTestingApi = createApi({
  reducerPath: 'treatmentTestingApi',
  baseQuery: analyticsBaseQuery,
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
    getProcedureMonthlyStats: builder.query<
      ApiResponse<{
        records: ProcedureMonthlyStatsResponse[];
        summary: { totalCount: number; totalAmount: number };
      }>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/treatments-testing/procedure-monthly-stats?${queryParams}`,
          method: 'GET',
        };
      },
    }),
    getOpuFetReports: builder.query<
      ApiResponse<
        PaginatedResponse<OpuFetReportsResponse> & {
          summary: {
            totalCount: number;
            byMonth: { month: string; count: number }[];
          };
        }
      >,
      IQueryOptions & { reportType: 'OPUReport' | 'EmbryoTransferReport' }
    >({
      query: options => {
        const { reportType, ...rest } = options;
        const queryParams = generateQueryParams({
          ...rest,
          filters: {
            ...(rest.filters || {}),
            reportType,
          },
        });
        return {
          url: `analytics/treatments-testing/opu-fet-reports?${queryParams}`,
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
  useGetProcedureMonthlyStatsQuery,
  useGetOpuFetReportsQuery,
} = treatmentTestingApi;
