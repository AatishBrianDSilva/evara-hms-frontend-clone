import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";

// Define the type for form values
interface IFormValues {
  primaryOrSecondaryInfertility: string;
  durationOfInfertility: string;
}

interface PreviousTreatmentsFormProps {
  formik: FormikProps<IFormValues>;
}

const PreviousTreatmentsForm: React.FC<PreviousTreatmentsFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Previous Treatments
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="primaryOrSecondaryInfertility"
          label="Primary or Secondary Infertility"
          fullWidth
          value={formik.values.primaryOrSecondaryInfertility}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="durationOfInfertility"
          label="Duration of Infertility"
          fullWidth
          value={formik.values.durationOfInfertility}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default PreviousTreatmentsForm;
