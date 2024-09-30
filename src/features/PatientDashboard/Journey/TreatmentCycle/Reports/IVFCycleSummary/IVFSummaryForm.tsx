import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";

// Define the type for form values
interface IFormValues {
  summary: string;
}

interface IvfSummaryFormProps {
  formik: FormikProps<IFormValues>;
}

const IvfSummaryForm: React.FC<IvfSummaryFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      IVF Summary
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <TextField
          name="summary"
          label="Summary"
          fullWidth
          multiline
          rows={4}
          value={formik.values.summary}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default IvfSummaryForm;
