import * as yup from "yup";

export const addPatientPharmacyValidationSchema = yup.object().shape({
  doctor: yup.object().required("Doctor is required"),
  date: yup.date().required("Date is required"),
  items: yup
    .array()
    .of(
      yup.object().shape({
        stock: yup.object().required("Stock is required"),
        details: yup
          .array()
          .of(
            yup.object().shape({
              location: yup.object().required("Location is required"),
              quantity: yup
                .number()
                .positive()
                .integer()
                .required("Quantity is required"),
              batchNumber: yup.string().required("Batch number is required"),
            })
          )
          .min(1, "At least one detail is required per item"),
      })
    )
    .min(1, "At least one item is required"),
});
