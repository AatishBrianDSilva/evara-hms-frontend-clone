import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import ReportModalHeader from "../../../../../components/ReportModalHeader/ReportModalHeader";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../../../context/ToastContext";
import { RootState } from "../../../../../app/store";
import {
  useEditProcedureMutation,
  useGetProcedureByIdQuery,
} from "../../../../../services/patientDashboardService/procedureApi";
import { IDoctor } from "../../../../../types/doctor";
import {
  IEditProcedureForm,
  IEditProcedurePayload,
} from "../../../../../types/patientDashboard/procedures";
import { IHysteroscopyForm } from "../../../../../types/patientDashboard/investigation";
import { useFormik } from "formik";
import { EProcedureType } from "../../../../../types/master";
import _ from "lodash";
import { closeEditProcedure } from "../procedureSlice";
import CustomDatePicker from "../../../../../components/CustomDatePicker/CustomDatePicker";
import FileUploadButton from "../../../../../components/FileUploadAndPreview/FileUploadButton";
import { EBuckets, EDocumentTypes } from "../../../../../types/global";
import FieldAutocomplete from "../../../../../components/FieldAutoComplete/FieldAutoComplete";
import { DoctorSpeciality } from "../../../../../types/masterDashboard/global";
import { useGetDoctorsQuery } from "../../../../../services/doctorsApi";

const renderSkeletonLoader = () => {
  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} borderBottom={1} py={2}>
        <Box>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>
        <Box>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>
      </Box>
      <Box pt={2} mt={2}>
        <Box>
          <Grid container justifyContent={"space-between"}>
            <Grid item md={6} lg={3}>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
            <Grid item>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Grid item lg={3}>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
            <Grid item lg={3}>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box></Box>
    </>
  );
};

interface HysteroscopyProps {
  doctors: IDoctor[];
}

