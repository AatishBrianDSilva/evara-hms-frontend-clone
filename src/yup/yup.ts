import * as Yup from "yup";

export const AppointmentValidationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  phone: Yup.string()
  .matches(/^(\+\d{1,3}\s?)?\d{1,13}$/, 'Phone number can have maximum 13 digits')
  .required('Phone is required'),
  // .test("valid-phone", "Invalid phone number", (value) => {
  //   const countryCode = value.substring(0, value.indexOf(" "));
  //   const phoneNumber = value.substring(value.indexOf(" ") + 1).replace(/\s/g, ""); //replace the whitespaces in phone number
  //   return /^\+[0-9]{1,3}$/.test(countryCode) && /^[0-9]{10}$/.test(phoneNumber);
  // }),

  city: Yup.string().required("City is required"),
  reason: Yup.string().required("Reason for visit is required"),
  mode: Yup.string().required("Mode of consultation is required"),
  source: Yup.string().required("Source of referral is required"),
  notes: Yup.string(),
});
