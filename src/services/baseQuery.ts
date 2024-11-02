import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { RootState } from '../app/store';
import { API_BASE_URL } from '../utils/apiConfig';

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
