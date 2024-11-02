import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponse, EBuckets, EDocumentTypes } from '../types/global';
import { baseQuery } from './baseQuery';

interface GetSignedUrlResponse {
  url: string;
  key: string;
  bucketName: string;
  region: string;
}

interface GetSignedUrlRequest {
  userId: string;
  bucket: EBuckets;
  documentType?: EDocumentTypes;
  operation: 'putObject' | 'getObject';
  fileName: string;
  expires?: number; // Seconds
  isImage: boolean;
  reportId?: string;
}

interface DeleteFileRequest {
  bucket: EBuckets;
  key: string;
}

export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: baseQuery,
  endpoints: builder => ({
    getSignedUrl: builder.mutation<
      ApiResponse<GetSignedUrlResponse>,
      GetSignedUrlRequest
    >({
      query: body => ({
        url: 'files/get-signed-url',
        method: 'POST',
        body,
      }),
    }),
    deleteFile: builder.mutation<void, DeleteFileRequest>({
      query: body => ({
        url: 'files/delete',
        method: 'DELETE',
        body,
      }),
    }),
  }),
});

export const { useGetSignedUrlMutation, useDeleteFileMutation } = fileApi;
