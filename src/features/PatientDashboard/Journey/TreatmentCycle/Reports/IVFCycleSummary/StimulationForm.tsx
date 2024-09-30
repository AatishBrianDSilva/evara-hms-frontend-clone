import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import CustomDatePicker from "../../../../../../components/CustomDatePicker/CustomDatePicker";
import { FormikProps } from "formik";

// Define the type for form values
interface IFormValues {
  downRegulation: string;
  dateOfStimulation: Date | null;
  stimulationProtocol: string;
}

interface StimulationFormProps {
  formik: FormikProps<IFormValues>;
}

const StimulationForm: React.FC<StimulationFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Stimulation
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="downRegulation"
          label="Down Regulation"
          fullWidth
          value={formik.values.downRegulation}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <CustomDatePicker
          label="Date of Stimulation"
          value={formik.values.dateOfStimulation}
          onChange={(date) => formik.setFieldValue("dateOfStimulation", date, true)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="stimulationProtocol"
          label="Stimulation Protocol"
          fullWidth
          value={formik.values.stimulationProtocol}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default StimulationForm;
