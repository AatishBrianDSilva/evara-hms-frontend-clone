import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";

// Define the type for form values
interface IFormValues {
  lh: string;
  cd138: string;
  e2: string;
  fshDay2: string;
  afcLeftComments: string;
  afcRightComments: string;
  amh: string;
}

interface FemaleInvestigationsFormProps {
  formik: FormikProps<IFormValues>;
}

const FemaleInvestigationsForm: React.FC<FemaleInvestigationsFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Female Investigations
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="lh"
          label="LH"
          fullWidth
          value={formik.values.lh}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="cd138"
          label="CD138"
          fullWidth
          value={formik.values.cd138}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="e2"
          label="E2"
          fullWidth
          value={formik.values.e2}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="fshDay2"
          label="FSH Day 2"
          fullWidth
          value={formik.values.fshDay2}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="afcLeftComments"
          label="AFC Left Comments"
          fullWidth
          value={formik.values.afcLeftComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="afcRightComments"
          label="AFC Right Comments"
          fullWidth
          value={formik.values.afcRightComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="amh"
          label="AMH"
          fullWidth
          value={formik.values.amh}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default FemaleInvestigationsForm;
