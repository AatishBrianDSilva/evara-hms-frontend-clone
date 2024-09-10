import { IDrugLocation } from "./master";
import { IPharmacyStock } from "./stocks";

export enum EInternalOrderStatus {
  Draft = "Draft",
  Approved = "Approved",
  Rejected = "Rejected",
  Processed = "Processed",
}

export interface IInternalOrderItems {
  _id: string;
  item: IPharmacyStock;
  transferFrom: {
    location: IDrugLocation;
    quantity: number;
  };
  transferTo: IDrugLocation;
  batches: {
    batchId: string;
    deductedQuantity: number;
  }[];
  quantity: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInternalOrder {
  _id: string;
  branchId: string;
  ioNumber: string;
  date: Date;
  items: IInternalOrderItems[];
  createdBy: string;
  authorizedBy: string;
  status: EInternalOrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
