import * as Yup from 'yup';

const serviceFieldSchema = Yup.object({
  service: Yup.object().nullable().required('Service is required'), // Assuming investigation is an object and is required
  doctor: Yup.object().nullable(), // Assuming doctor is an object and is required
  date: Yup.date().required('Date is required'), // Validating date
});

export const AddServiceValidationSchema = Yup.object({
  fields: Yup.array()
    .of(serviceFieldSchema)
    .required('At least one field is required'),
});
