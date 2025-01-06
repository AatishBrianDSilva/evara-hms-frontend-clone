export interface IGlobalUser {
  _id: string;
  clinicId: string;
  branchId: string;
  username: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  addUser: AddUserRequest;
  editUser: EditUserRequest;
  updatePassword: UpdatePasswordRequest;
  doctor?: {
    firstName: string;
    lastName?: string;
    gender: string;
    speciality: string;
  };
}

interface AddUserRequest {
  _id: string;
  clinicId: string;
  branchId: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

interface EditUserRequest {
  _id: string;
  userId: string;
  username?: string;
  email?: string;
  role?: string;
}

interface UpdatePasswordRequest {
  _id: string;
  email: string;
  currentPassword: string;
  newPassword: string;
}
