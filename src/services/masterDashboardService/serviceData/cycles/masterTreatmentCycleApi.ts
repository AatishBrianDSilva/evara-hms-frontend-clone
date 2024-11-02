import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponse, IQueryOptions } from '../../../../types/global';
import generateQueryParams from '../../../../utils/generateQueryParams';
import { baseQuery } from '../../../baseQuery';
import {
  IDefaultTreatmentCycle,
  IMasterTreatmentCycle,
} from '../../../../types/master';

export const masterTreatmentCycleApi = createApi({
  reducerPath: 'masterTreatmentCycleApi',
  baseQuery: baseQuery,
  tagTypes: ['MasterTreatmentCycle'],
  endpoints: builder => ({
    addMasterTreatmentCycle: builder.mutation<ApiResponse<any>, any>({
      query: cycleItemData => ({
        url: 'master/treatment-cycles/add',
        method: 'POST',
        body: cycleItemData,
      }),
      invalidatesTags: ['MasterTreatmentCycle'],
    }),
    editMasterTreatmentCycle: builder.mutation<ApiResponse<any>, any>({
      query: ({ id, ...cycleItemData }) => ({
        url: `master/treatment-cycles/${id}`,
        method: 'PUT',
        body: cycleItemData,
      }),
      invalidatesTags: ['MasterTreatmentCycle'],
    }),
    deleteMasterTreatmentCycle: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/treatment-cycles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MasterTreatmentCycle'],
    }),
    getMasterTreatmentCycles: builder.query<
      ApiResponse<IMasterTreatmentCycle[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/treatment-cycles?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['MasterTreatmentCycle'],
    }),
    getMasterTreatmentCycleById: builder.query<
      ApiResponse<IMasterTreatmentCycle>,
      string
    >({
      query: (id: string) => `master/treatment-cycles/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'MasterTreatmentCycle', id },
      ],
    }),
    getMasterDefaultTreatmentCycle: builder.query<
      ApiResponse<IDefaultTreatmentCycle[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/treatment-cycles/default?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['MasterTreatmentCycle'],
    }),
  }),
});

export const {
  useAddMasterTreatmentCycleMutation,
  useEditMasterTreatmentCycleMutation,
  useDeleteMasterTreatmentCycleMutation,
  useGetMasterTreatmentCyclesQuery,
  useGetMasterTreatmentCycleByIdQuery,
  useGetMasterDefaultTreatmentCycleQuery,
} = masterTreatmentCycleApi;
