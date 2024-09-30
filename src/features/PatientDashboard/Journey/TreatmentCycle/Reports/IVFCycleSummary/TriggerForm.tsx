import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import CustomDatePicker from "../../../../../../components/CustomDatePicker/CustomDatePicker";
import { FormikProps } from "formik";

// Define the type for form values
interface ITriggerFormValues {
  postTriggerLH: string;
  postTriggerProgesterone: string;
  triggerDate: Date | null;
  triggerComments: string;
  trigger: string;
  preTriggerLH: string;
  preTriggerProgesterone: string;
  preTriggerE2: string;
  repeat12HrsTrigger: string;
  triggerTime: string;
  endometrialThicknessOnDayOfTrigger: string;
  e2OnDayOfTrigger: string;
}

interface TriggerFormProps {
  formik: FormikProps<ITriggerFormValues>;
}

const TriggerForm: React.FC<TriggerFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Trigger Details
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="postTriggerLH"
          label="Post Trigger LH"
          fullWidth
          value={formik.values.postTriggerLH}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="postTriggerProgesterone"
          label="Post Trigger Progesterone"
          fullWidth
          value={formik.values.postTriggerProgesterone}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <CustomDatePicker
          label="Trigger Date"
          value={formik.values.triggerDate}
          onChange={(date) => formik.setFieldValue("triggerDate", date, true)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="triggerComments"
          label="Trigger Comments"
          fullWidth
          value={formik.values.triggerComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="trigger"
          label="Trigger"
          fullWidth
          value={formik.values.trigger}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="preTriggerLH"
          label="Pre Trigger LH"
          fullWidth
          value={formik.values.preTriggerLH}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="preTriggerProgesterone"
          label="Pre Trigger Progesterone"
          fullWidth
          value={formik.values.preTriggerProgesterone}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="preTriggerE2"
          label="Pre Trigger E2"
          fullWidth
          value={formik.values.preTriggerE2}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="repeat12HrsTrigger"
          label="Repeat 12 Hrs Trigger"
          fullWidth
          value={formik.values.repeat12HrsTrigger}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="triggerTime"
          label="Trigger Time"
          fullWidth
          value={formik.values.triggerTime}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="endometrialThicknessOnDayOfTrigger"
          label="Endometrial Thickness on Day of Trigger"
          fullWidth
          value={formik.values.endometrialThicknessOnDayOfTrigger}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="e2OnDayOfTrigger"
          label="E2 on Day of Trigger"
          fullWidth
          value={formik.values.e2OnDayOfTrigger}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default TriggerForm;
