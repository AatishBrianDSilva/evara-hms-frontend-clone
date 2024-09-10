import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useContext } from "react";
import { IUIProtocolValidationSchema } from "../../../../../yup/patientDashboard/treatmentCycle";
import CustomDatePicker from "../../../../../components/CustomDatePicker/CustomDatePicker";
import ModalContext from "../../../../../context/ModalContext";
import { IPatientTreatmentCycleProtocol } from "../../../../../types/patientDashboard/treatmentCycle";
import {
  useEditTreatmentCycleMutation,
  useGetTreatmentCyclesQuery,
} from "../../../../../services/patientDashboardService/treatmentCycleApi";
import { useToast } from "../../../../../context/ToastContext";
import _ from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";

interface IFormValues {
  lmpDate: Date | null;
  cycleNumber: string;
}

interface IUIProtocolProps {
  protocol: IPatientTreatmentCycleProtocol;
  treatmentCycleId: string;
}

const IUIProtocol: React.FC<IUIProtocolProps> = ({ protocol, treatmentCycleId }) => {
  const { closeModal } = useContext(ModalContext);
  const { showPromiseToast } = useToast();

  const { patient } = useSelector((state: RootState) => state.patients);

  const [updateProtocol, { isLoading }] = useEditTreatmentCycleMutation();

  // Get patient treatmentCycles
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

  // console.log("Cycle", patientTreatmentCycles);

  // Find the specific treatment cycle by ID
  const currentTreatmentCycle = patientTreatmentCycles.find(
    (cycle) => cycle._id === treatmentCycleId
  );

  // Find the specific protocol by category and ID
  const currentProtocol = currentTreatmentCycle?.protocols.find((p) => p._id === protocol._id);

  const handleFormSubmit = async (values: IFormValues) => {
    const options = {
      conditions: {
        editType: "update",
        category: protocol.category,
      },
    };

    const payload = {
      id: treatmentCycleId,
      details: {
        ...values,
      },
      documentId: protocol._id,
    };

    const promise = updateProtocol({ payload, options }).unwrap();

    showPromiseToast(promise, {
      loading: "Adding Protocol...",
      success: (data) => data.message || "Protocol Updated Successfully",
      error: (data) => data.message || "Error Updating Protocol",
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues: IFormValues = {
    lmpDate: currentProtocol?.details?.lmpDate ? new Date(currentProtocol.details.lmpDate) : null,
    cycleNumber: currentProtocol?.details?.cycleNumber || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: IUIProtocolValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
      <Typography variant="button" color="primary">
        Add IUI Protocol
      </Typography>
      <Grid container spacing={2} mb={2} mt={2}>
        <Grid item lg={4}>
          <CustomDatePicker
            label="LMP Date"
            name="lmpDate"
            value={formik.values.lmpDate}
            onChange={(date) => formik.setFieldValue("lmpDate", date)}
            error={formik.touched.lmpDate && Boolean(formik.errors.lmpDate)}
            helperText={formik.touched.lmpDate && formik.errors.lmpDate}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="cycleNumber"
            label="Cycle Number"
            value={formik.values.cycleNumber}
            onChange={formik.handleChange}
            error={formik.touched.cycleNumber && Boolean(formik.errors.cycleNumber)}
            helperText={formik.touched.cycleNumber && formik.errors.cycleNumber}
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

export default IUIProtocol;
