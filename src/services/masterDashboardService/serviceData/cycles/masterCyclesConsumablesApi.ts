import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, IQueryOptions } from "../../../../types/global";
import generateQueryParams from "../../../../utils/generateQueryParams";
import { baseQuery } from "../../../baseQuery";

export const serviceCyclesConsumablesApi = createApi({
  reducerPath: "serviceCyclesConsumablesApi",
  baseQuery: baseQuery,
  tagTypes: ["MasterCycleConsumable"],
  endpoints: (builder) => ({
    addServiceCycleConsumable: builder.mutation<ApiResponse<any>, any>({
      query: (cycleConsumableData) => ({
        url: "master/treatment-cycles/consumables/add",
        method: "POST",
        body: cycleConsumableData,
      }),
      invalidatesTags: ["MasterCycleConsumable"],
    }),
    editServiceCycleConsumable: builder.mutation<ApiResponse<any>, any>({
      query: ({ id, ...cycleConsumableData }) => ({
        url: `master/treatment-cycles/consumables/${id}`,
        method: "PUT",
        body: cycleConsumableData,
      }),
      invalidatesTags: ["MasterCycleConsumable"],
    }),
    deleteServiceCycleConsumable: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/treatment-cycles/consumables/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MasterCycleConsumable"],
    }),
    getServiceCycleConsumables: builder.query<
      ApiResponse<any[]>,
      IQueryOptions
    >({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/treatment-cycles/consumables?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["MasterCycleConsumable"],
    }),
    getServiceCycleConsumableById: builder.query<ApiResponse<any>, string>({
      query: (id: string) => `master/treatment-cycles/consumables/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "MasterCycleConsumable", id },
      ],
    }),
  }),
});

export const {
  useAddServiceCycleConsumableMutation,
  useEditServiceCycleConsumableMutation,
  useDeleteServiceCycleConsumableMutation,
  useGetServiceCycleConsumablesQuery,
  useGetServiceCycleConsumableByIdQuery,
} = serviceCyclesConsumablesApi;
