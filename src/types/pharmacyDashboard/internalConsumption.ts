import { IDrugLocation } from './master';
import { IPharmacyStock } from './stocks';

export interface IInternalConsumptionItems {
  _id: string;
  item: IPharmacyStock;
  location: IDrugLocation;
  batchNo: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInternalConsumption {
  _id: string;
  date: Date;
  items: IInternalConsumptionItems[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
