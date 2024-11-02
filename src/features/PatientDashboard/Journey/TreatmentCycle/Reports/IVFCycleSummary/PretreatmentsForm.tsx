import React from 'react';
import { Grid, Typography } from '@mui/material';
import CustomDatePicker from '../../../../../../components/CustomDatePicker/CustomDatePicker';
import { FormikProps } from 'formik';

// Define the type for form values
interface IFormValues {
  lmp: Date | null;
}

interface PretreatmentsFormProps {
  formik: FormikProps<IFormValues>;
}

const PretreatmentsForm: React.FC<PretreatmentsFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Pre-Treatments
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <CustomDatePicker
          label="LMP (Last Menstrual Period)"
          value={formik.values.lmp}
          onChange={date => formik.setFieldValue('lmp', date, true)}
        />
      </Grid>
    </Grid>
  </>
);

export default PretreatmentsForm;
