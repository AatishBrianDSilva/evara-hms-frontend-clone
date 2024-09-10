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
import CustomTimePicker from "../../../../../components/CustomDatePicker/CustomTimePicker";
import CustomDatePicker from "../../../../../components/CustomDatePicker/CustomDatePicker";
import {
  useEditInvestigationMutation,
  useGetInvestigationByIdQuery,
} from "../../../../../services/patientDashboardService/investigationApi";
import {
  IEditInvestigationForm,
  IEditInvestigationpayload,
  ISpermDFIForm,
} from "../../../../../types/patientDashboard/investigation";
import { useSelector } from "react-redux";
import { useToast } from "../../../../../context/ToastContext";
import { RootState } from "../../../../../app/store";
import React from "react";
import { ETestType } from "../../../../../types/master";
import { useFormik } from "formik";
import FileUploadButton from "../../../../../components/FileUploadAndPreview/FileUploadButton";
import { EBuckets, EDocumentTypes } from "../../../../../types/global";
import ReportModalHeader from "../../../../../components/ReportModalHeader/ReportModalHeader";
import _ from "lodash";
import FieldAutocomplete from "../../../../../components/FieldAutoComplete/FieldAutoComplete";
import { useGetDoctorsQuery } from "../../../../../services/doctorsApi";
import { DoctorSpeciality } from "../../../../../types/masterDashboard/global";

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

