import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "../../types/global";
import { IPatientHistory } from "../../types/patientDashboard/patientHistory";
import { baseQuery } from "../baseQuery";

interface AddPatientHistoryPayload {
  patientCode: string | undefined;
  medicalHistory: {};
  menstrualAndOvulationHistory: {};
  coitalHistory: {};
  diseaseAdverseEffect: {};
  otherFactorsAdverseEffect: {};
  generalPhysicalExamination: {};
  investigations: {};
  summary: {};
  files: {};
}

interface EditPatientHistoryPayload {
  patientCode: string | undefined;
  medicalHistory: {};
  menstrualAndOvulationHistory: {};
  coitalHistory: {};
  diseaseAdverseEffect: {};
  otherFactorsAdverseEffect: {};
  generalPhysicalExamination: {};
  investigations: {};
  summary: {};
}

export const patientHistoryApi = createApi({
  reducerPath: "patientHistoryApi",
  baseQuery: baseQuery,
  tagTypes: ["PatientHistory"],
  endpoints: (builder) => ({
    addPatientHistory: builder.mutation<
      ApiResponse<IPatientHistory>,
      AddPatientHistoryPayload
    >({
      query: (patientHistoryData) => ({
        url: "history/add",
        method: "POST",
        body: patientHistoryData,
      }),
      invalidatesTags: ["PatientHistory"],
    }),
    getPatientHistory: builder.query<ApiResponse<IPatientHistory>, string>({
      query: (id: string) => {
        return {
          url: `history/${id}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: "PatientHistory", id }],
    }),
    editPatientHistory: builder.mutation<
      ApiResponse<IPatientHistory>,
      EditPatientHistoryPayload
    >({
      query: (patientHistoryData) => ({
        url: `history/${patientHistoryData.patientCode}`,
        method: "PUT",
        body: patientHistoryData,
      }),
      invalidatesTags: ["PatientHistory"],
    }),
  }),
});

export const {
  useAddPatientHistoryMutation,
  useEditPatientHistoryMutation,
  useGetPatientHistoryQuery,
} = patientHistoryApi;
