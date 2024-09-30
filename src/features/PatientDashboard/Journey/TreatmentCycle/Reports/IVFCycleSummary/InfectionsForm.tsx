import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";

// Define your form values interface
interface IFormValues {
  stdComments: string;
  tuberculosisComments: string;
  historyOfPelvicInfectionsComments: string;
}

interface InfectionsFormProps {
  formik: FormikProps<IFormValues>;
}

const InfectionsForm: React.FC<InfectionsFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Infections
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="stdComments"
          label="STD Comments"
          fullWidth
          value={formik.values.stdComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="tuberculosisComments"
          label="Tuberculosis Comments"
          fullWidth
          value={formik.values.tuberculosisComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="historyOfPelvicInfectionsComments"
          label="History of Pelvic Infections Comments"
          fullWidth
          value={formik.values.historyOfPelvicInfectionsComments}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default InfectionsForm;
