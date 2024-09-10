import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  IQueryOptions,
  PaginatedResponse,
} from "../../types/global";
import { IInternalOrder } from "../../types/pharmacyDashboard/internalOrder";
import generateQueryParams from "../../utils/generateQueryParams";
import { baseQuery } from "../baseQuery";

interface IInternalOrderItems {
  item: string | undefined;
  quantity: number;
  notes?: string;
  transferFrom:
    | {
        location: string | undefined;
        quantity: number;
      }
    | undefined;
  transferTo: string | undefined;
}

interface AddInternalOrderPayload {
  date: Date | null;
  items: IInternalOrderItems[];
}

interface EditInternalOrderPayload {
  id: string;
  date: Date | null | undefined;
  items: IInternalOrderItems[];
}

interface EditInternalOrderStatusPayload {
  id: string;
  status: string;
}

export const internalOrderApi = createApi({
  reducerPath: "internalOrderApi",
  baseQuery: baseQuery,
  tagTypes: ["InternalOrder", "Stocks"],
  endpoints: (builder) => ({
    createInternalOrderDraft: builder.mutation<
      ApiResponse<IInternalOrder>,
      AddInternalOrderPayload
    >({
      query: (internalOrderData) => ({
        url: "pharmacy-dashboard/internal-order/create-draft",
        method: "POST",
        body: internalOrderData,
      }),
      invalidatesTags: ["InternalOrder", "Stocks"],
    }),
    approveInternalOrder: builder.mutation<ApiResponse<IInternalOrder>, string>(
      {
        query: (id) => ({
          url: `pharmacy-dashboard/internal-order/${id}/approve`,
          method: "PATCH",
        }),
        invalidatesTags: ["InternalOrder", "Stocks"],
      }
    ),
    rejectInternalOrder: builder.mutation<ApiResponse<IInternalOrder>, string>({
      query: (id) => ({
        url: `pharmacy-dashboard/internal-order/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["InternalOrder", "Stocks"],
    }),
    processInternalOrder: builder.mutation<ApiResponse<IInternalOrder>, string>(
      {
        query: (id) => ({
          url: `pharmacy-dashboard/internal-order/${id}/process`,
          method: "PATCH",
        }),
        invalidatesTags: ["InternalOrder", "Stocks"],
      }
    ),
    editInternalOrder: builder.mutation<
      ApiResponse<IInternalOrder>,
      EditInternalOrderPayload
    >({
      query: (internalOrderData) => ({
        url: `pharmacy-dashboard/internal-order/${internalOrderData.id}`,
        method: "PUT",
        body: internalOrderData,
      }),
      invalidatesTags: ["InternalOrder"],
    }),
    editInternalOrderStatus: builder.mutation<
      ApiResponse<IInternalOrder>,
      EditInternalOrderStatusPayload
    >({
      query: (internalOrderData) => ({
        url: `pharmacy-dashboard/internal-order/${internalOrderData.id}/status`,
        method: "PATCH",
        body: internalOrderData,
      }),
      invalidatesTags: ["InternalOrder"],
    }),

    deleteInternalOrder: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `pharmacy-dashboard/internal-order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InternalOrder"],
    }),
    getInternalOrders: builder.query<
      ApiResponse<PaginatedResponse<IInternalOrder>>,
      IQueryOptions
    >({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/internal-order?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["InternalOrder"],
    }),
    getInternalOrderById: builder.query<ApiResponse<IInternalOrder>, string>({
      query: (id) => `pharmacy-dashboard/internal-order/${id}`,
      providesTags: (_result, _error, id) => [{ type: "InternalOrder", id }],
    }),
    updateStockFromInternalOrder: builder.mutation<
      ApiResponse<any>,
      { internalOrderId: string }
    >({
      query: ({ internalOrderId }) => ({
        url: `pharmacy-dashboard/internal-order/${internalOrderId}/update-stock`,
        method: "PATCH",
      }),
      invalidatesTags: ["Stocks", "InternalOrder"],
    }),
  }),
});

export const {
  useCreateInternalOrderDraftMutation,
  useApproveInternalOrderMutation,
  useRejectInternalOrderMutation,
  useProcessInternalOrderMutation,
  useEditInternalOrderMutation,
  useDeleteInternalOrderMutation,
  useGetInternalOrdersQuery,
  useGetInternalOrderByIdQuery,
  useEditInternalOrderStatusMutation,
  useUpdateStockFromInternalOrderMutation,
} = internalOrderApi;
