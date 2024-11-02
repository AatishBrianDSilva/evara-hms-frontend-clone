import { createApi } from '@reduxjs/toolkit/query/react';
import generateQueryParams from '../../../utils/generateQueryParams';
import { ApiResponse, IQueryOptions } from '../../../types/global';
import { INotesTreatmentAdvice } from '../../../types/masterDashboard/local';
import { baseQuery } from '../../baseQuery';

export const notesTreatmentAdvicesApi = createApi({
  reducerPath: 'notesTreatmentAdvicesApi',
  baseQuery: baseQuery,
  tagTypes: ['NotesTreatmentAdvices'],
  endpoints: builder => ({
    addNotesTreatmentAdvice: builder.mutation({
      query: notesTreatmentAdviceData => ({
        url: 'master/notes/treatment-advice/add',
        method: 'POST',
        body: notesTreatmentAdviceData,
      }),
      invalidatesTags: ['NotesTreatmentAdvices'],
    }),
    updateNotesTreatmentAdvice: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `master/notes/treatment-advice/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['NotesTreatmentAdvices'],
    }),
    getNotesTreatmentAdvices: builder.query<
      ApiResponse<INotesTreatmentAdvice[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/notes/treatment-advice?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: ['NotesTreatmentAdvices'],
    }),
    getNotesTreatmentAdviceById: builder.query<
      ApiResponse<INotesTreatmentAdvice>,
      string
    >({
      query: id => {
        return { url: `master/notes/treatment-advice/${id}`, method: 'GET' };
      },
      providesTags: ['NotesTreatmentAdvices'],
    }),
    deleteNotesTreatmentAdvice: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/notes/treatment-advice/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['NotesTreatmentAdvices'],
    }),
  }),
});

export const {
  useAddNotesTreatmentAdviceMutation,
  useGetNotesTreatmentAdvicesQuery,
  useUpdateNotesTreatmentAdviceMutation,
  useGetNotesTreatmentAdviceByIdQuery,
  useDeleteNotesTreatmentAdviceMutation,
} = notesTreatmentAdvicesApi;
