import * as Yup from "yup";

export const PatientRegistrationValidationSchema = Yup.object().shape({
  title: Yup.string(),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  gender: Yup.string(),
  dob: Yup.string().required("Date of birth is required"),
  education: Yup.string(),
  maritalStatus: Yup.string(),
  bloodGroup: Yup.string(),
  countryBirth: Yup.string(),
  nationality: Yup.string(),
  motherTounge: Yup.string(),
  occupation: Yup.string(),
  religion: Yup.string(),
  mobile: Yup.string()
    .required("Mobile number is required")
    .max(10, "Invalid mobile number")
    .min(10, "Invalid mobile number"),
  alernativeMobile: Yup.string()
    .max(10, "Invalid mobile number")
    .min(10, "Invalid mobile number"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  dependentType: Yup.string(),
  dependentName: Yup.string(),
  dependentRelation: Yup.string(),
  dependentMobile: Yup.string(),
  dependentEmail: Yup.string().email("Invalid email format"),
  addressLine1: Yup.string().required("Address Line 1 is required"),
  addressLine2: Yup.string(),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string().required("Pincode is required"),
  // country: Yup.string().required("Country is required"),
  idProofType: Yup.string(),
  idProofNumber: Yup.string(),
  idProofIssuedCountry: Yup.string(),
  ABHANumber: Yup.string(),
  reasonOfVisit: Yup.string(),
  referredBy: Yup.string(),
  referredByOther: Yup.string(),
  referredByDoctor: Yup.string(),
  marketingSource: Yup.string(),
  intepreter: Yup.boolean(),
  intepreteName: Yup.string(),
  isPatientSurrogate: Yup.boolean(),
  isPatientDeceased: Yup.boolean(),
  detailsOfDeath: Yup.string(),
  isPatientInsured: Yup.boolean(),
  // insuranceCompany: Yup.string(),
  insuranceSponsorName: Yup.string(),
  insurancePolicyNumber: Yup.string(),
  insurancePolicyHolderName: Yup.string(),
  insuranceAmountEligible: Yup.string(),
  image: Yup.mixed(),
  remarks: Yup.string(),
});

export const AppointmentValidationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),
  city: Yup.string().required("City is required"),
  reason: Yup.string().required("Reason for visit is required"),
  mode: Yup.string().required("Mode of consultation is required"),
  source: Yup.string().required("Source of referral is required"),
  notes: Yup.string(),
});
