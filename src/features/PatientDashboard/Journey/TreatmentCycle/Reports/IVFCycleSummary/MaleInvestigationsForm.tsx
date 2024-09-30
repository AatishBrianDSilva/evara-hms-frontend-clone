import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";

// Define the type for form values
interface IFormValues {
  thalassemiaScreeningComments: string;
  geneticTestingComments: string;
  viralMarkers: string;
  postEjaculatoryUrineExamination: string;
  viralMarkersComments: string;
}

interface MaleInvestigationFormProps {
  formik: FormikProps<IFormValues>;
}

const MaleInvestigationForm: React.FC<MaleInvestigationFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Male Investigation
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="thalassemiaScreeningComments"
          label="Thalassemia Screening Comments"
          fullWidth
          value={formik.values.thalassemiaScreeningComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="geneticTestingComments"
          label="Genetic Testing Comments"
          fullWidth
          value={formik.values.geneticTestingComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="viralMarkers"
          label="Viral Markers"
          fullWidth
          value={formik.values.viralMarkers}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="postEjaculatoryUrineExamination"
          label="Post Ejaculatory Urine Examination"
          fullWidth
          value={formik.values.postEjaculatoryUrineExamination}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="viralMarkersComments"
          label="Viral Markers Comments"
          fullWidth
          value={formik.values.viralMarkersComments}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default MaleInvestigationForm;
