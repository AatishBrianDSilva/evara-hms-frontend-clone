import React from "react";
import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";

// Define the type for form values
interface IFormValues {
  hypoComments: string;
  galactorrhoeaComments: string;
  hyperAndrogenemiaComments: string;
  scan3D: string;
  scan2D: string;
  thinEndometriumIntervention: string;
  tubalFactorComments: string;
  adenomyosisGradeAndComments: string;
  fibroidsFIGOClassification: string;
  fibroidsNumberAndSize: string;
}

interface FemaleFactorsFormProps {
  formik: FormikProps<IFormValues>;
}

const FemaleFactorsForm: React.FC<FemaleFactorsFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Female Factors
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="hypoComments"
          label="Hypo Comments"
          fullWidth
          value={formik.values.hypoComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="galactorrhoeaComments"
          label="Galactorrhoea Comments"
          fullWidth
          value={formik.values.galactorrhoeaComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="hyperAndrogenemiaComments"
          label="Hyper Androgenemia Comments"
          fullWidth
          value={formik.values.hyperAndrogenemiaComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="scan3D"
          label="3D Scan"
          select
          fullWidth
          value={formik.values.scan3D}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="scan2D"
          label="2D Scan"
          select
          fullWidth
          value={formik.values.scan2D}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="thinEndometriumIntervention"
          label="Thin Endometrium Intervention"
          select
          fullWidth
          value={formik.values.thinEndometriumIntervention}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="tubalFactorComments"
          label="Tubal Factor Comments"
          fullWidth
          value={formik.values.tubalFactorComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="adenomyosisGradeAndComments"
          label="Adenomyosis Grade and Comments"
          fullWidth
          value={formik.values.adenomyosisGradeAndComments}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="fibroidsFIGOClassification"
          label="Fibroids FIGO Classification"
          fullWidth
          value={formik.values.fibroidsFIGOClassification}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          name="fibroidsNumberAndSize"
          label="Fibroids Number and Size"
          fullWidth
          value={formik.values.fibroidsNumberAndSize}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default FemaleFactorsForm;
