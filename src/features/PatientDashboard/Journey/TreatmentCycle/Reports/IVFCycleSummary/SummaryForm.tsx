import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";

// Define the type for form values
interface IFormValues {
  summary: string;
}

interface SummaryFormProps {
  formik: FormikProps<IFormValues>;
}

const SummaryForm: React.FC<SummaryFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Summary
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="summary"
          label="Summary"
          fullWidth
          value={formik.values.summary}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default SummaryForm;
