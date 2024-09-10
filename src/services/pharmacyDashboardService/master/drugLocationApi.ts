import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from "../../../types/global";
import generateQueryParams from "../../../utils/generateQueryParams";
import { IDrugLocation } from "../../../types/pharmacyDashboard/master";
import { baseQuery } from "../../baseQuery";

interface AddDrugLocationPayload {
  location: number | string;
  notes?: string;
  main: boolean;
}

interface EditDrugLocationPayload {
  id: string;
  location: number | string;
  notes?: string;
  main: boolean;
}

export const drugLocationApi = createApi({
  reducerPath: "drugLocationApi",
  baseQuery: baseQuery,
  tagTypes: ["DrugLocation"],
  endpoints: (builder) => ({
    addDrugLocation: builder.mutation<
      ApiResponse<IDrugLocation>,
      AddDrugLocationPayload
    >({
      query: (drugLocationData) => ({
        url: "pharmacy-dashboard/master/drug-locations/add",
        method: "POST",
        body: drugLocationData,
      }),
      invalidatesTags: ["DrugLocation"],
    }),
    editDrugLocation: builder.mutation<
      ApiResponse<IDrugLocation>,
      EditDrugLocationPayload
    >({
      query: (drugLocationData) => ({
        url: `pharmacy-dashboard/master/drug-locations/${drugLocationData.id}`,
        method: "PUT",
        body: drugLocationData,
      }),
      invalidatesTags: ["DrugLocation"],
    }),
    deleteDrugLocation: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `pharmacy-dashboard/master/drug-locations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DrugLocation"],
    }),
    getDrugLocations: builder.query<
      ApiResponse<PaginatedResponse<IDrugLocation>>,
      IQueryOptions
    >({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/master/drug-locations?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["DrugLocation"],
    }),
    getDrugLocationById: builder.query<ApiResponse<IDrugLocation>, string>({
      query: (id) => `pharmacy-dashboard/master/drug-locations/${id}`,
      providesTags: (_result, _error, id) => [{ type: "DrugLocation", id }],
    }),
  }),
});

export const {
  useAddDrugLocationMutation,
  useEditDrugLocationMutation,
  useDeleteDrugLocationMutation,
  useGetDrugLocationsQuery,
  useGetDrugLocationByIdQuery,
} = drugLocationApi;
