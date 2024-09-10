import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, IQueryOptions } from "../../../types/global";
import generateQueryParams from "../../../utils/generateQueryParams";
import { baseQuery } from "../../baseQuery";
import { IDefaultService, IMasterService } from "../../../types/master";

export const masterServicesApi = createApi({
  reducerPath: "masterServicesApi",
  baseQuery: baseQuery,
  tagTypes: ["MasterService"],
  endpoints: (builder) => ({
    addMasterService: builder.mutation<ApiResponse<any>, any>({
      query: (masterData) => ({
        url: "master/services/add",
        method: "POST",
        body: masterData,
      }),
      invalidatesTags: ["MasterService"],
    }),
    editMasterService: builder.mutation<ApiResponse<any>, any>({
      query: ({ id, ...masterData }) => ({
        url: `master/services/${id}`,
        method: "PUT",
        body: masterData,
      }),
      invalidatesTags: ["MasterService"],
    }),
    deleteMasterService: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MasterService"],
    }),
    getMasterServices: builder.query<
      ApiResponse<IMasterService[]>,
      IQueryOptions
    >({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/services?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["MasterService"],
    }),
    getMasterServiceById: builder.query<ApiResponse<IMasterService>, string>({
      query: (id: string) => `master/services/${id}`,
      providesTags: (_result, _error, id) => [{ type: "MasterService", id }],
    }),
    getMasterDefaultServices: builder.query<
      ApiResponse<IDefaultService[]>,
      IQueryOptions
    >({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/services/default?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["MasterService"],
    }),
  }),
});

export const {
  useAddMasterServiceMutation,
  useEditMasterServiceMutation,
  useDeleteMasterServiceMutation,
  useGetMasterServicesQuery,
  useGetMasterServiceByIdQuery,
  useGetMasterDefaultServicesQuery,
} = masterServicesApi;
