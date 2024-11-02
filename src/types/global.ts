export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  records: T[];
  pagination: IPagination;
  summary?: Record<string, any>;
}

export interface IQueryOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, any>;
  select?: string;
  lean?: boolean;
  leanWithId?: boolean;
  paginate?: boolean;
  filters?: Record<string, any>; // Generic filtering options
  populate?: string | Record<string, any>;
  conditions?: Record<string, any>; // Specific rules
  searchQuery?: string;
  locationQuery?: string;
  dateRange?: { startDate: string | undefined; endDate: string | undefined };
}

export interface IPagination {
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number | undefined;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null | undefined;
  nextPage: number | null | undefined;
}

// For filtering options
export interface FilterOptionType {
  _id: string;
  [key: string]: any; // Other fields can be anything
}

export enum EIVFRegistrationTabPaths {
  Patient = 'patient',
  DonorBank = 'donor-bank',
  DonorHospital = 'donor-hospital',
}

export enum EPatientTabPaths {
  Journey = 'journey',
  Notes = 'notes',
  History = 'history',
  Appointment = 'appointment',
  Pharmacy = 'pharmacy',
  Report = 'report',
  Billings = 'billings',
}

export enum EJourneyTabPaths {
  Timeline = 'timeline',
  Investigations = 'investigations',
  Packages = 'packages',
  TreatmentAdvice = 'treatmentAdvice',
  Procedure = 'procedure',
  CryoPreservation = 'cryo-preservation',
  Services = 'services',
  Cycle = 'cycle',
}

export enum EBillingsTabPaths {
  Estimation = 'estimation',
  Pending = 'pending',
  // Advance = "advance",
  Paid = 'paid',
  Refund = 'refund',
  // Archieved = "archieved",
  // Transactions = "transactions",
}

export enum EPurchaseOrderTabPaths {
  Draft = 'draft',
  Approved = 'approved',
  Rejected = 'rejected',
  Ordered = 'ordered',
  PartiallyProcessed = 'partially-processed',
  Processed = 'processed',
}

export enum EInternalOrdersTabPaths {
  Draft = 'draft',
  Approved = 'approved',
  Rejected = 'rejected',
  Processed = 'processed',
}

export enum EMasterDashboardTabPaths {
  Local = 'local',
  Global = 'global',
  ServiceData = 'service-data',
}

export enum EBuckets {
  UserProfiles = 'evara-hms-user-profiles',
  UserReports = 'evara-hms-user-reports',
  PharmacyInvoices = 'evara-hms-pharmacy-invoices',
  UserIdentifications = 'evara-hms-user-identifications',
}

export enum EDocumentTypes {
  Investigation = 'Investigation',
  Procedure = 'Procedure',
  CryoPreservation = 'Cryo Preservation',
  TreatmentCycle = 'Treatment-Cycle',
  MedicalHistory = 'Medical-History',
  Invoice = 'Invoice',
  Billing = 'Billing',
  BillingDiscount = 'BillingDiscount',
}