const SpermDFI: React.FC = () => {
  // const dispatch = useDispatch();
  const { showPromiseToast } = useToast();
  const [editInvestigation, { isLoading: editingInvestigation }] = useEditInvestigationMutation();
  const openEditDialog = useSelector(
    (state: RootState) => state.investigation.editInvestigationOpen
  );

  const patient = useSelector((state: RootState) => state.patients.patient);

  const {
    data: investigationData,
    isLoading: investigationLoading,
    isFetching: investigationFetching,
  } = useGetInvestigationByIdQuery(openEditDialog.id, {
    skip: !openEditDialog || !openEditDialog.id,
  });

  // Get doctors
  const {
    data: DoctorsData,
    isLoading: DoctorsLoading,
    isFetching: DoctorFetching,
  } = useGetDoctorsQuery({});
  const doctors = DoctorsData?.data?.records || [];

  const investigation = investigationData?.data;
  const loading = investigationLoading || investigationFetching;
  // console.log("Log Investigation", investigation);

  const date = new Date(investigation?.date || new Date()).toLocaleDateString();
  const doctor = investigation?.doctor?.firstName + " " + investigation?.doctor?.lastName;
  const investigationName = investigation?.investigation?.test?.testName;

  const investigationDetails = investigation?.result?.details as ISpermDFIForm;
  console.log("Investigation details", investigationDetails);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    // Initialize with an empty array by default
    let initialUrl: string[] = [];

    if (investigation?.result?.files) {
      initialUrl = investigation.result.files.flat();
    }

    return initialUrl;
  });

  const handleSubmit = async (values: IEditInvestigationForm<ISpermDFIForm>) => {
    const payload: IEditInvestigationpayload = {
      status: values.status,
      result: {
        notes: values.notes,
        files: fileUploadedUrl,
        testName: investigationName!,
        details: values.result,
      },
      testType: ETestType.SemenAnalysis,
    };

    console.log("Payload", payload);

    const promise = editInvestigation({ _id: openEditDialog.id, ...payload }).unwrap();

    showPromiseToast(promise, {
      loading: "Updating investigation...",
      success: () => "Investigation updated successfully",
      error: () => "An error occurred while updating investigation",
    });

    try {
      await promise;
    } catch (error) {
      console.error("Failed to update investigation", error);
    }
    formik.resetForm();
  };

  const initialValues: IEditInvestigationForm<ISpermDFIForm> = {
    status: investigation?.status || "",
    files: [],
    result: {
      collectionDate: investigationDetails?.collectionDate || null,
      timeOfCollection: investigationDetails?.timeOfCollection || null,
      timeOfEvaluation: investigationDetails?.timeOfEvaluation || null,
      sampleCollectedAt: investigationDetails?.sampleCollectedAt || "",
      abstinence: investigationDetails?.abstinence || "",
      color: investigationDetails?.color || "",
      volume: investigationDetails?.volume || "",
      liquefaction: investigationDetails?.liquefaction || "",
      viscosity: investigationDetails?.viscosity || "",
      count: investigationDetails?.count || "",
      motility: investigationDetails?.motility || "",
      rapidProgressive: investigationDetails?.rapidProgressive || "",
      slowProgressive: investigationDetails?.slowProgressive || "",
      nonProgressive: investigationDetails?.nonProgressive || "",
      immobile: investigationDetails?.immobile || "",
      normalForms: investigationDetails?.normalForms || "",
      spillage: investigationDetails?.spillage || "",
      agglutination: investigationDetails?.agglutination || "",
      dfi: investigationDetails?.dfi || "",
      embryologist: investigationDetails?.embryologist || "",
      referredBy: investigationDetails?.referredBy || "",
      impressions: investigationDetails?.impressions || "",
      description: investigationDetails?.description || "",
    },
    notes: investigation?.result?.notes || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: semenvalidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const onModalClose = () => {
    formik.resetForm();
  };

  if (loading) return renderSkeletonLoader();

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ReportModalHeader reportName={investigationName} doctor={doctor} date={date} />
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
              Sperm Analysis
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CustomDatePicker
              label="Collection Date"
              value={formik.values.result.collectionDate}
              onChange={(date) => formik.setFieldValue("result.collectionDate", date)}
              error={
                formik.touched.result?.collectionDate &&
                Boolean(formik.errors.result?.collectionDate)
              }
              helperText={
                formik.touched.result?.collectionDate && formik.errors.result?.collectionDate
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CustomTimePicker
              label="Time of Collection"
              value={formik.values.result.timeOfCollection}
              onChange={(date) => formik.setFieldValue("result.timeOfCollection", date)}
              error={
                formik.touched.result?.timeOfCollection &&
                Boolean(formik.errors.result?.timeOfCollection)
              }
              helperText={
                formik.touched.result?.timeOfCollection && formik.errors.result?.timeOfCollection
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CustomTimePicker
              label="Time of Evaluation"
              value={formik.values.result.timeOfEvaluation}
              onChange={(date) => formik.setFieldValue("result.timeOfEvaluation", date)}
              error={
                formik.touched.result?.timeOfEvaluation &&
                Boolean(formik.errors.result?.timeOfEvaluation)
              }
              helperText={
                formik.touched.result?.timeOfEvaluation && formik.errors.result?.timeOfEvaluation
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Sample Collected At"
              fullWidth
              name="result.sampleCollectedAt"
              value={formik.values.result.sampleCollectedAt}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.sampleCollectedAt &&
                Boolean(formik.errors.result?.sampleCollectedAt)
              }
              helperText={
                formik.touched.result?.sampleCollectedAt && formik.errors.result?.sampleCollectedAt
              }
            ></TextField>
          </Grid>
        </Grid>

        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
              Physical Analysis
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Abstinence"
              fullWidth
              value={formik.values.result.abstinence}
              name="result.abstinence"
              onChange={formik.handleChange}
              error={formik.touched.result?.abstinence && Boolean(formik.errors.result?.abstinence)}
              helperText={formik.touched.result?.abstinence && formik.errors.result?.abstinence}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Color"
              fullWidth
              value={formik.values.result.color}
              name="result.color"
              onChange={formik.handleChange}
              error={formik.touched.result?.color && Boolean(formik.errors.result?.color)}
              helperText={formik.touched.result?.color && formik.errors.result?.color}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Volume"
              fullWidth
              value={formik.values.result.volume}
              name="result.volume"
              onChange={formik.handleChange}
              error={formik.touched.result?.volume && Boolean(formik.errors.result?.volume)}
              helperText={formik.touched.result?.volume && formik.errors.result?.volume}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Liquefaction"
              fullWidth
              value={formik.values.result.liquefaction}
              name="result.liquefaction"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.liquefaction && Boolean(formik.errors.result?.liquefaction)
              }
              helperText={formik.touched.result?.liquefaction && formik.errors.result?.liquefaction}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Viscosity"
              fullWidth
              value={formik.values.result.viscosity}
              name="result.viscosity"
              onChange={formik.handleChange}
              error={formik.touched.result?.viscosity && Boolean(formik.errors.result?.viscosity)}
              helperText={formik.touched.result?.viscosity && formik.errors.result?.viscosity}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
              Microscopic Analysis
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Count"
              fullWidth
              value={formik.values.result.count}
              name="result.count"
              onChange={formik.handleChange}
              error={formik.touched.result?.count && Boolean(formik.errors.result?.count)}
              helperText={formik.touched.result?.count && formik.errors.result?.count}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Motility"
              fullWidth
              value={formik.values.result.motility}
              name="result.motility"
              onChange={formik.handleChange}
              error={formik.touched.result?.motility && Boolean(formik.errors.result?.motility)}
              helperText={formik.touched.result?.motility && formik.errors.result?.motility}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Rapid Progressive"
              fullWidth
              value={formik.values.result.rapidProgressive}
              name="result.rapidProgressive"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.rapidProgressive &&
                Boolean(formik.errors.result?.rapidProgressive)
              }
              helperText={
                formik.touched.result?.rapidProgressive && formik.errors.result?.rapidProgressive
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Slow Progressive"
              fullWidth
              value={formik.values.result.slowProgressive}
              name="result.slowProgressive"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.slowProgressive &&
                Boolean(formik.errors.result?.slowProgressive)
              }
              helperText={
                formik.touched.result?.slowProgressive && formik.errors.result?.slowProgressive
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Non Progressive"
              fullWidth
              value={formik.values.result.nonProgressive}
              name="result.nonProgressive"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.nonProgressive &&
                Boolean(formik.errors.result?.nonProgressive)
              }
              helperText={
                formik.touched.result?.nonProgressive && formik.errors.result?.nonProgressive
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Immobile"
              fullWidth
              value={formik.values.result.immobile}
              name="result.immobile"
              onChange={formik.handleChange}
              error={formik.touched.result?.immobile && Boolean(formik.errors.result?.immobile)}
              helperText={formik.touched.result?.immobile && formik.errors.result?.immobile}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Normal Forms"
              fullWidth
              value={formik.values.result.normalForms}
              name="result.normalForms"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.normalForms && Boolean(formik.errors.result?.normalForms)
              }
              helperText={formik.touched.result?.normalForms && formik.errors.result?.normalForms}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Spillage"
              fullWidth
              value={formik.values.result.spillage}
              name="result.spillage"
              onChange={formik.handleChange}
              error={formik.touched.result?.spillage && Boolean(formik.errors.result?.spillage)}
              helperText={formik.touched.result?.spillage && formik.errors.result?.spillage}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Agglutination"
              fullWidth
              value={formik.values.result.agglutination}
              name="result.agglutination"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.agglutination && Boolean(formik.errors.result?.agglutination)
              }
              helperText={
                formik.touched.result?.agglutination && formik.errors.result?.agglutination
              }
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
              Other Details
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="DFI (%)"
              fullWidth
              value={formik.values.result.dfi}
              name="result.dfi"
              onChange={formik.handleChange}
              error={formik.touched.result?.dfi && Boolean(formik.errors.result?.dfi)}
              helperText={formik.touched.result?.dfi && formik.errors.result?.dfi}
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
              value={formik.values.result.embryologist}
              onChange={(newValue) => formik.setFieldValue(`result.embryologist`, newValue)}
              label="Embryologist"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FieldAutocomplete
              options={doctors}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              isOptionEqualToValue={(option, value) => {
                return option._id === value._id;
              }}
              value={formik.values.result.referredBy}
              onChange={(newValue) => formik.setFieldValue("result.referredBy", newValue)}
              label="Referred By"
              loading={DoctorFetching || DoctorsLoading}
            />
          </Grid>

          <Grid container spacing={2} marginBottom={2} pt={2} pl={2}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                label="Impressions"
                multiline
                minRows={2}
                fullWidth
                value={formik.values.result.impressions}
                name="result.impressions"
                onChange={formik.handleChange}
                error={
                  formik.touched.result?.impressions && Boolean(formik.errors.result?.impressions)
                }
                helperText={formik.touched.result?.impressions && formik.errors.result?.impressions}
              />
            </Grid>
          </Grid>
          <Grid container pl={2}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
              Upload Images & Description
            </Typography>
            <Grid container spacing={2} marginBottom={2}>
              <Grid item xs={12}>
                {patient && (
                  <FileUploadButton
                    acceptTypes="image/*, application/pdf"
                    maxFiles={5}
                    maxFileSizeinMB={15}
                    onUploadFiles={setFileUploadedUrl}
                    bucket={EBuckets.UserReports}
                    documentType={EDocumentTypes.Investigation}
                    user={patient?._id}
                    reportId={openEditDialog.id}
                  />
                )}
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
                  error={
                    formik.touched.result?.description && Boolean(formik.errors.result?.description)
                  }
                  helperText={
                    formik.touched.result?.description && formik.errors.result?.description
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

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
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2} mb={2}>
          <Button
            variant="contained"
            disabled={
              editingInvestigation ||
              (_.isEqual(formik.values, formik.initialValues) && fileUploadedUrl.length === 0)
            }
            color="primary"
            type="submit"
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "fit-content" }}
            onClick={onModalClose}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </>
  );
};

export default SpermDFI;
