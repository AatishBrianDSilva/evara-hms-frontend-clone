import { createApi } from "@reduxjs/toolkit/query/react";

import generateQueryParams from "../../utils/generateQueryParams";
import { ApiResponse, IQueryOptions } from "../../types/global";
import { IPatientNotes } from "../../types/patientDashboard/notes";
import { baseQuery } from "../baseQuery";

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: baseQuery,
  tagTypes: ["Notes"],
  endpoints: (builder) => ({
    getNotes: builder.query<ApiResponse<IPatientNotes>, IQueryOptions>({
      query: (options: IQueryOptions) => {
        console.log("api test", options);
        const queryParams = generateQueryParams(options);
        return { url: `notes?${queryParams}`, method: "GET" };
      },
      providesTags: (_result, _error, _args) => ["Notes"],
    }),
    getNotesById: builder.query<ApiResponse<IPatientNotes>, string>({
      query: (id: string) => {
        return { url: `notes/${id}`, method: "GET" };
      },
      providesTags: (_result, _error, id) => [{ type: "Notes", id }],
    }),
    addNotes: builder.mutation<ApiResponse<IPatientNotes>, any>({
      query: (notesData) => ({
        url: "notes/add",
        method: "POST",
        body: notesData,
      }),
      invalidatesTags: ["Notes"],
    }),
    editNotes: builder.mutation<ApiResponse<IPatientNotes>, any>({
      query: (notesData) => ({
        url: `notes/${notesData._id}`,
        method: "PUT",
        body: notesData,
      }),
      invalidatesTags: ["Notes"],
    }),
    deleteNotes: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const {
  useAddNotesMutation,
  useGetNotesQuery,
  useGetNotesByIdQuery,
  useEditNotesMutation,
  useDeleteNotesMutation,
} = notesApi;
