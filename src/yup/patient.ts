import * as Yup from 'yup';

const idProofTypeMap: Record<string, string> = {
  aadhar: "Aadhar",
  "aadhar card": "Aadhar",
  "aadhar number": "Aadhar",
  abha: "ABHA",
  "abha card": "ABHA",
  pan: "Pan",
  "pan card": "Pan",
  "driving license": "DrivingLicense",
  "license": "DrivingLicense",
};

export const PatientRegistrationValidationSchema = Yup.object().shape({
  title: Yup.string(),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string(),
  gender: Yup.string().required('Gender is required'),
  dob: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  education: Yup.string(),
  maritalStatus: Yup.string().required('Marital Status is required'),
  bloodGroup: Yup.string(),
  countryBirth: Yup.string(),
  nationality: Yup.string().required('Nationality is required'),
  motherTounge: Yup.string(),
  occupation: Yup.string().required('Occupation is required'),
  religion: Yup.string().required('Religion is required'),
  mobile: Yup.string()
    .matches(
      /^(\+\d{1,3}\s?)?\d{10,13}$/,
      'Enter a 10 digit valid phone number',
    )
    .required('Mobile number is required'),
  alernativeMobile: Yup.string().matches(
    /^(\+\d{1,3}\s?)?\d{10,13}$/,
    'Enter a 10 digit valid phone number',
  ),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  dependentType: Yup.string(),
  dependentName: Yup.string(),
  dependentRelation: Yup.string(),
  dependentMobile: Yup.string().matches(
    /^(\+\d{1,3}\s?)?\d{10,13}$/,
    'Enter a 10 digit valid phone number',
  ),
  dependentEmail: Yup.string(),
  addressLine1: Yup.string().required('Address Line 1 is required'),
  addressLine2: Yup.string(),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  pincode: Yup.string()
    .required('Pincode is required')
    .matches(/^\d{6}$/, 'Enter a 6-digit pin code'),
  idProofType: Yup.string().required('ID Proof Type is required'),
  idProofNumber: Yup.string()
  .required("ID Proof Number is required")
  .test("idProofValidation", function (value) {
    const { idProofType } = this.parent;

    if (!idProofType) return true; // Skip validation if idProofType is not set

    // Normalize idProofType
    const normalizedType = idProofTypeMap[idProofType.toLowerCase()] || idProofType;

    const errorMessageMap = {
      Aadhar: "Enter a 12 digit valid aadhar number",
      ABHA: "Enter a 14 digit valid abha number",
      Pan: 'Enter a 10 digit PAN number in "ABCDE1234F" format',
      DrivingLicense: 'Enter a 16 digit driving license in "SS-RRYYYYNNNNNNN" format',
    };

    switch (normalizedType) {
      case "Aadhar":
        if (!/^\d{12}$/.test(value || "")) {
          return this.createError({ message: errorMessageMap["Aadhar"] });
        }
        break;
      case "ABHA":
        if (!/^\d{14}$/.test(value || "")) {
          return this.createError({ message: errorMessageMap["ABHA"] });
        }
        break;
      case "Pan":
        if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value || "")) {
          return this.createError({ message: errorMessageMap["Pan"] });
        }
        break;
      case "DrivingLicense":
        if (!/^[A-Z]{2}-\d{2}[A-Z]{4}\d{7}$/.test(value || "")) {
          return this.createError({ message: errorMessageMap["DrivingLicense"] });
        }
        break;
      default:
        return true; // Allow other values without additional validation
    }

    return true;
  }),
  idProofIssuedCountry: Yup.string(),
  ABHANumber: Yup.string().matches(
    /^\d{14}$/,
    'Enter a 14 digit valid abha number',
  ),
  reasonOfVisit: Yup.string().required('Reason of visit is required'),
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

