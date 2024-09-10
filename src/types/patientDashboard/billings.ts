export enum EPatientBillingStatus {
  Pending = "Pending",
  Advance = "Advance",
  Refunded = "Refunded",
  Paid = "Paid",
  Archived = "Archived",
}

export enum EPaitentBillingPaymentType {
  Payment = "Payment",
  Refund = "Refund",
  Advance = "Advance",
}

export enum EPatientBillingServiceType {
  Investigation = "Investigation",
  Procedure = "Procedure",
  Medicine = "Medicine",
  Service = "Service",
  CryoPreservation = "CryoPreservation",
  TreatmentCycle = "TreatmentCycle",
}

export enum EPaymentMethod {
  Cash = "Cash",
  CreditCard = "CreditCard",
  BankTransfer = "BankTransfer",
  Online = "Online",
  UPI = "UPI",
}

interface PaymentDetail {
  amount: number;
  method: EPaymentMethod;
  paymentDate?: Date;
}

interface Item {
  batchNo: string;
  estimationId: string;
  masterServiceId: string;
  serviceId?: string;
  serviceName: string;
  serviceType: EPatientBillingServiceType;
  doctorId: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

export interface IPatientBilling {
  pharmacyData?: any;
  _id: string;
  billingId: string;
  clinicId: string;
  branchId?: string;
  patientCode: string;
  items: Item[];
  amount: number;
  discount: number;
  discountReason: string;
  discountFile: string;
  discountInPercentage: number;
  tax: number;
  payments: PaymentDetail[];
  status: EPatientBillingStatus;
  createdBy: string;
  modifiedBy?: string;
  modifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  subTotal: number;
  grandTotal: number;
  totalPaid: number;
  totalDue: number;
  totalRefunded: number;
  totalAdvance: number;
  billType?: string;
}

export interface IPatientBillingEstimation {
  _id: string;
  clinicId: string;
  branchId: string;
  patientCode: string;
  doctorId: string;
  masterServiceId: string;
  serviceId?: string;
  serviceName: string;
  serviceType: EPatientBillingServiceType;
  quantity: number;
  estimatedTax: number;
  taxRate: number;
  cost: number;
  estimatedPrice: number;
  estimatedTotal: number;
  status: string;
}
