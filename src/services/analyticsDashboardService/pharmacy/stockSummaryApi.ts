import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, IQueryOptions, PaginatedResponse } from "../../../types/global";
import generateQueryParams from "../../../utils/generateQueryParams";
import { baseQuery } from "../../baseQuery";

export const stockSummaryApi = createApi({
  reducerPath: "stockSummaryApi",
  baseQuery: baseQuery,
  tagTypes: ["Stocks"],
  endpoints: (builder) => ({
    getStockSummary: builder.query<ApiResponse<PaginatedResponse<any>>, IQueryOptions>({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return { url: `analytics/pharmacy/stock-summary?${queryParams}`, method: "GET" };
      },
      providesTags: (_result, _error, _args) => ["Stocks"],
    }),
  }),
});

export const { useGetStockSummaryQuery } = stockSummaryApi;
