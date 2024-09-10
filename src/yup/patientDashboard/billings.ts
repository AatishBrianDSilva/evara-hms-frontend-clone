import * as Yup from "yup";

// Purchase Order
const addEstimationItemSchema = Yup.object().shape({
  masterServiceId: Yup.object().nullable().required("Service is required"),
  doctor: Yup.mixed().nullable().required("Doctor is required"),
  date: Yup.date().nullable().required("Date is required"),
});

export const addEstimationValidationSchema = Yup.object().shape({
  serviceType: Yup.string().required("Service type is required"),
  items: Yup.array()
    .of(addEstimationItemSchema)
    .required("At least one item is required"),
});

// Validation for the payment entries
const paymentValidationSchema = Yup.object().shape({
  amount: Yup.string()
    .required("Amount is required")
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "Amount must be a valid number with at most two decimal places"
    ),
  method: Yup.string().required("Payment method is required"),
  paymentDate: Yup.date().nullable().default(null),
  details: Yup.string().optional(),
});

// Validation for each bill
const billValidationSchema = Yup.object().shape({
  id: Yup.object().shape({
    billingId: Yup.string().required("Billing ID is required"),
    _id: Yup.string().required("Internal ID is required"),
  }),
  payments: Yup.array()
    .of(paymentValidationSchema)
    .required("At least one payment is required"),
});

// Validation for the entire form
export const processBillingValidationSchema = Yup.object().shape({
  bills: Yup.array()
    .of(billValidationSchema)
    .min(1, "At least one bill is required"),
});
