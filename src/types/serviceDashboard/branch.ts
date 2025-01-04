export interface IGlobalBranch {
  _id: string;
  clinicId: string;
  code: string;
  branchName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  manager: string;
  phone: string;
  email: string;
  isActive: boolean;
  addBranch: AddBranchRequest;
  editBranch: EditBranchRequest;
  gstNumber: string;
  drugLicenceNumber: string;
}

interface AddBranchRequest {
  clinicId: string;
  code: string;
  branchName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  manager: string;
  phone: string;
  email: string;
  isActive: boolean;
}

interface EditBranchRequest {
  branchName?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  manager?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}
