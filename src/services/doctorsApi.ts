import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../utils/apiConfig";
import { IQueryOptions } from "../types/types";
import generateQueryParams from "../utils/generateQueryParams";

export const doctorsApi = createApi({
  reducerPath: "doctorsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Doctors"],
  endpoints: (builder) => ({
    addDoctor: builder.mutation({
      query: (doctorData) => ({
        url: "doctors/add",
        method: "POST",
        body: doctorData,
      }),
      invalidatesTags: ["Doctors"],
    }),
    updateDoctor: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `doctors/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Doctors", id }],
    }),
    getDoctors: builder.query({
      query: (options: IQueryOptions) => {
        const queryParams = generateQueryParams(options);
        return { url: `doctors?${queryParams}`, method: "GET" };
      },
      providesTags: ["Doctors"],
    }),

    getDoctorById: builder.query({
      query: (id: string) => {
        return { url: `doctors/${id}`, method: "GET" };
      },
      providesTags: ["Doctors"],
    }),
  }),
});

export const {
  useAddDoctorMutation,
  useGetDoctorsQuery,
  useUpdateDoctorMutation,
  useGetDoctorByIdQuery,
} = doctorsApi;
