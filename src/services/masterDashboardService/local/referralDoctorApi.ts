import { createApi } from "@reduxjs/toolkit/query/react";
import generateQueryParams from "../../../utils/generateQueryParams";
import { ApiResponse, IQueryOptions } from "../../../types/global";
import { IReferralDoctor } from "../../../types/masterDashboard/local";
import { baseQuery } from "../../baseQuery";

export const referralDoctorsApi = createApi({
  reducerPath: "referralDoctorsApi",
  baseQuery: baseQuery,
  tagTypes: ["ReferralDoctors"],
  endpoints: (builder) => ({
    addReferralDoctor: builder.mutation({
      query: (referralDoctorData) => ({
        url: "master/patient/referral-doctor/add",
        method: "POST",
        body: referralDoctorData,
      }),
      invalidatesTags: ["ReferralDoctors"],
    }),
    updateReferralDoctor: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `master/patient/referral-doctor/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["ReferralDoctors"],
    }),
    getReferralDoctors: builder.query<ApiResponse<IReferralDoctor[]>, IQueryOptions>({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return { url: `master/patient/referral-doctor?${queryParams}`, method: "GET" };
      },
      providesTags: ["ReferralDoctors"],
    }),
    getReferralDoctorById: builder.query<ApiResponse<IReferralDoctor>, string>({
      query: (id) => {
        return { url: `master/patient/referral-doctor/${id}`, method: "GET" };
      },
      providesTags: ["ReferralDoctors"],
    }),
    deleteReferralDoctor: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/patient/referral-doctor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ReferralDoctors"],
    }),
  }),
});

export const {
  useAddReferralDoctorMutation,
  useGetReferralDoctorsQuery,
  useUpdateReferralDoctorMutation,
  useGetReferralDoctorByIdQuery,
  useDeleteReferralDoctorMutation,
} = referralDoctorsApi;
