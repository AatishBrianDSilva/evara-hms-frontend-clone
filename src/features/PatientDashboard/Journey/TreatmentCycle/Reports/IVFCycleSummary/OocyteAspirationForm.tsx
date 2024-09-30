import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import CustomDatePicker from "../../../../../../components/CustomDatePicker/CustomDatePicker";
import { FormikProps } from "formik";

// Define the type for form values
interface IFormValues {
  anaesthetist: string;
  surgeonOPU: string;
  opuDate: Date;
  specificAbnormalitiesInOocytes: string;
  immatureOocytes: string;
  matureOocytes: string;
  differenceBetweenTriggerAndOPU: string;
  selfOrDonor: string;
  noOfFolliclesGreaterThan14mmAtTrigger: string;
}

interface OocyteAspirationFormProps {
  formik: FormikProps<IFormValues>;
}

const OocyteAspirationForm: React.FC<OocyteAspirationFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Oocyte Aspiration
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="anaesthetist"
          label="Anaesthetist"
          fullWidth
          value={formik.values.anaesthetist}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="surgeonOPU"
          label="Surgeon OPU"
          fullWidth
          value={formik.values.surgeonOPU}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <CustomDatePicker
          label="OPU Date"
          value={formik.values.opuDate}
          onChange={(date) => formik.setFieldValue("opuDate", date, true)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="specificAbnormalitiesInOocytes"
          label="Specific Abnormalities in Oocytes"
          fullWidth
          value={formik.values.specificAbnormalitiesInOocytes}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="immatureOocytes"
          label="Immature Oocytes"
          fullWidth
          value={formik.values.immatureOocytes}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="matureOocytes"
          label="Mature Oocytes"
          fullWidth
          value={formik.values.matureOocytes}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="differenceBetweenTriggerAndOPU"
          label="Difference Between Trigger and OPU"
          fullWidth
          value={formik.values.differenceBetweenTriggerAndOPU}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="selfOrDonor"
          label="Self or Donor"
          fullWidth
          value={formik.values.selfOrDonor}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="noOfFolliclesGreaterThan14mmAtTrigger"
          label="No. of Follicles > 14mm at Trigger"
          fullWidth
          value={formik.values.noOfFolliclesGreaterThan14mmAtTrigger}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default OocyteAspirationForm;
