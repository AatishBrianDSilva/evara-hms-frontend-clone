import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";

// Define the type for form values
interface IFormValues {
  hysteroscopyFindings: string;
  laparoscopyFindings: string;
  laparotomyFindings: string;
}

interface SurgicalHistoryFormProps {
  formik: FormikProps<IFormValues>;
}

const SurgicalHistoryForm: React.FC<SurgicalHistoryFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Surgical History
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="hysteroscopyFindings"
          label="Hysteroscopy Findings"
          fullWidth
          value={formik.values.hysteroscopyFindings}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="laparoscopyFindings"
          label="Laparoscopy Findings"
          fullWidth
          value={formik.values.laparoscopyFindings}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="laparotomyFindings"
          label="Laparotomy Findings"
          fullWidth
          value={formik.values.laparotomyFindings}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default SurgicalHistoryForm;