export const PartnerRegistrationValidationSchema = Yup.object().shape({
  title: Yup.string(),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string(),
  gender: Yup.string().required('Gender is required'),
  dob: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  education: Yup.string(),
  maritalStatus: Yup.string().required('Marital Status is required'),
  bloodGroup: Yup.string(),
  countryBirth: Yup.string(),
  motherTounge: Yup.string(),
  occupation: Yup.string().required('Occupation is required'),
  mobile: Yup.string()
    .matches(
      /^(\+\d{1,3}\s?)?\d{10,13}$/,
      'Enter a 10 digit valid phone number',
    )
    .required('Mobile Number is required'),
  alernativeMobile: Yup.string().matches(
    /^(\+\d{1,3}\s?)?\d{10,13}$/,
    'Enter a 10 digit valid phone number',
  ),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  dependentType: Yup.string(),
  dependentName: Yup.string(),
  dependentRelation: Yup.string(),
  dependentMobile: Yup.string().matches(
    /^(\+\d{1,3}\s?)?\d{10,13}$/,
    'Enter a 10 digit valid phone number',
  ),
  dependentEmail: Yup.string().email('Invalid email format'),
  addressLine1: Yup.string().required('Address Line 1 is required'),
  addressLine2: Yup.string(),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  pincode: Yup.string()
    .required('Pincode is required')
    .matches(/^\d{6}$/, 'Enter a 6-digit pin code'), // country: Yup.string().required("Country is required"),
    idProofType: Yup.string().required('ID Proof Type is required'),
    idProofNumber: Yup.string()
    .required("ID Proof Number is required")
    .test("idProofValidation", function (value) {
      const { idProofType } = this.parent;
  
      if (!idProofType) return true; // Skip validation if idProofType is not set
  
      // Normalize idProofType
      const normalizedType = idProofTypeMap[idProofType.toLowerCase()] || idProofType;
  
      const errorMessageMap = {
        Aadhar: "Enter a 12 digit valid aadhar number",
        ABHA: "Enter a 14 digit valid abha number",
        Pan: 'Enter a 10 digit PAN number in "ABCDE1234F" format',
        DrivingLicense: 'Enter a 16 digit driving license in "SS-RRYYYYNNNNNNN" format',
      };
  
      switch (normalizedType) {
        case "Aadhar":
          if (!/^\d{12}$/.test(value || "")) {
            return this.createError({ message: errorMessageMap["Aadhar"] });
          }
          break;
        case "ABHA":
          if (!/^\d{14}$/.test(value || "")) {
            return this.createError({ message: errorMessageMap["ABHA"] });
          }
          break;
        case "Pan":
          if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value || "")) {
            return this.createError({ message: errorMessageMap["Pan"] });
          }
          break;
        case "DrivingLicense":
          if (!/^[A-Z]{2}-\d{2}[A-Z]{4}\d{7}$/.test(value || "")) {
            return this.createError({ message: errorMessageMap["DrivingLicense"] });
          }
          break;
        default:
          return true; // Allow other values without additional validation
      }
  
      return true;
    }),
  idProofIssuedCountry: Yup.string(),
  ABHANumber: Yup.string().matches(
    /^\d{14}$/,
    'Enter a 14 digit valid abha number',
  ),
  referredBy: Yup.string(),
  referredByOther: Yup.string(),
  referredByDoctor: Yup.string(),
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

export const DonorRegistrationfrombankValidationSchema = Yup.object().shape({
  title: Yup.string(),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string(),
  gender: Yup.string().required('Gender is required'),
  dob: Yup.date().required('Date of birth is required'),
  education: Yup.string(),
  maritalStatus: Yup.string().required('Marital status is required'),
  bloodGroup: Yup.string(),
  countryBirth: Yup.string(),
  nationality: Yup.string().required('Nationality is required'),
  motherTounge: Yup.string(),
  occupation: Yup.string().required('Occupation is required'),
  religion: Yup.string().required('Religion is required'),
  mobile: Yup.string()
    .matches(
      /^(\+\d{1,3}\s?)?\d{10,13}$/,
      'Enter a 10 digit valid phone number',
    )
    .required('Mobile number is required'),
  alernativeMobile: Yup.string().matches(
    /^(\+\d{1,3}\s?)?\d{10,13}$/,
    'Enter a 10 digit valid phone number',
  ),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  dependentType: Yup.boolean(),

  addressLine1: Yup.string().required('Address line 1 is required'),
  addressLine2: Yup.string(),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  pincode: Yup.string()
    .required('Pincode is required')
    .matches(/^\d{6}$/, 'Enter a 6-digit pin code'),
    idProofType: Yup.string().required('ID Proof Type is required'),
    idProofNumber: Yup.string()
    .required("ID Proof Number is required")
    .test("idProofValidation", function (value) {
      const { idProofType } = this.parent;
  
      if (!idProofType) return true; // Skip validation if idProofType is not set
  
      // Normalize idProofType
      const normalizedType = idProofTypeMap[idProofType.toLowerCase()] || idProofType;
  
      const errorMessageMap = {
        Aadhar: "Enter a 12 digit valid aadhar number",
        ABHA: "Enter a 14 digit valid abha number",
        Pan: 'Enter a 10 digit PAN number in "ABCDE1234F" format',
        DrivingLicense: 'Enter a 16 digit driving license in "SS-RRYYYYNNNNNNN" format',
      };
  
      switch (normalizedType) {
        case "Aadhar":
          if (!/^\d{12}$/.test(value || "")) {
            return this.createError({ message: errorMessageMap["Aadhar"] });
          }
          break;
        case "ABHA":
          if (!/^\d{14}$/.test(value || "")) {
            return this.createError({ message: errorMessageMap["ABHA"] });
          }
          break;
        case "Pan":
          if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value || "")) {
            return this.createError({ message: errorMessageMap["Pan"] });
          }
          break;
        case "DrivingLicense":
          if (!/^[A-Z]{2}-\d{2}[A-Z]{4}\d{7}$/.test(value || "")) {
            return this.createError({ message: errorMessageMap["DrivingLicense"] });
          }
          break;
        default:
          return true; // Allow other values without additional validation
      }
  
      return true;
    }),
  idProofIssuedCountry: Yup.string(),
  ABHANumber: Yup.string().matches(
    /^\d{14}$/,
    'Enter a 14 digit valid abha number',
  ),
  interpreter: Yup.boolean(),
  isDonor: Yup.boolean(),
  hiv: Yup.string(),
  height: Yup.string(),
  Build: Yup.string(),
  Ethnicity: Yup.string(),
  HealthLooks: Yup.string(),
  faceColour: Yup.string(),
  eyeColour: Yup.string(),
  haircolour: Yup.string(),
  RHantibody: Yup.string(),
  skinTone: Yup.string(),
  complexion: Yup.string(),
  referrerName: Yup.string(),
  marketingSource: Yup.string(),
  intepreter: Yup.boolean(),
  congenitaldeformities: Yup.boolean(),
  geneticAcquiredDisease: Yup.string(),
  historyOfChronicIllness: Yup.string(),
  seriousDisease: Yup.string(),
  seriousDiseaserelative: Yup.string(),
  isPatientInsured: Yup.boolean(),
  remarks: Yup.string(),
});

