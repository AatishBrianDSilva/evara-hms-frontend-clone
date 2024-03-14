export interface IQueryOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, any>;
  select?: string;
  lean?: boolean;
  leanWithId?: boolean;
  paginate?: boolean;
  filters?: Record<string, any>; // Generic filtering options
}

export interface ICase {
  _id: string;
  patientId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  caseId: string;
  __v: number;
  partnerId: string;
}

export interface IDonor {
  _id: string;
  donorId: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  image: string;
}

export interface IAppointment {
  _id: string;
  clinicId: string;
  branchId: string;
  doctorId: string;
  patientId?: string;
  date: Date;
  time: string;
  fullName?: string;
  phone?: string;
  city?: string;
  reason: string;
  mode: string;
  source: string;
  notes: string;
  status: string;
}

export interface IPatient {
  _id: string;
  clinicId: string;
  branchId: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  dob: string;
  education: string;
  maritalStatus: string;
  bloodGroup: string;
  countryBirth: string;
  nationality: string;
  motherTounge: string;
  occupation: string;
  religion: string;
  mobile: string;
  alernativeMobile: string;
  email: string;
  dependentType: string;
  dependentName: string;
  dependentRelation: string;
  dependentMobile: string;
  dependentEmail: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  pincode: string;
  idProofType: string;
  idProofNumber: string;
  idProofIssuedCountry: string;
  ABHANumber: string;
  reasonOfVisit: string;
  referredBy: string;
  marketingSource: string;
  intepreter: boolean;
  isPatientSurrogate: boolean;
  isPatientDeceased: boolean;
  detailsOfDeath: string;
  isPatientInsured: boolean;
  insuranceSponsorName: string;
  insurancePolicyNumber: string;
  insurancePolicyHolderName: string;
  insuranceAmountEligible: string;
  image: string;
  remarks: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  patientId: string;
  __v: number;
  case: ICase;
  donor: IDonor;
  appointment: {
    upcomingAppointment: string;
    lastAppointment: string;
  };
  partnerDetails: IPatient;
  referrerName: string;
  intepreterName: string;
}
export interface IDoctor {
  _id: string;
  clinicId: string;
  branchId: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  dob: string;
  education: string;
  mobile: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  licenceNumber: string;
  image: string;
  designation: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
