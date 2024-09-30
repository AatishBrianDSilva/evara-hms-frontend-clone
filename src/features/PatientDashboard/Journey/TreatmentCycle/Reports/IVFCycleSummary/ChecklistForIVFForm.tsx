import React from "react";
import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";

// Define the type for form values
interface IFormValues {
  isFemaleHistorySheetCompleted: string;
  areViralMarkersDoneFemale: string;
  resultViralMarkersFemale: string;
  areViralMarkersDoneMale: string;
  financialTermsAndConditionsForART: string;
  embryologistInformedTimingOfHCG: string;
  mockTransfer: string;
  explainDSProcedureAndConsent: string;
  spermFreezingBackup: string;
  medicationUsed: string;
  discussConsentForms: string;
  discussSuccessRatesOfART: string;
  isMaleHistorySheetCompleted: string;
  laparoscopy: string;
  hysteroscopy: string;
  UCL: string;
  uterus: string;
  discussTreatment: string;
  protocolLongShort: string;
  stimulationRecagonMenopur: string;
}

interface ChecklistForIVFFormProps {
  formik: FormikProps<IFormValues>;
}

const ChecklistForIVFForm: React.FC<ChecklistForIVFFormProps> = ({ formik }) => (
  <>
    <Typography variant="h6" pt={2} pb={2}>
      Checklist For IVF
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="isFemaleHistorySheetCompleted"
          label="Is Female History Sheet Completed"
          select
          fullWidth
          value={formik.values.isFemaleHistorySheetCompleted}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="areViralMarkersDoneFemale"
          label="Are Viral Markers Done (Female)"
          select
          fullWidth
          value={formik.values.areViralMarkersDoneFemale}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="resultViralMarkersFemale"
          label="Result of Viral Markers (Female)"
          fullWidth
          value={formik.values.resultViralMarkersFemale}
          onChange={formik.handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="areViralMarkersDoneMale"
          label="Are Viral Markers Done (Male)"
          select
          fullWidth
          value={formik.values.areViralMarkersDoneMale}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="financialTermsAndConditionsForART"
          label="Financial Terms & Conditions for ART"
          select
          fullWidth
          value={formik.values.financialTermsAndConditionsForART}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="embryologistInformedTimingOfHCG"
          label="Embryologist Informed Timing of HCG"
          select
          fullWidth
          value={formik.values.embryologistInformedTimingOfHCG}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="mockTransfer"
          label="Mock Transfer"
          select
          fullWidth
          value={formik.values.mockTransfer}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="explainDSProcedureAndConsent"
          label="Explain DS Procedure and Consent"
          select
          fullWidth
          value={formik.values.explainDSProcedureAndConsent}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="spermFreezingBackup"
          label="Sperm Freezing Backup"
          select
          fullWidth
          value={formik.values.spermFreezingBackup}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="medicationUsed"
          label="Medication Used"
          fullWidth
          value={formik.values.medicationUsed}
          onChange={formik.handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="discussConsentForms"
          label="Discuss Consent Forms"
          select
          fullWidth
          value={formik.values.discussConsentForms}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="discussSuccessRatesOfART"
          label="Discuss Success Rates of ART"
          select
          fullWidth
          value={formik.values.discussSuccessRatesOfART}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="isMaleHistorySheetCompleted"
          label="Is Male History Sheet Completed"
          select
          fullWidth
          value={formik.values.isMaleHistorySheetCompleted}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="laparoscopy"
          label="Laparoscopy"
          select
          fullWidth
          value={formik.values.laparoscopy}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="hysteroscopy"
          label="Hysteroscopy"
          select
          fullWidth
          value={formik.values.hysteroscopy}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="UCL"
          label="UCL"
          select
          fullWidth
          value={formik.values.UCL}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="uterus"
          label="Uterus"
          fullWidth
          value={formik.values.uterus}
          onChange={formik.handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="discussTreatment"
          label="Discuss Treatment"
          select
          fullWidth
          value={formik.values.discussTreatment}
          onChange={formik.handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="protocolLongShort"
          label="Protocol (Long/Short)"
          fullWidth
          value={formik.values.protocolLongShort}
          onChange={formik.handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          name="stimulationRecagonMenopur"
          label="Stimulation (Recagon/Menopur)"
          fullWidth
          value={formik.values.stimulationRecagonMenopur}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  </>
);

export default ChecklistForIVFForm;
