import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, IQueryOptions, PaginatedResponse } from "../../../types/global";
import { IPatientBilling } from "../../../types/patientDashboard/billings";
import generateQueryParams from "../../../utils/generateQueryParams";
import { baseQuery } from "../../baseQuery";

// Define the salesByScheduleApi
export const salesByScheduleApi = createApi({
  reducerPath: "salesByScheduleApi",
  baseQuery: baseQuery,
  tagTypes: ["Billing", "PatientPharmacy"],
  endpoints: (builder) => ({
    getSalesBySchedule: builder.query<
      ApiResponse<PaginatedResponse<IPatientBilling>>,
      IQueryOptions
    >({
      query: (options) => {
        const queryParams = generateQueryParams(options); // Generate query parameters from options
        return { url: `analytics/pharmacy/sales-by-schedule?${queryParams}`, method: "GET" };
      },
      providesTags: (_result, _error, _args) => ["Billing"],
    }),
  }),
});

export const { useGetSalesByScheduleQuery } = salesByScheduleApi;
