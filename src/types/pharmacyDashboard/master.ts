export interface IDrugCategory {
  _id: string;
  name: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  status: "Active" | "Inactive";
}

export interface IDrugType {
  _id: string;
  name: string;
  shortcode: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  status: "Active" | "Inactive";
}

export interface ITaxRate {
  _id: string;
  taxRate: number;
  notes: string;
  createdAt: Date;
  status: "Active" | "Inactive";
}

export interface IDrugManufacturer {
  _id: string;
  name: string;
  category: IDrugCategory[];
  taxRate: ITaxRate;
  cst: string;
  apgst: string;
  pan: string;
  tin: string;
  contact: {
    person: string;
    phone: string;
    email: string;
    website?: string;
  };
  address: {
    addressLine1: string;
    addressLine2?: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
  };
  status: "Active" | "Inactive";
}

export interface IDrugItem {
  _id: string;
  name: string;
  genericName: string;
  drugClass: EDrugClass;
  code: string;
  hsnCode: string;
  category: IDrugCategory;
  type?: IDrugType;
  packSize: number;
  taxRate: ITaxRate;
  mrp: number;
  rate: number;
  freeQuantity: number;
  manufacturer: IDrugManufacturer;
  status: "Active" | "Inactive";
  criticalCount?: number;
}

export interface IDrugLocation {
  _id: string;
  branchId: string;
  location: string;
  notes: string;
  main: boolean;
  status: "Active" | "Inactive";
}

export interface IDrugVendor {
  _id: string;
  branchId: string;
  name: string;
  code: string;
  gst: string;
  pan: string;
  tin: string;
  dl: string;
  contact: {
    person: string;
    phone: string;
    email: string;
  };
  address: {
    addressLine1: string;
    addressLine2: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
  };
  remarks: string;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface ILocationQuantity {
  _id: string;
  location: IDrugLocation;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum EDrugClass {
  ScheduleH1 = "Schedule H1",
  Gas = "Gas",
  ScheduleH = "Schedule H",
  ScheduleX = "Schedule X",
  General = "General",
  ScheduleH2 = "Schedule H2",
  ScheduleII = "Schedule II",
  Surgical = "Surgical",
  IVF = "IVF",
  ScheduleG = "Schedule G",
}
