export interface ICase {
  _id: string;
  patientId: string;
  donorId: string;
  createdAt: Date;
  updatedAt: Date;
  caseId: string;
  partnerId: string;
  status: string;
  __v: number;
}
