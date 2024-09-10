import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from "../../../types/global";
import generateQueryParams from "../../../utils/generateQueryParams";
import { IDrugCategory } from "../../../types/pharmacyDashboard/master";
import { baseQuery } from "../../baseQuery";

interface AddDrugCategoryPayload {
  name: string;
  notes?: string;
}

interface EditDrugCategoryPayload {
  id: string;
  name: string;
  notes?: string;
}

export const drugCategoryApi = createApi({
  reducerPath: "drugCategoryApi",
  baseQuery: baseQuery,
  tagTypes: ["DrugCategory"],
  endpoints: (builder) => ({
    addDrugCategory: builder.mutation<
      ApiResponse<IDrugCategory>,
      AddDrugCategoryPayload
    >({
      query: (drugCategoryData) => ({
        url: "pharmacy-dashboard/master/drug-categories/add",
        method: "POST",
        body: drugCategoryData,
      }),
      invalidatesTags: ["DrugCategory"],
    }),
    editDrugCategory: builder.mutation<
      ApiResponse<IDrugCategory>,
      EditDrugCategoryPayload
    >({
      query: (drugCategoryData) => ({
        url: `pharmacy-dashboard/master/drug-categories/${drugCategoryData.id}`,
        method: "PUT",
        body: drugCategoryData,
      }),
      invalidatesTags: ["DrugCategory"],
    }),
    deleteDrugCategory: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `pharmacy-dashboard/master/drug-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DrugCategory"],
    }),
    getDrugCategories: builder.query<
      ApiResponse<PaginatedResponse<IDrugCategory>>,
      IQueryOptions
    >({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/master/drug-categories?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["DrugCategory"],
    }),
    getDrugCategoryById: builder.query<ApiResponse<IDrugCategory>, string>({
      query: (id) => `pharmacy-dashboard/master/drug-categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "DrugCategory", id }],
    }),
  }),
});

export const {
  useAddDrugCategoryMutation,
  useEditDrugCategoryMutation,
  useDeleteDrugCategoryMutation,
  useGetDrugCategoriesQuery,
  useGetDrugCategoryByIdQuery,
} = drugCategoryApi;
