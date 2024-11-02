import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponse, IQueryOptions } from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { baseQuery } from '../../baseQuery';
import { IGlobalBranch } from '../../../types/serviceDashboard/branch';

export const globalBranchApi = createApi({
  reducerPath: 'globalBranchApi',
  baseQuery: baseQuery,
  tagTypes: ['Global Branch', 'Global Active Branch'],
  endpoints: builder => ({
    addGlobalBranch: builder.mutation<ApiResponse<any>, any>({
      query: branchData => ({
        url: 'master/branch/add',
        method: 'POST',
        body: branchData,
      }),
      invalidatesTags: ['Global Branch', 'Global Active Branch'],
    }),
    editGlobalBranch: builder.mutation<
      ApiResponse<any>,
      { id: string; branchData: any }
    >({
      query: ({ id, branchData }) => ({
        url: `master/branch/${id}`,
        method: 'PUT',
        body: branchData,
      }),
      invalidatesTags: ['Global Branch', 'Global Active Branch'],
    }),
    deleteGlobalBranch: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/branch/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Global Branch', 'Global Active Branch'],
    }),
    getGlobalBranchs: builder.query<
      ApiResponse<IGlobalBranch[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/branch?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['Global Branch'],
    }),
    getActiveBranches: builder.query<
      ApiResponse<{ branchId: string; branchName: string }[]>,
      string
    >({
      query: clinicId => {
        return {
          url: `master/branch/active?clinicId=${clinicId}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['Global Active Branch'],
    }),
    getGlobalBranchById: builder.query<ApiResponse<IGlobalBranch>, string>({
      query: (id: string) => `master/branch/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Global Branch', id }],
    }),
  }),
});

export const {
  useAddGlobalBranchMutation,
  useEditGlobalBranchMutation,
  useDeleteGlobalBranchMutation,
  useGetGlobalBranchsQuery,
  useGetActiveBranchesQuery,
  useGetGlobalBranchByIdQuery,
} = globalBranchApi;
