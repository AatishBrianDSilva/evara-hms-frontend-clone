import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';
import { ApiResponse } from '../../types/global';
import { IPatientTimelineResponse } from '../../types/patientDashboard/investigation';

export const patientTimelineApi = createApi({
  reducerPath: 'patientTimelineApi',
  baseQuery: baseQuery,
  tagTypes: ['PatientTimeline'],
  endpoints: builder => ({
    getPatientTimeline: builder.query<
      ApiResponse<IPatientTimelineResponse[]>,
      { patientId: string }
    >({
      query: ({ patientId }) => {
        return { url: `timeline?patientId=${patientId}`, method: 'GET' };
      },
      providesTags: (_result, _error, { patientId }) => [
        { type: 'PatientTimeline', id: patientId },
      ],
    }),
  }),
});

export const { useGetPatientTimelineQuery } = patientTimelineApi;
