import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from '../../types/global';
import generateQueryParams from '../../utils/generateQueryParams';
import { baseQuery } from '../baseQuery';

interface IInternalTransferItems {
  item: string | undefined;
  quantity: number;
  notes?: string;
  transferFrom:
    | {
        location: string | undefined;
        quantity: number;
      }
    | undefined;
}

interface AddInternalConsumptionPayload {
  date: Date | null;
  items: IInternalTransferItems[];
}

interface IInternalConsumption {
  drugName?: string;
  batchNo?: any;
  icNumber?: any;
  _id: string;
  date: Date;
  items: IInternalTransferItems[];
  createdBy: string;
}

export const internalConsumptionApi = createApi({
  reducerPath: 'internalConsumptionApi',
  baseQuery: baseQuery,
  tagTypes: ['InternalConsumption', 'Stocks'],
  endpoints: builder => ({
    addInternalConsumption: builder.mutation<
      ApiResponse<IInternalConsumption>,
      AddInternalConsumptionPayload
    >({
      query: internalConsumptionData => ({
        url: 'pharmacy-dashboard/internal-consumption/create',
        method: 'POST',
        body: internalConsumptionData,
      }),
      invalidatesTags: ['InternalConsumption', 'Stocks'],
    }),
    // editInternalConsumption: builder.mutation<
    //   ApiResponse<IInternalConsumption>,
    //   EditInternalConsumptionPayload
    // >({
    //   query: (internalConsumptionData) => ({
    //     url: `pharmacy-dashboard/internal-consumption/${internalConsumptionData.id}`,
    //     method: "PUT",
    //     body: internalConsumptionData,
    //   }),
    //   invalidatesTags: ["InternalConsumption"],
    // }),
    // deleteInternalConsumption: builder.mutation<ApiResponse<null>, string>({
    //   query: (id: string) => ({
    //     url: `pharmacy-dashboard/internal-consumption/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["InternalConsumption"],
    // }),
    getInternalConsumptions: builder.query<
      ApiResponse<PaginatedResponse<IInternalConsumption>>,
      IQueryOptions
    >({
      query: options => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/internal-consumption?${queryParams}`,
          method: 'GET',
        };
      },
      providesTags: (_result, _error, _args) => ['InternalConsumption'],
    }),
    getInternalConsumptionById: builder.query<
      ApiResponse<IInternalConsumption>,
      string
    >({
      query: id => `pharmacy-dashboard/internal-consumption/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'InternalConsumption', id },
      ],
    }),
  }),
});

export const {
  useAddInternalConsumptionMutation,
  // useEditInternalConsumptionMutation,
  // useDeleteInternalConsumptionMutation,
  useGetInternalConsumptionsQuery,
  useGetInternalConsumptionByIdQuery,
} = internalConsumptionApi;
