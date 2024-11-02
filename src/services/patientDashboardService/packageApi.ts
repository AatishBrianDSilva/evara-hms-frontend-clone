import { createApi } from '@reduxjs/toolkit/query/react';
import generateQueryParams from '../../utils/generateQueryParams';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../types/global';
import { IPatientPackage } from '../../types/patientDashboard/investigation';
import { baseQuery } from '../baseQuery';

interface AddPatientPackagePayload {
  caseId: string;
  patient: string;
  patientCode: string;
  package: string;
  date: string;
}

export const packageApi = createApi({
  reducerPath: 'packageApi',
  baseQuery: baseQuery,
  tagTypes: ['Package'],
  endpoints: builder => ({
    getPackages: builder.query<
      ApiResponse<PaginatedResponse<IPatientPackage>>,
      IQueryOptions
    >({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `packages?${queryParams}`, method: 'GET' };
      },
      providesTags: (_result, _error, _args) => ['Package'],
    }),
    getPackageById: builder.query<ApiResponse<IPatientPackage>, string>({
      query: (id: string) => {
        return { url: `packages/${id}`, method: 'GET' };
      },
      providesTags: (_result, _error, id) => [{ type: 'Package', id }],
    }),
    addPackage: builder.mutation<
      ApiResponse<IPatientPackage>,
      AddPatientPackagePayload[]
    >({
      query: packageData => ({
        url: 'packages/add',
        method: 'POST',
        body: packageData,
      }),
      invalidatesTags: ['Package'],
    }),
    // editPackage: builder.mutation<ApiResponse<IPatientPackage>, any>({
    //   query: (packageData) => ({
    //     url: `packages/${packageData._id}`,
    //     method: "PUT",
    //     body: packageData,
    //   }),
    //   invalidatesTags: ["Package"],
    // }),
    deletePackage: builder.mutation<ApiResponse<null>, string>({
      query: id => ({
        url: `packages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Package'],
    }),
  }),
});

export const {
  useAddPackageMutation,
  useGetPackagesQuery,
  useGetPackageByIdQuery,
  //   useEditPackageMutation,
  useDeletePackageMutation,
} = packageApi;
