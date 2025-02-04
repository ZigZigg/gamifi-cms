import type { FetchArgs } from '@reduxjs/toolkit/query/react';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ExampleDatResponse, ExampleDataRequest } from '../../types';
import { axiosBaseQuery } from '../../services/baseQuery';

const baseUrl = process.env.API_ENDPOINT;

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({ baseUrl: baseUrl }),
  tagTypes: ['GAMI_Reward_List', 'GAMI_Reward_History'],
  endpoints: (builder) => ({
    mockData: builder.query<ExampleDatResponse, ExampleDataRequest>({
      query: (params: ExampleDataRequest): FetchArgs => ({
        params,
        url: 'example-mock-data-url-endpoint',
      }),
    }),
  }),
});

export const apiReducer = apiSlice.reducer;
