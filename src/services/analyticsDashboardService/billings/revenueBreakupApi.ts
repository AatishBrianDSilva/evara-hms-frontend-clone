import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from "../../../types/global";
import generateQueryParams from "../../../utils/generateQueryParams";
import { baseQuery } from "../../baseQuery";

export interface revenueBreakupResponse {
  totalAmount: number;
  totalRefunded: number;
  createdBy: string;
  paymentMethod: string;
}
export const revenueBreakupApi = createApi({
  reducerPath: "revenueBreakupApi",
  baseQuery: baseQuery,
  tagTypes: ["RevenueBreakup"],
  endpoints: (builder) => ({
    getRevenueBreakup: builder.query<
      ApiResponse<PaginatedResponse<any>>,
      IQueryOptions
    >({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `analytics/billings/revenue-breakup?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["RevenueBreakup"],
    }),
  }),
});

export const { useGetRevenueBreakupQuery } = revenueBreakupApi;
