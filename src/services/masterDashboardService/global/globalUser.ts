import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, IQueryOptions } from "../../../types/global";
import generateQueryParams from "../../../utils/generateQueryParams";
import { baseQuery } from "../../baseQuery";
import { IGlobalUser } from "../../../types/serviceDashboard/user";

export const globalUserApi = createApi({
  reducerPath: "globalUserApi",
  baseQuery: baseQuery,
  tagTypes: ["Global User"],
  endpoints: (builder) => ({
    addGlobalUser: builder.mutation<ApiResponse<any>, any>({
      query: (userData) => ({
        url: "master/users/add",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Global User"],
    }),
    editGlobalUser: builder.mutation<ApiResponse<any>, any>({
      query: (userData) => ({
        url: "master/users/",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Global User"],
    }),
    editGlobalUserPassword: builder.mutation<ApiResponse<any>, any>({
      query: (userData) => ({
        url: "master/users/change-password",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Global User"],
    }),
    deleteGlobalUser: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Global User"],
    }),
    getGlobalUsers: builder.query<ApiResponse<IGlobalUser[]>, IQueryOptions>({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/users?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["Global User"],
    }),
    getGlobalUserById: builder.query<ApiResponse<IGlobalUser>, string>({
      query: (id: string) => `master/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Global User", id }],
    }),
  }),
});

export const {
  useAddGlobalUserMutation,
  useEditGlobalUserMutation,
  useEditGlobalUserPasswordMutation,
  useDeleteGlobalUserMutation,
  useGetGlobalUsersQuery,
  useGetGlobalUserByIdQuery,
} = globalUserApi;
