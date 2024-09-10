import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, IQueryOptions, PaginatedResponse } from "../../types/global";
import { IPurchaseOrder } from "../../types/pharmacyDashboard/purchaseOrder";
import generateQueryParams from "../../utils/generateQueryParams";
import { baseQuery } from "../baseQuery";

interface PurchaseOrderRequest {
  items: {
    item: string | undefined;
    quantity: number | null;
    mrp: number | null;
    mrpPerPack: number | null;
    buyPrice: number | null;
    tax: number | null;
    freeQuantity: number | null;
    noOfPacks: number | null;
  }[];
  subTotal: number | null;
  tax: number | null;
  discount: number | null;
  otherCharges: number | null;
  netAmount: number | null;
}

interface AddPurchaseOrderPayload {
  date: Date | null;
  vendor: string | undefined;
  request: PurchaseOrderRequest;
}

interface EditPurchaseOrderPayload {
  id: string;
  date: Date | null | undefined;
  vendor: string | undefined;
  request: PurchaseOrderRequest;
  response?: PurchaseOrderRequest;
}

interface EditPurchaseOrderStatusPayload {
  id: string;
  status: string;
}

export const purchaseOrderApi = createApi({
  reducerPath: "purchaseOrderApi",
  baseQuery: baseQuery,
  tagTypes: ["PurchaseOrder", "Stocks"],
  endpoints: (builder) => ({
    addPurchaseOrder: builder.mutation<ApiResponse<IPurchaseOrder>, AddPurchaseOrderPayload>({
      query: (purchaseOrderData) => ({
        url: "pharmacy-dashboard/purchase-order/add",
        method: "POST",
        body: purchaseOrderData,
      }),
      invalidatesTags: ["PurchaseOrder", "Stocks"],
    }),
    editPurchaseOrder: builder.mutation<ApiResponse<IPurchaseOrder>, EditPurchaseOrderPayload>({
      query: (purchaseOrderData) => ({
        url: `pharmacy-dashboard/purchase-order/${purchaseOrderData.id}`,
        method: "PUT",
        body: purchaseOrderData,
      }),
      invalidatesTags: ["PurchaseOrder", "Stocks"],
    }),
    editPurchaseOrderStatus: builder.mutation<
      ApiResponse<IPurchaseOrder>,
      EditPurchaseOrderStatusPayload
    >({
      query: (purchaseOrderData) => ({
        url: `pharmacy-dashboard/purchase-order/${purchaseOrderData.id}/status`,
        method: "PATCH",
        body: purchaseOrderData,
      }),
      invalidatesTags: ["PurchaseOrder", "Stocks"],
    }),

    deletePurchaseOrder: builder.mutation<ApiResponse<null>, string>({
      query: (id: string) => ({
        url: `pharmacy-dashboard/purchase-order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PurchaseOrder", "Stocks"],
    }),
    getPurchaseOrders: builder.query<ApiResponse<PaginatedResponse<IPurchaseOrder>>, IQueryOptions>(
      {
        query: (options) => {
          const queryParams = generateQueryParams(options);
          return {
            url: `pharmacy-dashboard/purchase-order?${queryParams}`,
            method: "GET",
          };
        },
        providesTags: (_result, _error, _args) => ["PurchaseOrder"],
      }
    ),
    getProcessedPurchaseOrders: builder.query<
      ApiResponse<PaginatedResponse<IPurchaseOrder>>,
      IQueryOptions
    >({
      query: (options) => {
        const queryParams = generateQueryParams(options);
        return {
          url: `pharmacy-dashboard/processed-purchase-order?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, _args) => ["PurchaseOrder"],
    }),
    getPurchaseOrderById: builder.query<ApiResponse<IPurchaseOrder>, string>({
      query: (id) => `pharmacy-dashboard/purchase-order/${id}`,
      providesTags: (_result, _error, id) => [{ type: "PurchaseOrder", id }],
    }),
    updateStockFromPurchaseOrder: builder.mutation<ApiResponse<any>, { purchaseOrderId: string }>({
      query: ({ purchaseOrderId }) => ({
        url: `pharmacy-dashboard/purchase-order/${purchaseOrderId}/update-stock`,
        method: "PATCH",
      }),
      invalidatesTags: ["Stocks", "PurchaseOrder"],
    }),
    updatePartialPurchaseOrder: builder.mutation<
      ApiResponse<IPurchaseOrder>,
      EditPurchaseOrderPayload
    >({
      query: (purchaseOrderData) => ({
        url: `pharmacy-dashboard/purchase-order/${purchaseOrderData.id}/update-partial`,
        method: "PATCH",
        body: purchaseOrderData,
      }),
      invalidatesTags: ["PurchaseOrder", "Stocks"],
    }),
    updateStockFromPartiallyProcessedPurchaseOrder: builder.mutation<
      ApiResponse<any>,
      { purchaseOrderId: string }
    >({
      query: ({ purchaseOrderId }) => ({
        url: `pharmacy-dashboard/purchase-order/${purchaseOrderId}/update-stock-partial`,
        method: "PATCH",
      }),
      invalidatesTags: ["Stocks", "PurchaseOrder"],
    }),
  }),
});

export const {
  useAddPurchaseOrderMutation,
  useEditPurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
  useGetPurchaseOrdersQuery,
  useGetProcessedPurchaseOrdersQuery,
  useGetPurchaseOrderByIdQuery,
  useEditPurchaseOrderStatusMutation,
  useUpdateStockFromPurchaseOrderMutation,
  useUpdatePartialPurchaseOrderMutation,
  useUpdateStockFromPartiallyProcessedPurchaseOrderMutation,
} = purchaseOrderApi;
