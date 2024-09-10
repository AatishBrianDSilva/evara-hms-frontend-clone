import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useContext } from "react";
// import { IVFReportValidationSchema } from "../../../../../yup/patientDashboard/treatmentCycle";
import ModalContext from "../../../../../context/ModalContext";

import { useToast } from "../../../../../context/ToastContext";
import _ from "lodash";
import CustomDatePicker from "../../../../../components/CustomDatePicker/CustomDatePicker";
import CustomTimePicker from "../../../../../components/CustomDatePicker/CustomTimePicker";
import {
  useEditTreatmentCycleMutation,
  useGetTreatmentCyclesQuery,
} from "../../../../../services/patientDashboardService/treatmentCycleApi";
import { IPatientTreatmentCycleReport } from "../../../../../types/patientDashboard/treatmentCycle";
import FileUploadButton from "../../../../../components/FileUploadAndPreview/FileUploadButton";
import { EBuckets, EDocumentTypes } from "../../../../../types/global";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";
import FieldAutocomplete from "../../../../../components/FieldAutoComplete/FieldAutoComplete";
import { DoctorSpeciality } from "../../../../../types/masterDashboard/global";
import { useGetDoctorsQuery } from "../../../../../services/doctorsApi";

interface IFormValues {
  embryologistA: string;
  embryologistB: string;
  gynecologistA: string;
  gynecologistB: string;
  ReferenceDoctor: string;
  files: File | null;
  dateOfThawing: Date | null;
  timeOfThawing: Date | null;
  NoOfEmbryosThawed: string;
  PostThawingSurvival: string;
  NumberOfEmbryosTransferred: string;
  StatusOfTRemainigEmbryos: string;
  EmbryoExpiryDate: Date | null;
  timeOfEmbryoTransfer: Date | null;

  StagesOfEmbryoonicDevelopment: string;
  TransferComments: string;
  endometrialThicknessOnDayOfTransfer: string;
  DescriptionOfEmbryoTransfer: string;
  EmbryoDiscarded: string;
  serumBetaHCGDate: Date | null;
  AssistedHatching: string;
  doctorRemarks: string;
  Advise: string;
  MedicationAsPerDoctorPrescription: string;
}

interface IVFReportProps {
  report: IPatientTreatmentCycleReport;
  treatmentCycleId: string;
}

