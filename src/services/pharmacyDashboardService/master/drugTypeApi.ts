import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { IDrugType } from '../../../types/pharmacyDashboard/master';
import { baseQuery } from '../../baseQuery';

interface AddDrugTypePayload {
  name: string;
  shortcode: string;
  notes?: string;
}

interface EditDrugTypePayload {
  id: string;
  name: string;
  shortcode: string;
  notes?: string;
}

export const drugTypeApi = createApi({
  reducerPath: 'drugTypeApi',
  baseQuery: baseQuery,
  tagTypes: ['DrugType'],
  endpoints: builder => ({
    addDrugType: builder.mutation<ApiResponse<IDrugType>, AddDrugTypePayload>({
      query: drugTypeData => ({
        url: 'pharmacy-dashboard/master/drug-types/add',
        method: 'POST',
        body: drugTypeData,
      }),
      invalidatesTags: ['DrugType'],
    }),
    editDrugType: builder.mutation<ApiResponse<IDrugType>, EditDrugTypePayload>(
      {
        query: drugTypeData => ({
          url: `pharmacy-dashboard/master/drug-types/${drugTypeData.id}`,
          method: 'PUT',
          body: drugTypeData,
        }),
        invalidatesTags: ['DrugType'],
      },
    ),
    deleteDrugType: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `pharmacy-dashboard/master/drug-types/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['DrugType'],
    }),
    getDrugTypes: builder.query<
      ApiResponse<PaginatedResponse<IDrugType>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/master/drug-types?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['DrugType'],
    }),
    getDrugTypeById: builder.query<ApiResponse<IDrugType>, string>({
      query: id => `pharmacy-dashboard/master/drug-types/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'DrugType', id }],
    }),
  }),
});

export const {
  useAddDrugTypeMutation,
  useEditDrugTypeMutation,
  useDeleteDrugTypeMutation,
  useGetDrugTypesQuery,
  useGetDrugTypeByIdQuery,
} = drugTypeApi;
