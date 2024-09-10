import * as Yup from "yup";

const procedureFieldSchema = Yup.object({
  procedure: Yup.object().nullable().required("Procedure is required"), // Assuming procedure is an object and is required
  doctor: Yup.object().nullable().required("Doctor is required"), // Assuming doctor is an object and is required
  date: Yup.date().required("Date is required"), // Validating date
});
export const AddProcedureValidationSchema = Yup.object({
  fields: Yup.array()
    .of(procedureFieldSchema)
    .required("At least one field is required"),
});
