export interface IUser {
  _id: string;
  clinicId: string;
  branchId: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  deletedAt?: Date;
}
