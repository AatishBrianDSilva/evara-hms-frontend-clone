import { createApi } from "@reduxjs/toolkit/query/react";
import generateQueryParams from "../../utils/generateQueryParams";
import { ApiResponse, IQueryOptions } from "../../types/global";
import { baseQuery } from "../baseQuery";

export const patientReportsApi = createApi({
  reducerPath: "patientReportsApi",
  baseQuery: baseQuery,
  tagTypes: ["PatientReports"],
  endpoints: (builder) => ({
    getReports: builder.query<ApiResponse<any>, IQueryOptions>({
      query: (options: IQueryOptions) => {
        console.log("api test", options);
        const queryParams = generateQueryParams(options);
        return { url: `reports?${queryParams}`, method: "GET" };
      },
      providesTags: (_result, _error, _args) => ["PatientReports"],
    }),
    getReportById: builder.query<ApiResponse<any>, string>({
      query: (id: string) => {
        return { url: `reports/patient/${id}`, method: "GET" };
      },
      providesTags: (_result, _error, id) => [{ type: "PatientReports", id }],
    }),
  }),
});

export const { useGetReportsQuery, useGetReportByIdQuery } = patientReportsApi;