export const DonorRegistrationValidationSchemaFromHospital = Yup.object().shape(
  {
    title: Yup.string(),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string(),
    gender: Yup.string().required('Gender  is required'),
    dob: Yup.string().required('Date of birth is required'),
    education: Yup.string(),
    maritalStatus: Yup.string().required('Martial Status  is required'),
    bloodGroup: Yup.string(),
    countryBirth: Yup.string(),
    nationality: Yup.string().required('Nationality is required'),
    motherTounge: Yup.string(),
    occupation: Yup.string().required('Occupation is required'),
    religion: Yup.string(),
    mobile: Yup.string()
      .matches(
        /^(\+\d{1,3}\s?)?\d{10,13}$/,
        'Enter a 10 digit valid phone number',
      )
      .required('Mobile number is required'),
    alernativeMobile: Yup.string().matches(
      /^(\+\d{1,3}\s?)?\d{10,13}$/,
      'Enter a 10 digit valid phone number',
    ),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    dependentType: Yup.string(),
    dependentName: Yup.string(),
    dependentRelation: Yup.string(),
    dependentMobile: Yup.string().matches(
      /^(\+\d{1,3}\s?)?\d{10,13}$/,
      'Enter a 10 digit valid phone number',
    ),
    dependentEmail: Yup.string(),
    addressLine1: Yup.string().required('Address Line 1 is required'),
    addressLine2: Yup.string(),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    pincode: Yup.string()
      .required('Pincode is required')
      .matches(/^\d{6}$/, 'Enter a 6-digit pin code'), // country: Yup.string().required("Country is required"),
      idProofType: Yup.string().required('ID Proof Type is required'),
      idProofNumber: Yup.string()
      .required("ID Proof Number is required")
      .test("idProofValidation", function (value) {
        const { idProofType } = this.parent;
    
        if (!idProofType) return true; // Skip validation if idProofType is not set
    
        // Normalize idProofType
        const normalizedType = idProofTypeMap[idProofType.toLowerCase()] || idProofType;
    
        const errorMessageMap = {
          Aadhar: "Enter a 12 digit valid aadhar number",
          ABHA: "Enter a 14 digit valid abha number",
          Pan: 'Enter a 10 digit PAN number in "ABCDE1234F" format',
          DrivingLicense: 'Enter a 16 digit driving license in "SS-RRYYYYNNNNNNN" format',
        };
    
        switch (normalizedType) {
          case "Aadhar":
            if (!/^\d{12}$/.test(value || "")) {
              return this.createError({ message: errorMessageMap["Aadhar"] });
            }
            break;
          case "ABHA":
            if (!/^\d{14}$/.test(value || "")) {
              return this.createError({ message: errorMessageMap["ABHA"] });
            }
            break;
          case "Pan":
            if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value || "")) {
              return this.createError({ message: errorMessageMap["Pan"] });
            }
            break;
          case "DrivingLicense":
            if (!/^[A-Z]{2}-\d{2}[A-Z]{4}\d{7}$/.test(value || "")) {
              return this.createError({ message: errorMessageMap["DrivingLicense"] });
            }
            break;
          default:
            return true; // Allow other values without additional validation
        }
    
        return true;
      }),
    idProofIssuedCountry: Yup.string(),
    ABHANumber: Yup.string().matches(
      /^\d{14}$/,
      'Enter a 14 digit valid abha number',
    ),
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
  },
);
