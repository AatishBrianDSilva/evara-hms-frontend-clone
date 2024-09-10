import { IDoctor } from "../doctor";
import { IDrugLocation } from "../pharmacyDashboard/master";
import { IPharmacyStock } from "../pharmacyDashboard/stocks";

export interface IPatientPharmacy {
  _id: string;
  patient: string;
  item: {
    stock: IPharmacyStock;
    details: {
      location: IDrugLocation;
      quantity: number;
      batchNumber: string;
    }[];
  };
  doctor: IDoctor;
  date: Date;
  allocatedBy: string;
  totalQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}
