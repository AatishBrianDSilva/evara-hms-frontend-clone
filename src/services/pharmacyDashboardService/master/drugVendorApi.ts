import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../../types/global';
import generateQueryParams from '../../../utils/generateQueryParams';
import { IDrugVendor } from '../../../types/pharmacyDashboard/master';
import { baseQuery } from '../../baseQuery';

interface AddDrugVendorPayload {
  name: string;
  gst: string;
  pan: string;
  tin: string;
  dl: string;
  contact: {
    person: string;
    phone: string;
    email: string;
  };
  address: {
    addressLine1: string;
    addressLine2: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
  };
  remarks: string;
  status: string;
}

interface EditDrugVendorPayload {
  id: string;
  name: string;
  gst: string;
  pan: string;
  tin: string;
  dl: string;
  contact: {
    person: string;
    phone: string;
    email: string;
  };
  address: {
    addressLine1: string;
    addressLine2: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
  };
  remarks: string;
  status: string;
}

export const drugVendorApi = createApi({
  reducerPath: 'drugVendorApi',
  baseQuery: baseQuery,
  tagTypes: ['DrugVendor'],
  endpoints: builder => ({
    addDrugVendor: builder.mutation<
      ApiResponse<IDrugVendor>,
      AddDrugVendorPayload
    >({
      query: drugVendorData => ({
        url: 'pharmacy-dashboard/master/drug-vendors/add',
        method: 'POST',
        body: drugVendorData,
      }),
      invalidatesTags: ['DrugVendor'],
    }),
    editDrugVendor: builder.mutation<
      ApiResponse<IDrugVendor>,
      EditDrugVendorPayload
    >({
      query: drugVendorData => ({
        url: `pharmacy-dashboard/master/drug-vendors/${drugVendorData.id}`,
        method: 'PUT',
        body: drugVendorData,
      }),
      invalidatesTags: ['DrugVendor'],
    }),
    deleteDrugVendor: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `pharmacy-dashboard/master/drug-vendors/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['DrugVendor'],
    }),
    getDrugVendors: builder.query<
      ApiResponse<PaginatedResponse<IDrugVendor>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/master/drug-vendors?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['DrugVendor'],
    }),
    getDrugVendorById: builder.query<ApiResponse<IDrugVendor>, string>({
      query: id => `pharmacy-dashboard/master/drug-vendors/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'DrugVendor', id }],
    }),
  }),
});

export const {
  useAddDrugVendorMutation,
  useEditDrugVendorMutation,
  useDeleteDrugVendorMutation,
  useGetDrugVendorsQuery,
  useGetDrugVendorByIdQuery,
} = drugVendorApi;
