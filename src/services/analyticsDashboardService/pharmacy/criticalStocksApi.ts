import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, IQueryOptions, PaginatedResponse } from "../../../types/global";
import generateQueryParams from "../../../utils/generateQueryParams";
import { baseQuery } from "../../baseQuery";

export const criticalStocksApi = createApi({
  reducerPath: "criticalStocksApi",
  baseQuery: baseQuery,
  tagTypes: ["Stocks"],
  endpoints: (builder) => ({
    getCriticalStocks: builder.query<ApiResponse<PaginatedResponse<any>>, IQueryOptions>({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return { url: `analytics/pharmacy/critical-stocks?${queryParams}`, method: "GET" };
      },
      providesTags: (_result, _error, _args) => ["Stocks"],
    }),
  }),
});

export const { useGetCriticalStocksQuery } = criticalStocksApi;
