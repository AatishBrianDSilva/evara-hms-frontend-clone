import * as Yup from 'yup';
export const AddSourceValidationSchema = Yup.object().shape({
  IDName: Yup.string().required('IDName is required'),

  Source: Yup.string().required('Source is required'),
});

export const AddIDtypeValidationSchema = Yup.object().shape({
  IDName: Yup.string().required('IDName is required'),

  Format: Yup.string().required('Source is required'),
});

export const ConsultantValidationSchema = Yup.object().shape({
  IDName: Yup.string().required('IDName is required'),
  Source: Yup.string()
    .required('Source is required')
    .oneOf(
      [
        'FB',
        'Google',
        'Patient referral',
        "Doctor's referral",
        'Youtube',
        'Posters',
        'Others',
      ],
      'Invalid Source',
    ),
});

export const ConsentValidationSchema = Yup.object().shape({
  doctorName: Yup.string().required('Doctor Name is required'),
  contactNumber: Yup.string()
    .required('Contact Number is required')
    .matches(/^[0-9]+$/, 'Contact Number must be a valid number'),
  city: Yup.string().required('City is required'),
  speciality: Yup.string().required('Speciality is required'),
});

export const ReasonValidationSchema = Yup.object().shape({
  IDName: Yup.string().required('IDName is required'),

  Source: Yup.string().required('Source is required'),
});

export const ReportValidationSchema = Yup.object({
  doctorName: Yup.string().trim().required('Doctor Name is required'),
  contactNumber: Yup.string()
    .trim()
    .matches(/^[0-9]+$/, 'Contact Number must be a valid number')
    .required('Contact Number is required'),
  city: Yup.string().trim().required('City is required'),
  speciality: Yup.string().trim().required('Speciality is required'),
});

export const ReferralDoctorValidationSchema = Yup.object().shape({
  doctorName: Yup.string().required('Doctor Name is required'),
  contactNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Contact Number must be a valid phone number')
    .required('Contact Number is required'),
  city: Yup.string().required('City is required'),
  speciality: Yup.string().required('Speciality is required'),
});
export const UserValidationSchema = Yup.object({
  BranchName: Yup.string().trim().required('Branch Name is required'),
  contactNumber: Yup.string()
    .trim()
    .matches(/^[0-9]+$/, 'Contact Number must be a valid number')
    .required('Contact Number is required'),
  UserName: Yup.string().trim().required('User Name is required'),
  PhoneNumber: Yup.string()
    .trim()
    .matches(/^[0-9]+$/, 'Phone Number must be a valid number')
    .required('Phone Number is required'),
  Role: Yup.string().trim().required('Role is required'),
});

export const BranchValidationSchema = Yup.object({
  BranchCode: Yup.string().required('Branch Code is required'),
  BranchName: Yup.string().required('Branch Name is required'),
});

export const RolesValidationSchema = Yup.object().shape({
  doctorName: Yup.string().required('Doctor Name is required'),
  contactNumber: Yup.string()
    .required('Contact Number is required')
    .matches(/^[0-9]+$/, 'Contact Number must be a valid number'),
  city: Yup.string().required('City is required'),
  speciality: Yup.string().required('Speciality is required'),
});
export const CryoParametersValidationSchema = Yup.object().shape({
  doctorName: Yup.string().required('Doctor Name is required'),
  contactNumber: Yup.string()
    .required('Contact Number is required')
    .matches(/^[0-9]+$/, 'Contact Number must be a valid number'),
  city: Yup.string().required('City is required'),
  speciality: Yup.string().required('Speciality is required'),
});

export const ConsultantDoctorValidationSchemaGlobal = Yup.object().shape({
  doctorName: Yup.string().required('Doctor Name is required'),
  contactNumber: Yup.string()
    .required('Contact Number is required')
    .matches(/^[0-9]+$/, 'Contact Number must be a valid number'),
  city: Yup.string().required('City is required'),
  speciality: Yup.string().required('Speciality is required'),
});

export const ConsultantDoctorValidationSchema = Yup.object({
  BranchName: Yup.string().trim().required('Branch Name is required'),
  DoctorName: Yup.string().trim().required('Doctor Name is required'),
  DoctorContactNumber: Yup.string()
    .trim()
    .matches(/^[0-9]+$/, 'Doctor Contact Number must be a valid number')
    .required('Doctor Contact Number is required'),
  Speciality: Yup.string().trim().required('Speciality is required'),
  Role: Yup.string().trim().required('Role is required'),
  Address1: Yup.string().trim().required('Address1 is required'),
  Address2: Yup.string().trim(),
  License: Yup.string().trim(),
  Image: Yup.string().trim(),
});
