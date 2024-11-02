import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { FormikProps } from 'formik';

// Define the type for form values
interface IFormValues {
  selfOrDonorSperm: string;
  freezing: string;
  spermCollectionRetrievalTechnique: string;
  spermQualityAtOPU: string;
}

interface SpermDetailsFormProps {
  formik: FormikProps<IFormValues>;
}

const SpermDetailsForm: React.FC<SpermDetailsFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Sperm Details
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="selfOrDonorSperm"
          label="Self or Donor Sperm"
          fullWidth
          value={formik.values.selfOrDonorSperm}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="freezing"
          label="Freezing"
          fullWidth
          value={formik.values.freezing}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="spermCollectionRetrievalTechnique"
          label="Sperm Collection/Retrieval Technique"
          fullWidth
          value={formik.values.spermCollectionRetrievalTechnique}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="spermQualityAtOPU"
          label="Sperm Quality At OPU"
          fullWidth
          value={formik.values.spermQualityAtOPU}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default SpermDetailsForm;
