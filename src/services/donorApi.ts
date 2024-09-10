import { createApi } from "@reduxjs/toolkit/query/react";
import generateQueryParams from "../utils/generateQueryParams";
import { ApiResponse, IQueryOptions, PaginatedResponse } from "../types/global";
import { baseQuery } from "./baseQuery";
import { IDonor } from "../types/donor";

export const donorApi = createApi({
  reducerPath: "donorApi",
  baseQuery: baseQuery,
  tagTypes: ["Donor", "Patient"],
  endpoints: (builder) => ({
    addDonor: builder.mutation({
      query: (data) => ({
        url: "/master/donors/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Donor"],
    }),
    updateDonor: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/master/donors/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["Donor"],
    }),
    getdonor: builder.query<ApiResponse<PaginatedResponse<IDonor>>, IQueryOptions>({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return { url: `/master/donors?${queryParams}`, method: "GET" };
      },
      providesTags: ["Donor"],
    }),
    // getDonorById: builder.query({
    getDonorById: builder.query<ApiResponse<IDonor>, string>({
      query: (id) => {
        return { url: `/master/donors/${id}`, method: "GET" };
      },
      providesTags: ["Donor"],
    }),
    deleteDonor: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `/master/donors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Donor"],
    }),
    assignCaseToDonor: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/master/donors/${id}/assign-to-case`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: ["Donor", "Patient"],
    }),
  }),
});

export const {
  useAddDonorMutation,
  useGetdonorQuery,
  useUpdateDonorMutation,
  useGetDonorByIdQuery,
  useDeleteDonorMutation,
  useAssignCaseToDonorMutation,
} = donorApi;
