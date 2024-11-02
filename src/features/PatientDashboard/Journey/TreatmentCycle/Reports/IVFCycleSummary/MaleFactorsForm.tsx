import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { FormikProps } from 'formik';

// Define the type for form values
interface IFormValues {
  diabetesComments: string;
  bloodGroup: string;
  bmi: string;
  smokingComments: string;
  alcoholConsumptionComments: string;
  hypertensionComments: string;
  thyroidDisorderComments: string;
  hyperprolactinemiaComments: string;
  androgenemiaComments: string;
  stdDiagnosis: string;
  varicocele: string;
  hypoHypoComments: string;
  traumaComments: string;
  ejaculatoryDysfunctionComments: string;
}

interface MaleFactorsFormProps {
  formik: FormikProps<IFormValues>;
}

const MaleFactorsForm: React.FC<MaleFactorsFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Male Factors
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="diabetesComments"
          label="Diabetes Comments"
          fullWidth
          value={formik.values.diabetesComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="bloodGroup"
          label="Blood Group"
          fullWidth
          value={formik.values.bloodGroup}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="bmi"
          label="BMI"
          fullWidth
          value={formik.values.bmi}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="smokingComments"
          label="Smoking Comments"
          fullWidth
          value={formik.values.smokingComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="alcoholConsumptionComments"
          label="Alcohol Consumption Comments"
          fullWidth
          value={formik.values.alcoholConsumptionComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="hypertensionComments"
          label="Hypertension Comments"
          fullWidth
          value={formik.values.hypertensionComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="thyroidDisorderComments"
          label="Thyroid Disorder Comments"
          fullWidth
          value={formik.values.thyroidDisorderComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="hyperprolactinemiaComments"
          label="Hyperprolactinemia Comments"
          fullWidth
          value={formik.values.hyperprolactinemiaComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="androgenemiaComments"
          label="Androgenemia Comments"
          fullWidth
          value={formik.values.androgenemiaComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="stdDiagnosis"
          label="STD Diagnosis"
          fullWidth
          value={formik.values.stdDiagnosis}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="varicocele"
          label="Varicocele"
          fullWidth
          value={formik.values.varicocele}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="hypoHypoComments"
          label="Hypo-Hypo Comments"
          fullWidth
          value={formik.values.hypoHypoComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="traumaComments"
          label="Trauma Comments"
          fullWidth
          value={formik.values.traumaComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="ejaculatoryDysfunctionComments"
          label="Ejaculatory Dysfunction Comments"
          fullWidth
          value={formik.values.ejaculatoryDysfunctionComments}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default MaleFactorsForm;
