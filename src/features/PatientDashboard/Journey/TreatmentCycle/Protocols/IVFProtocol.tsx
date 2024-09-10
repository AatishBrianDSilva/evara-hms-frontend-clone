import { Box, Button, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useContext } from "react";
// import { IVFProtocolValidationSchema } from "../../../../../yup/patientDashboard/treatmentCycle";
import CustomDatePicker from "../../../../../components/CustomDatePicker/CustomDatePicker";
import ModalContext from "../../../../../context/ModalContext";

import { useToast } from "../../../../../context/ToastContext";
import _ from "lodash";
import { IPatientTreatmentCycleProtocol } from "../../../../../types/patientDashboard/treatmentCycle";
import {
  useEditTreatmentCycleMutation,
  useGetTreatmentCyclesQuery,
} from "../../../../../services/patientDashboardService/treatmentCycleApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";

interface IFormValues {
  lmpDate: Date | null;
  dawnRegistrationDate: Date | null;
  stimulationDate: Date | null;
  expectedEggPickUpDate: Date | null;
  eggPickUpDate: Date | null;
}

interface IVFProtocolProps {
  protocol: IPatientTreatmentCycleProtocol;
  treatmentCycleId: string;
}

const IVFProtocol: React.FC<IVFProtocolProps> = ({ protocol, treatmentCycleId }) => {
  const { closeModal } = useContext(ModalContext);
  const { showPromiseToast } = useToast();

  const { patient } = useSelector((state: RootState) => state.patients);

  const [updateProtocol, { isLoading }] = useEditTreatmentCycleMutation();

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
    dawnRegistrationDate: currentProtocol?.details?.dawnRegistrationDate
      ? new Date(currentProtocol.details?.dawnRegistrationDate)
      : null,
    stimulationDate: currentProtocol?.details?.stimulationDate
      ? new Date(currentProtocol.details?.stimulationDate)
      : null,
    expectedEggPickUpDate: currentProtocol?.details?.expectedEggPickUpDate
      ? new Date(currentProtocol.details?.expectedEggPickUpDate)
      : null,
    eggPickUpDate: currentProtocol?.details?.eggPickUpDate
      ? new Date(currentProtocol.details?.eggPickUpDate)
      : null,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    // validationSchema: IVFProtocolValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
      <Typography variant="button" color="primary">
        Add IVF Protocol
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
          <CustomDatePicker
            label="Dawn Registration Date"
            name="dawnRegistrationDate"
            value={formik.values.dawnRegistrationDate}
            onChange={(date) => formik.setFieldValue("dawnRegistrationDate", date)}
            error={
              formik.touched.dawnRegistrationDate && Boolean(formik.errors.dawnRegistrationDate)
            }
            helperText={formik.touched.dawnRegistrationDate && formik.errors.dawnRegistrationDate}
          />
        </Grid>
        <Grid item lg={4}>
          <CustomDatePicker
            label="Stimulation Date"
            name="stimulationDate"
            value={formik.values.stimulationDate}
            onChange={(date) => formik.setFieldValue("stimulationDate", date)}
            error={formik.touched.stimulationDate && Boolean(formik.errors.stimulationDate)}
            helperText={formik.touched.stimulationDate && formik.errors.stimulationDate}
          />
        </Grid>
        <Grid item lg={4}>
          <CustomDatePicker
            label="Estimated egg pick up date"
            name="expectedEggPickUpDate"
            value={formik.values.expectedEggPickUpDate}
            onChange={(date) => formik.setFieldValue("expectedEggPickUpDate", date)}
            error={
              formik.touched.expectedEggPickUpDate && Boolean(formik.errors.expectedEggPickUpDate)
            }
            helperText={formik.touched.expectedEggPickUpDate && formik.errors.expectedEggPickUpDate}
          />
        </Grid>
        <Grid item lg={4}>
          <CustomDatePicker
            name="eggPickUpDate"
            label="Egg Pickup Date"
            value={formik.values.eggPickUpDate}
            onChange={(date) => formik.setFieldValue("eggPickUpDate", date)}
            error={formik.touched.eggPickUpDate && Boolean(formik.errors.eggPickUpDate)}
            helperText={formik.touched.eggPickUpDate && formik.errors.eggPickUpDate}
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

export default IVFProtocol;