const EmbryoTransferReport: React.FC<IVFReportProps> = ({ report, treatmentCycleId }) => {
  const { closeModal } = useContext(ModalContext);
  const { showPromiseToast } = useToast();
  const patient = useSelector((state: RootState) => state.patients.patient);
  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>([""]);
  const [updateReport, { isLoading }] = useEditTreatmentCycleMutation();

  // Fetch doctors for the doctor selection
  const { data: doctorData } = useGetDoctorsQuery({});
  const doctors = doctorData?.data?.records || [];

  const { data: treatmentCyclesData } = useGetTreatmentCyclesQuery(
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

  const patientTreatmentCycles = treatmentCyclesData?.data || [];

  // Find the specific treatment cycle by ID
  const currentTreatmentCycle = patientTreatmentCycles.find(
    (cycle) => cycle._id === treatmentCycleId
  );

  // Find the specific report by category and ID
  const currentReport = currentTreatmentCycle?.reports.find((r) => r._id === report._id);

  const handleFormSubmit = async (values: IFormValues) => {
    const options = {
      conditions: {
        editType: "update",
        category: report.category,
      },
    };

    const payload = {
      id: treatmentCycleId,
      details: {
        ...values,
        files: fileUploadedUrl,
      },
      documentId: report._id,
    };

    const promise = updateReport({ payload, options }).unwrap();

    showPromiseToast(promise, {
      loading: "Adding Report...",
      success: (data) => data.message || "Report Updated Successfully",
      error: (data) => data.message || "Error Updating Report",
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues: IFormValues = {
    embryologistA: currentReport?.details?.embryologistA || "",
    embryologistB: currentReport?.details?.embryologistB || "",
    gynecologistA: currentReport?.details?.gynecologistA || "",
    gynecologistB: currentReport?.details?.gynecologistB || "",
    ReferenceDoctor: currentReport?.details?.ReferenceDoctor || "",
    files: currentReport?.details?.files || null,
    dateOfThawing: currentReport?.details?.dateOfThawing || null,
    timeOfThawing: currentReport?.details?.timeOfThawing || null,
    NoOfEmbryosThawed: currentReport?.details?.NoOfEmbryosThawed || "",
    PostThawingSurvival: currentReport?.details?.PostThawingSurvival || "",
    NumberOfEmbryosTransferred: currentReport?.details?.NumberOfEmbryosTransferred || "",
    StatusOfTRemainigEmbryos: currentReport?.details?.StatusOfTRemainigEmbryos || "",
    EmbryoExpiryDate: currentReport?.details?.EmbryoExpiryDate || null,
    timeOfEmbryoTransfer: currentReport?.details?.timeOfEmbryoTransfer || null,
    StagesOfEmbryoonicDevelopment: currentReport?.details?.StagesOfEmbryoonicDevelopment || "",
    TransferComments: currentReport?.details?.TransferComments || "",
    endometrialThicknessOnDayOfTransfer:
      currentReport?.details?.endometrialThicknessOnDayOfTransfer || "",
    DescriptionOfEmbryoTransfer: currentReport?.details?.DescriptionOfEmbryoTransfer || "",
    EmbryoDiscarded: currentReport?.details?.EmbryoDiscarded || "",
    serumBetaHCGDate: currentReport?.details?.serumBetaHCGDate || null,
    AssistedHatching: currentReport?.details?.AssistedHatching || "",
    doctorRemarks: currentReport?.details?.doctorRemarks || "",
    Advise: currentReport?.details?.Advise || "",
    MedicationAsPerDoctorPrescription:
      currentReport?.details?.MedicationAsPerDoctorPrescription || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    // validationSchema: IVFReportValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
      <Typography variant="h6" color="primary">
        Embryo Transfer Report
      </Typography>

      <Typography variant="button" color="primary">
        IVF NO
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FieldAutocomplete
            options={doctors}
            getOptionLabel={(option) => `${option.firstName || ""} ${option.lastName || ""}`}
            filterOptions={(options, _state) => {
              return options.filter(
                (option) => option.speciality === DoctorSpeciality.Embryologist
              );
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formik.values.embryologistA}
            onChange={(newValue) => formik.setFieldValue("embryologistA", newValue)}
            label="Embryologist A"
            error={formik.touched.embryologistA && Boolean(formik.errors.embryologistA)}
            helperText={formik.touched.embryologistA && formik.errors.embryologistA}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FieldAutocomplete
            options={doctors}
            getOptionLabel={(option) => `${option.firstName || ""} ${option.lastName || ""}`}
            filterOptions={(options, _state) => {
              return options.filter(
                (option) => option.speciality === DoctorSpeciality.Embryologist
              );
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formik.values.embryologistB}
            onChange={(newValue) => formik.setFieldValue("embryologistB", newValue)}
            label="Embryologist B"
            error={formik.touched.embryologistB && Boolean(formik.errors.embryologistB)}
            helperText={formik.touched.embryologistB && formik.errors.embryologistB}
          />
        </Grid>
        {/* <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="gynecologistA"
            fullWidth
            select
            label="Gynecologist 1"
            error={formik.touched.gynecologistA && Boolean(formik.errors.gynecologistA)}
            helperText={formik.touched.gynecologistA && formik.errors.gynecologistA}
            onChange={formik.handleChange}
          >
            <MenuItem value="Dr. John Doe">Dr. John Doe</MenuItem>
            <MenuItem value="Dr. Jane Smith">Dr. Jane Smith</MenuItem>
            <MenuItem value="Dr. Michael Johnson">Dr. Michael Johnson</MenuItem>
          </TextField>
        </Grid> */}

        <Grid item xs={12} sm={6} md={3}>
          <FieldAutocomplete
            options={doctors}
            getOptionLabel={(option) => `${option.firstName || ""} ${option.lastName || ""}`}
            filterOptions={(options, _state) => {
              return options.filter(
                (option) => option.speciality === DoctorSpeciality.Gynecologist
              );
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formik.values.gynecologistA}
            onChange={(newValue) => formik.setFieldValue("gynecologistA", newValue)}
            label="Gynecologist A"
            error={formik.touched.gynecologistA && Boolean(formik.errors.gynecologistA)}
            helperText={formik.touched.gynecologistA && formik.errors.gynecologistA}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FieldAutocomplete
            options={doctors}
            getOptionLabel={(option) => `${option.firstName || ""} ${option.lastName || ""}`}
            filterOptions={(options, _state) => {
              return options.filter(
                (option) => option.speciality === DoctorSpeciality.Gynecologist
              );
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formik.values.gynecologistB}
            onChange={(newValue) => formik.setFieldValue("gynecologistB", newValue)}
            label="Gynecologist B"
            error={formik.touched.gynecologistB && Boolean(formik.errors.gynecologistB)}
            helperText={formik.touched.gynecologistB && formik.errors.gynecologistB}
          />
        </Grid>
        {/* <Typography variant='h6' color='primary' gutterBottom>Semen Details</Typography> */}

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Reference Doctor"
            fullWidth
            name="ReferenceDoctor"
            error={formik.touched.ReferenceDoctor && Boolean(formik.errors.ReferenceDoctor)}
            helperText={formik.touched.ReferenceDoctor && formik.errors.ReferenceDoctor}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>

      {/* <Typography variant='h6' color={"primary"} gutterBottom>Embryo Thawing</Typography> */}
      {/* <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>Embryo Thawing</Typography> */}
      <Typography variant="button" color="primary">
        Embryo Thawing
      </Typography>
      {/* <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}></Typography> */}
      <Grid container spacing={2} marginBottom={2} mt={2} flex={1}>
        <Grid item lg={4}>
          <CustomDatePicker
            name="dateOfThawing"
            label="Date Of Thawing"
            value={formik.values.dateOfThawing}
            onChange={(date) => formik.setFieldValue("dateOfThawing", date)}
            error={formik.touched.dateOfThawing && Boolean(formik.errors.dateOfThawing)}
            helperText={formik.touched.dateOfThawing && formik.errors.dateOfThawing}
          />
        </Grid>

        <Grid item lg={4}>
          <CustomTimePicker
            label="Time Of Thawing"
            value={formik.values.timeOfThawing}
            onChange={(date) => formik.setFieldValue("timeOfThawing", date)}
            error={formik.touched.timeOfThawing && Boolean(formik.errors.timeOfThawing)}
            helperText={formik.touched.timeOfThawing && formik.errors.timeOfThawing}
          />
        </Grid>

        <Grid item lg={4}>
          <TextField
            fullWidth
            name="NoOfEmbryosThawed"
            label="No Of Embryos Thawed"
            value={formik.values.NoOfEmbryosThawed}
            onChange={formik.handleChange}
            error={formik.touched.NoOfEmbryosThawed && Boolean(formik.errors.NoOfEmbryosThawed)}
            helperText={formik.touched.NoOfEmbryosThawed && formik.errors.NoOfEmbryosThawed}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="PostThawingSurvival"
            label="Post Thaw Survival and their Description"
            value={formik.values.PostThawingSurvival}
            onChange={formik.handleChange}
            error={formik.touched.PostThawingSurvival && Boolean(formik.errors.PostThawingSurvival)}
            helperText={formik.touched.PostThawingSurvival && formik.errors.PostThawingSurvival}
          />
        </Grid>
      </Grid>
      <Typography variant="button" color="primary">
        Embryo Transfer
      </Typography>
      {/* <Typography variant='h6' color={"primary"} gutterBottom>Embryo Transfer</Typography> */}
      <Grid container spacing={2} marginBottom={2} mt={2} flex={1}>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="NumberOfEmbryosTransferred"
            label="Number of Embryos Transferred"
            value={formik.values.NumberOfEmbryosTransferred}
            onChange={formik.handleChange}
            error={
              formik.touched.NumberOfEmbryosTransferred &&
              Boolean(formik.errors.NumberOfEmbryosTransferred)
            }
            helperText={
              formik.touched.NumberOfEmbryosTransferred && formik.errors.NumberOfEmbryosTransferred
            }
          />
        </Grid>

        <Grid item lg={4}>
          <TextField
            fullWidth
            name="StatusOfTRemainigEmbryos"
            label="Status of Remaining Embryos"
            value={formik.values.StatusOfTRemainigEmbryos}
            onChange={formik.handleChange}
            error={
              formik.touched.StatusOfTRemainigEmbryos &&
              Boolean(formik.errors.StatusOfTRemainigEmbryos)
            }
            helperText={
              formik.touched.StatusOfTRemainigEmbryos && formik.errors.StatusOfTRemainigEmbryos
            }
          />
        </Grid>
        <Grid item lg={4}>
          <CustomDatePicker
            label="Embryo Expiry Date"
            name="EmbryoExpiryDate"
            value={formik.values.EmbryoExpiryDate}
            onChange={(date) => formik.setFieldValue("EmbryoExpiryDate", date)}
            error={formik.touched.EmbryoExpiryDate && Boolean(formik.errors.EmbryoExpiryDate)}
            helperText={formik.touched.EmbryoExpiryDate && formik.errors.EmbryoExpiryDate}
          />
        </Grid>
        <Grid item lg={4}>
          <CustomTimePicker
            label="Time Of Embryo Transfer"
            value={formik.values.timeOfEmbryoTransfer}
            name="timeOfEmbryoTransfer"
            onChange={(date) => formik.setFieldValue("timeOfEmbryoTransfer", date)}
            error={
              formik.touched.timeOfEmbryoTransfer && Boolean(formik.errors.timeOfEmbryoTransfer)
            }
            helperText={formik.touched.timeOfEmbryoTransfer && formik.errors.timeOfEmbryoTransfer}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Stages Of Embryoonic Development"
            name="StagesOfEmbryoonicDevelopment"
            value={formik.values.StagesOfEmbryoonicDevelopment}
            onChange={formik.handleChange}
            error={
              formik.touched.StagesOfEmbryoonicDevelopment &&
              Boolean(formik.errors.StagesOfEmbryoonicDevelopment)
            }
            helperText={
              formik.touched.StagesOfEmbryoonicDevelopment &&
              formik.errors.StagesOfEmbryoonicDevelopment
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Transfer Comments"
            name="TransferComments"
            value={formik.values.TransferComments}
            onChange={formik.handleChange}
            error={formik.touched.TransferComments && Boolean(formik.errors.TransferComments)}
            helperText={formik.touched.TransferComments && formik.errors.TransferComments}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Endometrial Thickness on Day of Transfer"
            name="endometrialThicknessOnDayOfTransfer"
            value={formik.values.endometrialThicknessOnDayOfTransfer}
            onChange={formik.handleChange}
            error={
              formik.touched.endometrialThicknessOnDayOfTransfer &&
              Boolean(formik.errors.endometrialThicknessOnDayOfTransfer)
            }
            helperText={
              formik.touched.endometrialThicknessOnDayOfTransfer &&
              formik.errors.endometrialThicknessOnDayOfTransfer
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Description Of Embryo Transfer"
            name="DescriptionOfEmbryoTransfer"
            value={formik.values.DescriptionOfEmbryoTransfer}
            onChange={formik.handleChange}
            error={
              formik.touched.DescriptionOfEmbryoTransfer &&
              Boolean(formik.errors.DescriptionOfEmbryoTransfer)
            }
            helperText={
              formik.touched.DescriptionOfEmbryoTransfer &&
              formik.errors.DescriptionOfEmbryoTransfer
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Embryo Discarded"
            name="EmbryoDiscarded"
            value={formik.values.EmbryoDiscarded}
            onChange={formik.handleChange}
            error={formik.touched.EmbryoDiscarded && Boolean(formik.errors.EmbryoDiscarded)}
            helperText={formik.touched.EmbryoDiscarded && formik.errors.EmbryoDiscarded}
          />
        </Grid>
        <Grid item lg={4}>
          <CustomDatePicker
            label="Serum Beta HCG Date"
            name="serumBetaHCGDate"
            value={formik.values.serumBetaHCGDate}
            onChange={(date) => formik.setFieldValue("serumBetaHCGDate", date)}
            error={formik.touched.serumBetaHCGDate && Boolean(formik.errors.serumBetaHCGDate)}
            helperText={formik.touched.serumBetaHCGDate && formik.errors.serumBetaHCGDate}
          />
        </Grid>

        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Assisted Hatching"
            name="AssistedHatching"
            value={formik.values.AssistedHatching}
            onChange={formik.handleChange}
            error={formik.touched.AssistedHatching && Boolean(formik.errors.AssistedHatching)}
            helperText={formik.touched.AssistedHatching && formik.errors.AssistedHatching}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Doctor Remarks"
            name="doctorRemarks"
            value={formik.values.doctorRemarks}
            onChange={formik.handleChange}
            error={formik.touched.doctorRemarks && Boolean(formik.errors.doctorRemarks)}
            helperText={formik.touched.doctorRemarks && formik.errors.doctorRemarks}
          />
        </Grid>
        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Advise"
              name="Advise"
              value={formik.values.Advise}
              onChange={formik.handleChange}
              error={formik.touched.Advise && Boolean(formik.errors.Advise)}
              helperText={formik.touched.Advise && formik.errors.Advise}
            />
          </Grid>
        </Grid>
        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Medication as per doctor medication"
              name="MedicationAsPerDoctorPrescription"
              value={formik.values.MedicationAsPerDoctorPrescription}
              onChange={formik.handleChange}
              error={
                formik.touched.MedicationAsPerDoctorPrescription &&
                Boolean(formik.errors.MedicationAsPerDoctorPrescription)
              }
              helperText={
                formik.touched.MedicationAsPerDoctorPrescription &&
                formik.errors.MedicationAsPerDoctorPrescription
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Upload Images & Description
        </Typography>
        {/* <Grid container spacing={2} marginBottom={2}> */}
        <Grid item xs={12}>
          {patient && (
            <FileUploadButton
              acceptTypes="image/*, application/pdf"
              maxFiles={5}
              maxFileSizeinMB={15}
              onUploadFiles={setFileUploadedUrl}
              bucket={EBuckets.UserReports}
              documentType={EDocumentTypes.TreatmentCycle}
              user={patient?._id}
              reportId={treatmentCycleId}
            />
          )}
        </Grid>
      </Grid>
      <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={
            isLoading ||
            (_.isEqual(formik.values, formik.initialValues) && fileUploadedUrl.length === 0)
          }
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

export default EmbryoTransferReport;
