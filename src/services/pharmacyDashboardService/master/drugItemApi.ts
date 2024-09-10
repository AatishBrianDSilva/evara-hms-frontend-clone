import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from "../../../types/global";
import generateQueryParams from "../../../utils/generateQueryParams";
import { IDrugItem } from "../../../types/pharmacyDashboard/master";
import { baseQuery } from "../../baseQuery";

interface AddDrugItemPayload {
  name: string;
  hsnCode: string;
  category: string | null;
  type?: string | null;
  packSize: number;
  taxRate: string | null;
  manufacturer: string | null;
  status: string;
}

interface EditDrugItemPayload {
  id: string;
  name: string;
  hsnCode: string;
  category: string | null;
  type?: string | null;
  packSize: number;
  taxRate: string | null;
  manufacturer: string | null;
  status: string;
}

export const drugItemApi = createApi({
  reducerPath: "drugItemApi",
  baseQuery: baseQuery,
  tagTypes: ["DrugItem"],
  endpoints: (builder) => ({
    addDrugItem: builder.mutation<ApiResponse<IDrugItem>, AddDrugItemPayload>({
      query: (drugItemData) => ({
        url: "pharmacy-dashboard/master/drug-items/add",
        method: "POST",
        body: drugItemData,
      }),
      invalidatesTags: ["DrugItem"],
    }),
    editDrugItem: builder.mutation<ApiResponse<IDrugItem>, EditDrugItemPayload>(
      {
        query: (drugItemData) => ({
          url: `pharmacy-dashboard/master/drug-items/${drugItemData.id}`,
          method: "PUT",
          body: drugItemData,
        }),
        invalidatesTags: ["DrugItem"],
      }
    ),
    deleteDrugItem: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `pharmacy-dashboard/master/drug-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DrugItem"],
    }),
    getDrugItems: builder.query<
      ApiResponse<PaginatedResponse<IDrugItem>>,
      IQueryOptions
    >({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/master/drug-items?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["DrugItem"],
    }),
    getDrugItemById: builder.query<ApiResponse<IDrugItem>, string>({
      query: (id) => `pharmacy-dashboard/master/drug-items/${id}`,
      providesTags: (_result, _error, id) => [{ type: "DrugItem", id }],
    }),
  }),
});

export const {
  useAddDrugItemMutation,
  useEditDrugItemMutation,
  useDeleteDrugItemMutation,
  useGetDrugItemsQuery,
  useGetDrugItemByIdQuery,
} = drugItemApi;
