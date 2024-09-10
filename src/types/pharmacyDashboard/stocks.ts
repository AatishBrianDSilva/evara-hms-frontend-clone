import { IDrugItem, IDrugLocation, IDrugVendor } from "./master";

export interface ILocationQuantity {
  location: IDrugLocation;
  quantity: number;
}

export interface IStockBatchDetails {
  _id: string;
  batchNo: string;
  expiryDate: Date;
  vendor: IDrugVendor;
  pricePerPack: number;
  packSize: number;
  sellPrice: number;
  locations: ILocationQuantity[];
}

export interface IPaginatedPharmacyStock {
  mrpPerItem: number;
  _id: string;
  branchId: string;
  item: IDrugItem;
  batches: IStockBatchDetails[];
  totalQuantity: number;
  latestExpiryDate: Date;
  quantityOnHold: number;
  createdAt: Date;
  updatedAt: Date;
  sellPrice?: string;
}

export interface IPharmacyStock {
  _id: string;
  item: IDrugItem;
  locations: {
    location: IDrugLocation;
    quantity: number;
    batches: {
      batchNo: string;
      quantity: number;
    }[];
  }[];
  totalQuantity: number;
  sellPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
