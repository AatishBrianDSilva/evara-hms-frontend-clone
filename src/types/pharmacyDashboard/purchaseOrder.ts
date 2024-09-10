import { IDrugItem, IDrugVendor } from "./master";

export enum EPurchaseOrderStatus {
  Draft = "Draft",
  Approved = "Approved",
  Rejected = "Rejected",
  Ordered = "Ordered",
  PartiallyProcessed = "PartiallyProcessed",
  Processed = "Processed",
}

export interface IPurchaseOrderRequest {
  _id: string;
  items: {
    status: string;
    expiryDate: null;
    batchNo: null;
    freeQuantity: null;
    noOfPacks: null;
    item: IDrugItem;
    packSize: number;
    mrp: number;
    mrpPerPack: number;
    buyPrice: number;
    tax: number;
    quantity: number;
  }[];
  netAmount: number;
  discount: number;
  otherCharges: number;
  subTotal: number;
  tax: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPurchaseOrderResponse {
  poNumber: string;
  date: string | number | Date;

  vendor: any;
  _id: string;
  items: {
    freeQuantity: string;
    noOfPacks: string;
    item: IDrugItem;
    packSize: number;
    batchNo: string;
    expiryDate: Date;
    mrp: number;
    mrpPerPack: number;
    buyPrice: number;
    tax: number;
    quantity: number;
  }[];
  netAmount: number;
  discount: number;
  otherCharges: number;
  subTotal: number;
  tax: number;
  invoice: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPurchaseOrder {
  _id: string;
  branchId: string;
  poNumber: string;
  date: Date;
  vendor: IDrugVendor;
  request: IPurchaseOrderRequest;
  response: IPurchaseOrderResponse;
  branch: string;
  createdBy: string;
  authorizedBy: string;
  status: EPurchaseOrderStatus;
  createdAt: Date;
  updatedAt: Date;
  invoiceNumber: string;
  isDifferentAddress?: Boolean;
  newAddress?: string;
}
