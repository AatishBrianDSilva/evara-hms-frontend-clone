import * as Yup from 'yup';

export const AppointmentValidationSchema = Yup.object({
  fullName: Yup.string().required('Full name is required'),

  phone: Yup.string()
    .test(
      'valid-phone',
      'Phone number must be exactly 10 digits',
      function (value) {
        // Extract the phone number part (excluding the country code)
        const phoneNumber = value ? value.replace(/^\+\d+\s/, '') : '';
        return phoneNumber.length === 10 && /^\d{10}$/.test(phoneNumber);
      },
    )
    .required('Phone is required'),

  city: Yup.string().required('City is required'),
  reason: Yup.string().required('Reason for visit is required'),
  mode: Yup.string().required('Mode of consultation is required'),
  source: Yup.string().required('Source of referral is required'),
  notes: Yup.string(),
});
