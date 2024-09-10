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
  pincode: string;
  licenceNumber: string;
  image: string;
  designation: string;
  speciality: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
