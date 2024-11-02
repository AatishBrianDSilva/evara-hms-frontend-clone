import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponse, IQueryOptions } from '../../../../types/global';
import generateQueryParams from '../../../../utils/generateQueryParams';
import { baseQuery } from '../../../baseQuery';

export const serviceCyclesStagesApi = createApi({
  reducerPath: 'serviceCyclesStagesApi',
  baseQuery: baseQuery,
  tagTypes: ['MasterCycleStage'],
  endpoints: builder => ({
    addServiceCycleStage: builder.mutation<ApiResponse<any>, any>({
      query: cycleStageData => ({
        url: 'master/treatment-cycles/stage/add',
        method: 'POST',
        body: cycleStageData,
      }),
      invalidatesTags: ['MasterCycleStage'],
    }),
    editServiceCycleStage: builder.mutation<ApiResponse<any>, any>({
      query: ({ id, ...cycleStageData }) => ({
        url: `master/treatment-cycles/stage/${id}`,
        method: 'PUT',
        body: cycleStageData,
      }),
      invalidatesTags: ['MasterCycleStage'],
    }),
    deleteServiceCycleStage: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/treatment-cycles/stage/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MasterCycleStage'],
    }),
    getServiceCycleStages: builder.query<ApiResponse<any[]>, IQueryOptions>({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/treatment-cycles/stage?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['MasterCycleStage'],
    }),
    getServiceCycleStageById: builder.query<ApiResponse<any>, string>({
      query: (id: string) => `master/treatment-cycles/stage/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'MasterCycleStage', id }],
    }),
  }),
});

export const {
  useAddServiceCycleStageMutation,
  useEditServiceCycleStageMutation,
  useDeleteServiceCycleStageMutation,
  useGetServiceCycleStagesQuery,
  useGetServiceCycleStageByIdQuery,
} = serviceCyclesStagesApi;
