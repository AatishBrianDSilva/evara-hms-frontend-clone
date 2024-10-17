import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, IQueryOptions, PaginatedResponse } from "../../../types/global";
import generateQueryParams from "../../../utils/generateQueryParams";
import { IDrugManufacturer } from "../../../types/pharmacyDashboard/master";
import { baseQuery } from "../../baseQuery";

interface AddDrugManufacturerPayload {
  name: string;
  category: string[] | undefined;
  taxRate: string | undefined;
  cst: string;
  apgst: string;
  pan: string;
  tin: string;
  contact: {
    person: string;
    phone: string;
    email: string;
    website?: string;
  };
  address: {
    addressLine1: string;
    addressLine2?: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
  };
  status: string;
}

interface EditDrugManufacturerPayload {
  id: string;
  name: string;
  category: string[] | undefined;
  taxRate: string | undefined;
  cst: string;
  apgst: string;
  pan: string;
  tin: string;
  contact: {
    person: string;
    phone: string;
    email: string;
    website?: string;
  };
  address: {
    addressLine1: string;
    addressLine2?: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
  };
  status: string;
}

export const drugManufacturerApi = createApi({
  reducerPath: "drugManufacturerApi",
  baseQuery: baseQuery,
  tagTypes: ["DrugManufacturer"],
  endpoints: (builder) => ({
    addDrugManufacturer: builder.mutation<
      ApiResponse<IDrugManufacturer>,
      AddDrugManufacturerPayload
    >({
      query: (drugManufacturerData) => ({
        url: "pharmacy-dashboard/master/drug-manufacturers/add",
        method: "POST",
        body: drugManufacturerData,
      }),
      invalidatesTags: ["DrugManufacturer"],
    }),
    editDrugManufacturer: builder.mutation<
      ApiResponse<IDrugManufacturer>,
      EditDrugManufacturerPayload
    >({
      query: (drugManufacturerData) => ({
        url: `pharmacy-dashboard/master/drug-manufacturers/${drugManufacturerData.id}`,
        method: "PUT",
        body: drugManufacturerData,
      }),
      invalidatesTags: ["DrugManufacturer"],
    }),
    deleteDrugManufacturer: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `pharmacy-dashboard/master/drug-manufacturers/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["DrugManufacturer"],
    }),
    getDrugManufacturers: builder.query<
      ApiResponse<PaginatedResponse<IDrugManufacturer>>,
      IQueryOptions
    >({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/master/drug-manufacturers?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["DrugManufacturer"],
    }),
    getDrugManufacturerById: builder.query<ApiResponse<IDrugManufacturer>, string>({
      query: (id) => `pharmacy-dashboard/master/drug-manufacturers/${id}`,
      providesTags: (_result, _error, id) => [{ type: "DrugManufacturer", id }],
    }),
  }),
});

export const {
  useAddDrugManufacturerMutation,
  useEditDrugManufacturerMutation,
  useDeleteDrugManufacturerMutation,
  useGetDrugManufacturersQuery,
  useGetDrugManufacturerByIdQuery,
} = drugManufacturerApi;