const Hysteroscopy: React.FC<HysteroscopyProps> = () => {
  const dispatch = useDispatch();
  const { showPromiseToast } = useToast();

  const openEditDialog = useSelector((state: RootState) => state.procedure.editProcedureOpen);

  const { data: doctorData } = useGetDoctorsQuery({});
  const doctors = doctorData?.data?.records || [];

  const {
    data: procedureData,
    isLoading: procedureLoading,
    isFetching: procedureFetching,
  } = useGetProcedureByIdQuery(openEditDialog.id, {
    skip: !openEditDialog || !openEditDialog.id,
  });

  const procedure = procedureData?.data;
  const loading = procedureLoading || procedureFetching;

  // console.log("Hysteroscopy fetch", procedure);

  const patient = useSelector((state: RootState) => state.patients.patient);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>([""]);

  const date = new Date(procedure?.date || new Date()).toLocaleDateString();
  const doctor = procedure?.doctor?.firstName + " " + procedure?.doctor?.lastName;
  const procedureName = procedure?.procedure?.procedure?.procedureName;
  const actualProcedureName = procedure?.procedure?.name;

  const [editProcedure, { isLoading: editingProcedure }] = useEditProcedureMutation();

  const initialVaules: IEditProcedureForm<IHysteroscopyForm> = {
    status: procedure?.status || "",
    result: {
      clinicalDiagnosis: procedure?.result?.details?.clinicalDiagnosis || "",
      lmp: procedure?.result?.details?.lmp || null,
      dayOfCycle: procedure?.result?.details?.dayOfCycle || 0,
      dateOfAdmission: procedure?.result?.details?.dateOfAdmission || null,
      dateOfProcedure: procedure?.result?.details?.dateOfProcedure || null,
      dateOfDischarge: procedure?.result?.details?.dateOfDischarge || null,
      operation: procedure?.result?.details?.operation || "",
      finalDiagnosisAfterOperation: procedure?.result?.details?.finalDiagnosisAfterOperation || "",
      hospital: procedure?.result?.details?.hospital || "",
      gynaecologist: procedure?.result?.details?.gynaecologist || null,
      assistant: procedure?.result?.details?.assistant || "",
      typeOfAnesthesia: procedure?.result?.details?.typeOfAnesthesia || "",
      anaesthetist: procedure?.result?.details?.anaesthetist || null,
      description: procedure?.result?.details?.description || "",
      spouseName: procedure?.result?.details?.spouseName || "",
      complaintHistory: procedure?.result?.details?.complaintHistory || "",
      indication: procedure?.result?.details?.indication || "",
      surgeon: procedure?.result?.details?.surgeon || null,
      procedureDone: procedure?.result?.details?.procedureDone || "",
      findings: procedure?.result?.details?.findings || "",
      impressionSummary: procedure?.result?.details?.impressionSummary || "",
      postOP: procedure?.result?.details?.postOP || "",
      investigationsSent: procedure?.result?.details?.investigationsSent || "",
      reviewDate: procedure?.result?.details?.reviewDate || "",
    },
    files: [],
    notes: procedure?.result?.notes || "",
  };

  const handleSubmit = async (values: IEditProcedureForm<IHysteroscopyForm>) => {
    console.log("Formik values", values);

    const actualName = actualProcedureName || "Default Procedure Name"; // Use a fallback if procedureName is null/undefined

    const payload: IEditProcedurePayload = {
      status: values.status,
      result: {
        notes: values.notes,
        files: fileUploadedUrl,
        procedureName: procedureName!,
        details: values.result,
      },
      testType: EProcedureType.Hysteroscopy,
      actualName: actualName, // New field added to the payload
    };

    console.log("Payload", payload);

    const promise = editProcedure({ _id: openEditDialog.id, ...payload }).unwrap();

    showPromiseToast(promise, {
      loading: "Updating procedure...",
      success: () => "Procedure updated successfully",
      error: () => "An error occurred while updating procedure",
    });

    try {
      await promise;
    } catch (error) {
      console.error("Failed to update procedure", error);
    }
  };

  const formik = useFormik({
    initialValues: initialVaules,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const onModalClose = () => {
    formik.resetForm();
    dispatch(closeEditProcedure());
  };

  if (loading) return renderSkeletonLoader();

  return (
    <form onSubmit={formik.handleSubmit}>
      <ReportModalHeader date={date} doctor={doctor} reportName={procedureName} />
      {/* <Grid container spacing={2} direction="column" mt={2}> */}
      <Grid container spacing={2} marginBottom={2} mt={2} flex={1}>
        {/* Clinical Diagnosis */}
        <Grid item xs={12} md={6} lg={4}>
          <TextField
            label="Clinical Diagnosis"
            fullWidth
            name="result.clinicalDiagnosis"
            value={formik.values.result.clinicalDiagnosis}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.clinicalDiagnosis &&
              Boolean(formik.errors.result?.clinicalDiagnosis)
            }
            helperText={
              formik.touched.result?.clinicalDiagnosis && formik.errors.result?.clinicalDiagnosis
            }
          />
        </Grid>

        {/* Date of Admission */}
        <Grid item xs={12} md={6} lg={4}>
          <CustomDatePicker
            label="Date of Admission"
            value={formik.values.result.dateOfAdmission}
            onChange={(date) => formik.setFieldValue("result.dateOfAdmission", date)}
          />
        </Grid>

        {/* Date of Procedure */}
        <Grid item xs={12} md={6} lg={4}>
          <CustomDatePicker
            label="Date of Procedure"
            value={formik.values.result.dateOfProcedure}
            onChange={(date) => formik.setFieldValue("result.dateOfProcedure", date)}
          />
        </Grid>

        {/* Date of Discharge */}
        <Grid item xs={12} md={6} lg={4}>
          <CustomDatePicker
            label="Date of Discharge"
            value={formik.values.result.dateOfDischarge}
            onChange={(date) => formik.setFieldValue("result.dateOfDischarge", date)}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <TextField
            name="result.spouseName"
            label="Spouse Name"
            fullWidth
            value={formik.values.result.spouseName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Grid>

        {/* LMP */}
        <Grid item xs={12} md={6} lg={4}>
          <CustomDatePicker
            label="LMP"
            value={formik.values.result.lmp}
            onChange={(date) => formik.setFieldValue("result.lmp", date)}
          />
        </Grid>

        {/* Day of Cycle */}
        <Grid item xs={12} md={6} lg={4}>
          <TextField
            name="result.dayOfCycle"
            label="Day of Cycle"
            type="number"
            fullWidth
            value={formik.values.result.dayOfCycle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Grid>

        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              name="result.complaintHistory"
              label="Complaint History"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.complaintHistory}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>

        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              name="result.indication"
              label="Indication"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.indication}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>

        {/* Operation */}
        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              name="result.operation"
              label="Operation"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.operation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>

        {/* Final Diagnosis After Operation */}
        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              name="result.finalDiagnosisAfterOperation"
              label="Final Diagnosis After Operation"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.finalDiagnosisAfterOperation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>

        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              name="result.findings"
              label="Findings"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.findings}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <FieldAutocomplete
            options={doctors}
            getOptionLabel={(option) => `${option.firstName || ""} ${option.lastName || ""}`}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formik.values.result.surgeon}
            onChange={(newValue) => formik.setFieldValue(`result.surgeon`, newValue)}
            label="Surgeon"
          />
        </Grid>

        {/* Gynaecologist */}
        <Grid item xs={12} md={6} lg={4}>
          <FieldAutocomplete
            options={doctors}
            getOptionLabel={(option) => `${option.firstName || ""} ${option.lastName || ""}`}
            filterOptions={(options, _state) => {
              return options.filter(
                (option) => option.speciality === DoctorSpeciality.Gynecologist
              );
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formik.values.result.gynaecologist}
            onChange={(newValue) => formik.setFieldValue(`result.gynaecologist`, newValue)}
            label="Gynaecologist"
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <TextField
            name="result.procedureDone"
            label="Procedure"
            fullWidth
            value={formik.values.result.procedureDone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Grid>

        {/* Hospital */}
        <Grid item xs={12} md={6} lg={4}>
          <TextField
            name="result.hospital"
            label="Hospital"
            fullWidth
            value={formik.values.result.hospital}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Grid>

        {/* Assistant */}
        <Grid item xs={12} md={6} lg={4}>
          <TextField
            name="result.assistant"
            label="Assistant"
            fullWidth
            value={formik.values.result.assistant}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Grid>

        {/* Anaesthetist */}
        <Grid item xs={12} md={6} lg={4}>
          <FieldAutocomplete
            options={doctors}
            getOptionLabel={(option) => `${option.firstName || ""} ${option.lastName || ""}`}
            filterOptions={(options, _state) => {
              return options.filter(
                (option) => option.speciality === DoctorSpeciality.Anaesthetist
              );
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formik.values.result.anaesthetist}
            onChange={(newValue) => formik.setFieldValue(`result.anaesthetist`, newValue)}
            label="Anaesthetist"
          />
        </Grid>

        {/* Type of Anesthesia */}
        <Grid item xs={12} md={6} lg={4}>
          <TextField
            name="result.typeOfAnesthesia"
            label="Type of Anesthesia"
            fullWidth
            value={formik.values.result.typeOfAnesthesia}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Grid>

        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              name="result.impressionSummary"
              label="Impression / Summary"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.impressionSummary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>

        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              name="result.investigationsSent"
              label="Investigations Sent"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.investigationsSent}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>

        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              name="result.postOP"
              label="Post OP"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.postOP}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <CustomDatePicker
            label="Review Date"
            value={formik.values.result.reviewDate}
            onChange={(date) => formik.setFieldValue("result.reviewDate", date)}
          />
        </Grid>

        <Grid container pl={2}>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
            Upload Images & Description
          </Typography>
          <Grid container spacing={2} marginBottom={2}>
            <Grid item xs={12}>
              {/* Upload image button */}
              <Grid item xs={12}>
                {patient && (
                  <FileUploadButton
                    acceptTypes="image/*, application/pdf"
                    maxFiles={5}
                    maxFileSizeinMB={15}
                    onUploadFiles={setFileUploadedUrl}
                    bucket={EBuckets.UserReports}
                    documentType={EDocumentTypes.Procedure}
                    user={patient?._id}
                    reportId={openEditDialog.id}
                  />
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                label="Description"
                multiline
                minRows={2}
                fullWidth
                value={formik.values.result.description}
                name="result.description"
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container pl={2} justifyContent={"center"} alignItems={"center"}>
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2} mb={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.status === "Completed"}
                    onChange={(e) =>
                      formik.setFieldValue("status", e.target.checked ? "Completed" : "Scheduled")
                    }
                    color="primary"
                  />
                }
                label="Status: Completed"
              />
            </Grid>
          </Box>
        </Grid>

        {/* Action Buttons */}
        <Grid container spacing={2} direction="column" mt={2}>
          <Box display={"flex"} justifyContent={"center"} gap={2} p={2}>
            <Button
              variant="contained"
              disabled={
                editingProcedure ||
                (_.isEqual(formik.values, formik.initialValues) && fileUploadedUrl.length === 0)
              }
              color="primary"
              type="submit"
            >
              Update
            </Button>
            <Button onClick={onModalClose} variant="outlined">
              Close
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default Hysteroscopy;
