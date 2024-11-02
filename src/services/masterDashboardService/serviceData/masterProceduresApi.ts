import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponse, IQueryOptions } from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { baseQuery } from '../../baseQuery';
import { IMasterProcedures } from '../../../types/master';

export const masterProceduresApi = createApi({
  reducerPath: 'masterProcedureApi',
  baseQuery: baseQuery,
  tagTypes: ['MasterProcedure'],
  endpoints: builder => ({
    addMasterProcedure: builder.mutation<ApiResponse<any>, any>({
      query: procedureData => ({
        url: 'master/procedures/add',
        method: 'POST',
        body: procedureData,
      }),
      invalidatesTags: ['MasterProcedure'],
    }),
    editMasterProcedure: builder.mutation<ApiResponse<any>, any>({
      query: procedureData => ({
        // query: ({ _id, ...investigationData }) => ({
        url: `master/procedures/${procedureData.id}`,
        // url: `master/investigations/${_id}`,
        method: 'PUT',
        body: procedureData,
      }),
      invalidatesTags: ['MasterProcedure'],
    }),
    deleteMasterProcedure: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/procedures/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MasterProcedure'],
    }),
    getMasterProcedures: builder.query<
      ApiResponse<IMasterProcedures[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/procedures?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['MasterProcedure'],
    }),
    getMasterProcedureById: builder.query<
      ApiResponse<IMasterProcedures>,
      string
    >({
      query: (id: string) => `master/procedures/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'MasterProcedure', id }],
    }),
    getMasterDefaultProcedures: builder.query<
      ApiResponse<any[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/procedures/default?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['MasterProcedure'],
    }),
  }),
});

export const {
  useAddMasterProcedureMutation,
  useEditMasterProcedureMutation,
  useDeleteMasterProcedureMutation,
  useGetMasterProceduresQuery,
  useGetMasterProcedureByIdQuery,
  useGetMasterDefaultProceduresQuery,
} = masterProceduresApi;
