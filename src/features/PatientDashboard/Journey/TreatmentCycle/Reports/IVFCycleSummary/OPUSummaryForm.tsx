import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import CustomDatePicker from "../../../../../../components/CustomDatePicker/CustomDatePicker";
import { FormikProps } from "formik";

// Define the type for form values
interface IFormValues {
  oocytePickUpDate: Date | null;
  noOfOocytesRetrieved: string;
  noOfMatureOocytes: string;
  noOfImmatureOocytes: string;
  oocyteQuality: string;
  spermParameters: string;
  oocytesICSI: string;
  fertilizedICSI: string;
  spermProcessingMethod: string;
  spermSelection: string;
  noOfEmbryosTransferred: string;
  noOfEmbryosFrozen: string;
  embryosDiscarded: string;
  medication: string;
}

interface OPUSummaryFormProps {
  formik: FormikProps<IFormValues>;
}

const OPUSummaryForm: React.FC<OPUSummaryFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pb={2}>
      OPU Summary
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <CustomDatePicker
          label="Oocyte Pick up Date"
          value={formik.values.oocytePickUpDate}
          onChange={(date) => formik.setFieldValue("oocytePickUpDate", date, true)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="noOfOocytesRetrieved"
          label="No. of Oocytes Retrieved"
          type="number"
          fullWidth
          value={formik.values.noOfOocytesRetrieved}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="noOfMatureOocytes"
          label="No. of Mature Oocytes"
          type="number"
          fullWidth
          value={formik.values.noOfMatureOocytes}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="noOfImmatureOocytes"
          label="No. of Immature Oocytes"
          type="number"
          fullWidth
          value={formik.values.noOfImmatureOocytes}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="oocyteQuality"
          label="Oocyte Quality"
          fullWidth
          value={formik.values.oocyteQuality}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="spermParameters"
          label="Sperm Parameters"
          fullWidth
          value={formik.values.spermParameters}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="oocytesICSI"
          label="Oocytes ICSI"
          fullWidth
          value={formik.values.oocytesICSI}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="fertilizedICSI"
          label="Fertilized ICSI"
          fullWidth
          value={formik.values.fertilizedICSI}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="spermProcessingMethod"
          label="Sperm Processing Method"
          fullWidth
          value={formik.values.spermProcessingMethod}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="spermSelection"
          label="Sperm Selection"
          fullWidth
          value={formik.values.spermSelection}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="noOfEmbryosTransferred"
          label="No. of Embryos Transferred"
          type="number"
          fullWidth
          value={formik.values.noOfEmbryosTransferred}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="noOfEmbryosFrozen"
          label="No. of Embryos Frozen"
          type="number"
          fullWidth
          value={formik.values.noOfEmbryosFrozen}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="embryosDiscarded"
          label="Embryos Discarded"
          type="number"
          fullWidth
          value={formik.values.embryosDiscarded}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="medication"
          label="Medication"
          fullWidth
          value={formik.values.medication}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default OPUSummaryForm;
