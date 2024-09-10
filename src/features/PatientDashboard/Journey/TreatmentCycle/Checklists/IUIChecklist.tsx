import { Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useContext } from "react";
import ModalContext from "../../../../../context/ModalContext";
import { IPatientTreatmentCycleChecklist } from "../../../../../types/patientDashboard/treatmentCycle";
import {
  useEditTreatmentCycleMutation,
  useGetTreatmentCyclesQuery,
} from "../../../../../services/patientDashboardService/treatmentCycleApi";
import { useToast } from "../../../../../context/ToastContext";
import _ from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";

interface IFormValues {
  femaleHistorySheetComplete: boolean | string;
  maleHistorySheetComplete: boolean | string;
  uterus: string;
  hysteroScopyFindings: boolean | string;
  totalPatencyStatus: string;
  consentForm: boolean | string;
  otherInformation?: string;
}

interface IUIChecklistProps {
  checklist: IPatientTreatmentCycleChecklist;
  treatmentCycleId: string;
}

const IUIChecklist: React.FC<IUIChecklistProps> = ({ checklist, treatmentCycleId }) => {
  const { closeModal } = useContext(ModalContext);
  const { showPromiseToast } = useToast();

  const [updateChecklist, { isLoading }] = useEditTreatmentCycleMutation();

  const { patient } = useSelector((state: RootState) => state.patients);

  const { data: cycleData } = useGetTreatmentCyclesQuery(
    {
      filters: {
        patientCode: patient?.patientId,
      },
      sort: {
        createdAt: -1,
      },
    },
    {
      skip: !patient?.patientId,
    }
  );

  const patientTreatmentCycles = cycleData?.data || [];

  // Find the specific treatment cycle by ID
  const currentTreatmentCycle = patientTreatmentCycles.find(
    (cycle) => cycle._id === treatmentCycleId
  );

  // Find the specific checklist by category and ID
  const currentChecklist = currentTreatmentCycle?.checklists.find((c) => c._id === checklist._id);

  const handleFormSubmit = async (values: IFormValues) => {
    const options = {
      conditions: {
        editType: "update",
        category: checklist.category,
      },
    };

    const payload = {
      id: treatmentCycleId,
      details: {
        ...values,
      },
      documentId: checklist._id,
    };

    const promise = updateChecklist({ payload, options }).unwrap();

    showPromiseToast(promise, {
      loading: "Adding Checklist...",
      success: (data) => data.message || "Checklist Updated Successfully",
      error: (data) => data.message || "Error Updating Checklist",
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues: IFormValues = {
    femaleHistorySheetComplete: currentChecklist?.details?.femaleHistorySheetComplete || "",
    maleHistorySheetComplete: currentChecklist?.details?.maleHistorySheetComplete || "",
    uterus: currentChecklist?.details?.uterus || "",
    hysteroScopyFindings: currentChecklist?.details?.hysteroScopyFindings || "",
    totalPatencyStatus: currentChecklist?.details?.totalPatencyStatus || "",
    consentForm: currentChecklist?.details?.consentForm || "",
    otherInformation: currentChecklist?.details?.otherInformation || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    // validationSchema: IUIChecklistValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
      <Typography variant="button" color="primary">
        Add IUI Checklist
      </Typography>
      <Grid container spacing={2} mb={2} mt={2}>
        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="femaleHistorySheetComplete"
            label="Female History Sheet Complete"
            onChange={formik.handleChange}
            value={formik.values.femaleHistorySheetComplete}
            error={
              formik.touched.femaleHistorySheetComplete &&
              Boolean(formik.errors.femaleHistorySheetComplete)
            }
            helperText={
              formik.touched.femaleHistorySheetComplete && formik.errors.femaleHistorySheetComplete
            }
          >
            <MenuItem value={"true"}>Yes</MenuItem>
            <MenuItem value={"false"}>No</MenuItem>
          </TextField>
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="maleHistorySheetComplete"
            label="Male History Sheet Complete"
            value={formik.values.maleHistorySheetComplete}
            onChange={formik.handleChange}
            error={
              formik.touched.maleHistorySheetComplete &&
              Boolean(formik.errors.maleHistorySheetComplete)
            }
            helperText={
              formik.touched.maleHistorySheetComplete && formik.errors.maleHistorySheetComplete
            }
          >
            <MenuItem value={"true"}>Yes</MenuItem>
            <MenuItem value={"false"}>No</MenuItem>
          </TextField>
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="uterus"
            label="Uterus"
            value={formik.values.uterus}
            onChange={formik.handleChange}
            error={formik.touched.uterus && Boolean(formik.errors.uterus)}
            helperText={formik.touched.uterus && formik.errors.uterus}
          >
            <MenuItem value={"true"}>AV</MenuItem>
            <MenuItem value={"false"}>RV</MenuItem>
          </TextField>
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="hysteroScopyFindings"
            label="Hysteroscopy Findings"
            value={formik.values.hysteroScopyFindings}
            onChange={formik.handleChange}
            error={
              formik.touched.hysteroScopyFindings && Boolean(formik.errors.hysteroScopyFindings)
            }
            helperText={formik.touched.hysteroScopyFindings && formik.errors.hysteroScopyFindings}
          >
            <MenuItem value={"true"}>Yes</MenuItem>
            <MenuItem value={"false"}>No</MenuItem>
          </TextField>
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="totalPatencyStatus"
            label="Total Patency Status"
            value={formik.values.totalPatencyStatus}
            onChange={formik.handleChange}
            error={formik.touched.totalPatencyStatus && Boolean(formik.errors.totalPatencyStatus)}
            helperText={formik.touched.totalPatencyStatus && formik.errors.totalPatencyStatus}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="consentForm"
            label="IUI Consent Form Signed"
            value={formik.values.consentForm}
            onChange={formik.handleChange}
            error={formik.touched.consentForm && Boolean(formik.errors.consentForm)}
            helperText={formik.touched.consentForm && formik.errors.consentForm}
          >
            <MenuItem value={"true"}>Yes</MenuItem>
            <MenuItem value={"false"}>No</MenuItem>
          </TextField>
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            multiline
            name="otherInformation"
            label="Other Information"
            value={formik.values.otherInformation}
            onChange={formik.handleChange}
            error={formik.touched.otherInformation && Boolean(formik.errors.otherInformation)}
            helperText={formik.touched.otherInformation && formik.errors.otherInformation}
          />
        </Grid>
      </Grid>
      <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoading || _.isEqual(initialValues, formik.values)}
          sx={{ width: "fit-content" }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "fit-content" }}
          onClick={closeModal}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default IUIChecklist;
