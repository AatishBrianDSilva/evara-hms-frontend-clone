import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { RootState } from '../app/store';
import { API_BASE_URL, API_BASE_URL2 } from '../utils/apiConfig';

export const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.tokens?.authToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const analyticsBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL2,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.tokens?.authToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
