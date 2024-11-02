import { createApi } from '@reduxjs/toolkit/query/react';
import generateQueryParams from '../../../utils/generateQueryParams';
import { ApiResponse, IQueryOptions } from '../../../types/global';
import { INotesObservation } from '../../../types/masterDashboard/local';
import { baseQuery } from '../../baseQuery';

export const notesObservationsApi = createApi({
  reducerPath: 'notesObservationsApi',
  baseQuery: baseQuery,
  tagTypes: ['NotesObservations'],
  endpoints: builder => ({
    addNotesObservation: builder.mutation({
      query: notesObservationData => ({
        url: 'master/notes/observation/add',
        method: 'POST',
        body: notesObservationData,
      }),
      invalidatesTags: ['NotesObservations'],
    }),
    updateNotesObservation: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `master/notes/observation/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['NotesObservations'],
    }),
    getNotesObservations: builder.query<
      ApiResponse<INotesObservation[]>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `master/notes/observation?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: ['NotesObservations'],
    }),
    getNotesObservationById: builder.query<
      ApiResponse<INotesObservation>,
      string
    >({
      query: id => {
        return { url: `master/notes/observation/${id}`, method: 'GET' };
      },
      providesTags: ['NotesObservations'],
    }),
    deleteNotesObservation: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `master/notes/observation/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['NotesObservations'],
    }),
  }),
});

export const {
  useAddNotesObservationMutation,
  useGetNotesObservationsQuery,
  useUpdateNotesObservationMutation,
  useGetNotesObservationByIdQuery,
  useDeleteNotesObservationMutation,
} = notesObservationsApi;
