import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { analyticsBaseQuery } from '../../baseQuery';

export interface PatientConsumptionRecord {
  id: string;
  patientId: string;
  patientName: string;
  totalQuantity: number;
  totalValue: number;
  allocationCount: number;
  lastDate?: string;
}

export interface ItemStockValueRecord {
  id: string;
  itemId: string;
  drugName: string;
  drugCode: string;
  hsnCode: string;
  quantity: number;
  totalCost: number;
  totalMrp: number;
}

export const patientConsumptionApi = createApi({
  reducerPath: 'patientConsumptionApi',
  baseQuery: analyticsBaseQuery,
  tagTypes: ['PatientConsumption'],
  endpoints: builder => ({
    getPatientConsumption: builder.query<
      ApiResponse<
        PaginatedResponse<PatientConsumptionRecord> & {
          summary?: {
            totalQuantity: number;
            totalValue: number;
            patientCount: number;
          };
        }
      >,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/pharmacy/patient-consumption?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: ['PatientConsumption'],
    }),
  }),
});

export const itemStockValuesApi = createApi({
  reducerPath: 'itemStockValuesApi',
  baseQuery: analyticsBaseQuery,
  tagTypes: ['ItemStockValues'],
  endpoints: builder => ({
    getItemStockValues: builder.query<
      ApiResponse<
        PaginatedResponse<ItemStockValueRecord> & {
          summary?: {
            totalQuantity: number;
            totalCost: number;
            totalMrp: number;
            itemCount: number;
          };
        }
      >,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/pharmacy/item-stock-values?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: ['ItemStockValues'],
    }),
  }),
});

export const { useGetPatientConsumptionQuery } = patientConsumptionApi;
export const { useGetItemStockValuesQuery } = itemStockValuesApi;
