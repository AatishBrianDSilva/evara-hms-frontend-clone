import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "../types/global";
import { IAuthResponse } from "../types/auth";
import { clearCredentials, setCredentials } from "../features/Auth/authSlice"; // import setCredentials action
import { baseQuery } from "./baseQuery";
import { handlePersistorPurge } from "../app/store";

interface ILoginCredentials {
  email: string;
  password: string;
  branchId: string;
  clinicId: string;
}

interface IRefreshToken {
  refreshToken: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    loginUser: builder.mutation<ApiResponse<IAuthResponse>, ILoginCredentials>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      // Additional transform or onQueryStarted can be utilized here
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.tokens) {
            const tokens = data.data.tokens;
            dispatch(
              setCredentials({
                authToken: tokens.token,
                refreshToken: tokens.refreshToken,
              })
            );
          }
        } catch (error) {
          console.error("Error handling login:", error);
        }
      },
    }),
    refreshToken: builder.mutation<ApiResponse<IAuthResponse>, IRefreshToken>({
      query: ({ refreshToken }) => ({
        url: "auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        console.log("Refreshing token...");
        try {
          const { data } = await queryFulfilled;
          const tokens: any = data.data;
          if (tokens) {
            console.log("Token refreshed successfully");
            dispatch(
              setCredentials({
                authToken: tokens.token,
                refreshToken: tokens.refreshToken,
              })
            );
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          dispatch(clearCredentials()); // Clear tokens if refresh fails
          handlePersistorPurge();
        }
      },
    }),
  }),
});

export const { useLoginUserMutation, useRefreshTokenMutation } = authApi;
