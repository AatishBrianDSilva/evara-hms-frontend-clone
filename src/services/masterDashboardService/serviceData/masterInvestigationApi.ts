import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, IQueryOptions } from "../../../types/global";
import generateQueryParams from "../../../utils/generateQueryParams";
import { baseQuery } from "../../baseQuery";
import { IMasterInvestigation } from "../../../types/master";

export const masterInvestigationApi = createApi({
  reducerPath: "masterInvestigationApi",
  baseQuery: baseQuery,
  tagTypes: ["MasterInvestigation"],
  endpoints: (builder) => ({
    addMasterInvestigation: builder.mutation<ApiResponse<any>, any>({
      query: (investigationData) => ({
        url: "master/investigations/add",
        method: "POST",
        body: investigationData,
      }),
      invalidatesTags: ["MasterInvestigation"],
    }),
    editMasterInvestigation: builder.mutation<ApiResponse<any>, any>({
      query: (investigationData) => ({
        url: `master/investigations/${investigationData.id}`,
        method: "PUT",
        body: investigationData,
      }),
      invalidatesTags: ["MasterInvestigation"],
    }),
    deleteMasterInvestigation: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/investigations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MasterInvestigation"],
    }),
    getMasterInvestigations: builder.query<ApiResponse<IMasterInvestigation[]>, IQueryOptions>({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/investigations?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["MasterInvestigation"],
    }),
    getMasterInvestigationById: builder.query<ApiResponse<IMasterInvestigation>, string>({
      query: (id: string) => `master/investigations/${id}`,
      providesTags: (_result, _error, id) => [{ type: "MasterInvestigation", id }],
    }),
    getMasterDefaultInvestigations: builder.query<ApiResponse<any[]>, IQueryOptions>({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/investigations/default?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["MasterInvestigation"],
    }),
    addMasterMedicalTest: builder.mutation<ApiResponse<any>, any>({
      query: (investigationData) => ({
        url: "master/investigations/bloodtests/add",
        method: "POST",
        body: investigationData,
      }),
      invalidatesTags: ["MasterInvestigation"],
    }),
  }),
});

export const {
  useAddMasterInvestigationMutation,
  useEditMasterInvestigationMutation,
  useDeleteMasterInvestigationMutation,
  useGetMasterInvestigationsQuery,
  useGetMasterInvestigationByIdQuery,
  useGetMasterDefaultInvestigationsQuery,
  useAddMasterMedicalTestMutation,
} = masterInvestigationApi;
