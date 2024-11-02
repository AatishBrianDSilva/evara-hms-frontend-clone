import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponse, IQueryOptions } from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { baseQuery } from '../../baseQuery';
import { IMasterPackage } from '../../../types/master';

export const masterPackagesApi = createApi({
  reducerPath: 'masterPackagesApi',
  baseQuery: baseQuery,
  tagTypes: ['MasterPackage'],
  endpoints: builder => ({
    addMasterPackage: builder.mutation<ApiResponse<any>, any>({
      query: packageData => ({
        url: 'master/packages/add',
        method: 'POST',
        body: packageData,
      }),
      invalidatesTags: ['MasterPackage'],
    }),
    editMasterPackage: builder.mutation<ApiResponse<any>, any>({
      query: packageData => ({
        url: `master/packages/${packageData.id}`,
        method: 'PATCH',
        body: packageData,
      }),
      invalidatesTags: ['MasterPackage'],
    }),
    deleteMasterPackage: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/packages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MasterPackage'],
    }),
    getMasterPackages: builder.query<
      ApiResponse<IMasterPackage[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/packages?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['MasterPackage'],
    }),
    getMasterPackageById: builder.query<ApiResponse<IMasterPackage>, string>({
      query: (id: string) => `master/packages/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'MasterPackage', id }],
    }),
  }),
});

export const {
  useAddMasterPackageMutation,
  useEditMasterPackageMutation,
  useDeleteMasterPackageMutation,
  useGetMasterPackagesQuery,
  useGetMasterPackageByIdQuery,
} = masterPackagesApi;
