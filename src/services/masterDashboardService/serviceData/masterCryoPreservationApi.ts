import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponse, IQueryOptions } from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { baseQuery } from '../../baseQuery';
import {
  ICryoPreservations,
  IMasterCryoPreservations,
} from '../../../types/master';

export const masterCryoPreservationApi = createApi({
  reducerPath: 'masterCryoPreservationApi',
  baseQuery: baseQuery,
  tagTypes: ['MasterCryoPreservation'],
  endpoints: builder => ({
    addMasterCryoPreservation: builder.mutation<ApiResponse<any>, any>({
      query: cryoPreservationData => ({
        url: 'master/cryo-preservations/add',
        method: 'POST',
        body: cryoPreservationData,
      }),
      invalidatesTags: ['MasterCryoPreservation'],
    }),
    editMasterCryoPreservation: builder.mutation<ApiResponse<any>, any>({
      query: ({ id, ...cryoPreservationData }) => ({
        url: `master/cryo-preservations/${id}`,
        method: 'PUT',
        body: cryoPreservationData,
      }),
      invalidatesTags: ['MasterCryoPreservation'],
    }),
    deleteMasterCryoPreservation: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/cryo-preservations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MasterCryoPreservation'],
    }),
    getMasterCryoPreservations: builder.query<
      ApiResponse<IMasterCryoPreservations[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/cryo-preservations?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['MasterCryoPreservation'],
    }),
    getMasterCryoPreservationById: builder.query<
      ApiResponse<IMasterCryoPreservations>,
      string
    >({
      query: (id: string) => `master/cryo-preservations/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'MasterCryoPreservation', id },
      ],
    }),
    getMasterDefaultCryoPreservation: builder.query<
      ApiResponse<ICryoPreservations[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/cryo-preservations/default?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['MasterCryoPreservation'],
    }),
  }),
});

export const {
  useAddMasterCryoPreservationMutation,
  useEditMasterCryoPreservationMutation,
  useDeleteMasterCryoPreservationMutation,
  useGetMasterCryoPreservationsQuery,
  useGetMasterCryoPreservationByIdQuery,
  useGetMasterDefaultCryoPreservationQuery,
} = masterCryoPreservationApi;
