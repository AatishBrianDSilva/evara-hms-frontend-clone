export interface IAppointmentSource {
  name: string;
  clinicId: string;
  branchId: string;
}

export interface IAppointmentReason {
  name: string;
  clinicId: string;
  branchId: string;
}

export interface IPatientSource {
  name: string;
  clinicId: string;
  branchId: string;
}

export interface IReferralDoctor {
  clinicId: string;
  branchId: string;
  name: string;
  phone: string;
  city: string;
  speciality: string;
}

export interface IPatientIdType {
  clinicId: string;
  branchId: string;
  name: string;
  format: string;
}

export interface INotesTreatmentAdvice {
  _id: string;
  name: string;
  clinicId: string;
  branchId: string;
}

export interface INotesObservation {
  _id: string;
  name: string;
  clinicId: string;
  branchId: string;
}

export interface IConsent {
  _id: string;
  name: string;
  purpose: string;
  associatedWith: string;
  file: string;
  clinicId: string;
  branchId: string;
}
