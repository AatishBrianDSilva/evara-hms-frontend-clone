import React from "react";
import { IDoctor } from "../../../../../types/doctor";
import {
  Box,
  Skeleton,
  Grid,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import ReportModalHeader from "../../../../../components/ReportModalHeader/ReportModalHeader";
import { useFormik } from "formik";
import { RootState } from "../../../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../../../context/ToastContext";
import { closeEditCryoPreservation } from "../cryoPreservationSlice";
import {
  useEditCryoPreservationMutation,
  useGetCryoPreservationByIdQuery,
} from "../../../../../services/patientDashboardService/cryoPreservationApi";
import {
  IEditCryoPreservationForm,
  IEditCryoPreservationPayload,
} from "../../../../../types/patientDashboard/cryoPreservations";
import { ICryoPreservationEmbryoForm } from "../../../../../types/patientDashboard/investigation";
import { ECryoPreservationType } from "../../../../../types/master";
import FileUploadButton from "../../../../../components/FileUploadAndPreview/FileUploadButton";
import { EBuckets, EDocumentTypes } from "../../../../../types/global";
import FieldAutocomplete from "../../../../../components/FieldAutoComplete/FieldAutoComplete";
import CustomTimePicker from "../../../../../components/CustomDatePicker/CustomTimePicker";
import { DoctorSpeciality } from "../../../../../types/masterDashboard/global";

interface EmbryoProps {
  doctors: IDoctor[];
}
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

const Embryo: React.FC<EmbryoProps> = ({ doctors }) => {
  const dispatch = useDispatch();
  const { showPromiseToast } = useToast();
  const patient = useSelector(
    (state: RootState) => state.patients.patient as RootState["patients"]["patient"]
  );

  const [editCryopreservation] = useEditCryoPreservationMutation();
  const openEditDialog = useSelector(
    (state: RootState) => state.cryoPreservation.editCryoPreservationOpen
  );

  // Log all doctors passed as props
  // useEffect(() => {
  //   console.log("All Doctors:", doctors);
  // }, [doctors]);

  // const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>([""]);

  const {
    data: cryopresrvationData,
    isLoading: cryopresrvationLoading,
    isFetching: cryopresrvationFetching,
  } = useGetCryoPreservationByIdQuery(openEditDialog.id, {
    skip: !openEditDialog || !openEditDialog.id,
  });
  const Cryopreservation = cryopresrvationData?.data;
  // console.log(Cryopreservation);

  const loading = cryopresrvationLoading || cryopresrvationFetching;

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    // Initialize with an empty array by default
    let initialUrl: string[] = [];

    // Check if the file upload URL is present in the investigation details
    if (Cryopreservation?.details?.files) {
      initialUrl = Cryopreservation.details.files.flat();
    }

    return initialUrl;
  });

  const date = new Date(Cryopreservation?.date || new Date()).toLocaleDateString();
  const doctor = Cryopreservation?.doctor?.firstName + " " + Cryopreservation?.doctor?.lastName;
  const cryopreservationName = Cryopreservation?.details?.cryoPreservationName;
  const onModalClose = () => {
    formik.resetForm();
    dispatch(closeEditCryoPreservation());
  };
  const handleSubmit = async (values: IEditCryoPreservationForm<ICryoPreservationEmbryoForm>) => {
    const payload: IEditCryoPreservationPayload = {
      details: {
        procedureName: cryopreservationName!,
        details: formik.values.details,
        files: fileUploadedUrl,
        notes: formik.values.notes,
      },
      status: values.status,
      testType: ECryoPreservationType.Embryo,
    };

    const promise = editCryopreservation({
      _id: openEditDialog.id,
      ...payload,
    }).unwrap();

    console.log("Payload", payload);

    showPromiseToast(promise, {
      loading: "Updating cryopreservation...",
      success: () => " cryopreservation updated successfully",
      error: () => "An error occurred while updating  cryopreservation",
    });

    try {
      await promise;
    } catch (error) {
      console.error("Failed to update  cryopreservation", error);
    }
    formik.resetForm();
  };

  const initialValues: IEditCryoPreservationForm<ICryoPreservationEmbryoForm> = {
    status: Cryopreservation?.status || "",
    details: {
      doctor: Cryopreservation?.details?.details?.doctor || "",
      date: Cryopreservation?.details?.details?.date || null,
      time: Cryopreservation?.details?.details?.time || null,
      ivf: Cryopreservation?.details?.details?.ivf || "",
      embryologistA: Cryopreservation?.details?.details?.embryologistA || "",
      embryologistB: Cryopreservation?.details?.details?.embryologistB || "",
      numberOfOocytes: Cryopreservation?.details?.details?.numberOfOocytes || "",
      spermParameters: Cryopreservation?.details?.details?.spermParameters || "",
      methodOfArt: Cryopreservation?.details?.details?.methodOfArt || "",
      numberOfOocyteFertilized: Cryopreservation?.details?.details?.numberOfOocyteFertilized || "",
      embryoTransferDetails: Cryopreservation?.details?.details?.embryoTransferDetails || "",
      totalNumberOfEmbryoFrozen:
        Cryopreservation?.details?.details?.totalNumberOfEmbryoFrozen || "",
      developmentStage: Cryopreservation?.details?.details?.developmentStage || "",
      fragmentation: Cryopreservation?.details?.details?.fragmentation || "",
      vitrificationMedia: Cryopreservation?.details?.details?.vitrificationMedia || "",
      embryoGrade: Cryopreservation?.details?.details?.embryoGrade || "",
      embryoQuality: Cryopreservation?.details?.details?.embryoQuality || "",
      hivHbag: Cryopreservation?.details?.details?.hivHbag || "",
      bloodGroupOfWife: Cryopreservation?.details?.details?.bloodGroupOfWife || "",
      bloodGroupOfHusband: Cryopreservation?.details?.details?.bloodGroupOfHusband || "",
      expiryOfMonths: Cryopreservation?.details?.details?.expiryOfMonths || "",
      dateOfExpiry: Cryopreservation?.details?.details?.dateOfExpiry || null,
      cryoCanNumber: Cryopreservation?.details?.details?.cryoCanNumber || "",
      canisterNumber: Cryopreservation?.details?.details?.canisterNumber || "",
      gobletColours: Cryopreservation?.details?.details?.gobletColours || "",
      overallDefects: Cryopreservation?.details?.details?.overallDefects || "",
      tankNumber: Cryopreservation?.details?.details?.tankNumber || "",
      container: Cryopreservation?.details?.details?.container || "",
      description: Cryopreservation?.details?.details?.description || "",
      disclaimer: Cryopreservation?.details?.details?.disclaimer || "",
      note: Cryopreservation?.details?.details?.note || "",
      files: [],
    },
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    // validationSchema: EmbryovalidationSchema,
    enableReinitialize: true,
  });

  if (loading) return renderSkeletonLoader();
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        {/* {JSON.stringify(formik.values.details.doctor, null, 2)} */}

        <ReportModalHeader reportName={cryopreservationName} doctor={doctor} date={date} />
        <Grid container spacing={2} marginBottom={2} mt={2} flex={1}>
          <Grid item xs={12} sm={6} md={3}>
            <FieldAutocomplete
              options={doctors}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={formik.values.details.doctor}
              onChange={(newValue) => formik.setFieldValue(`details.doctor`, newValue)}
              label="Doctor"
              error={formik.touched.details?.doctor && Boolean(formik.errors.details?.doctor)}
              helperText={formik.touched.details?.doctor && formik.errors.details?.doctor}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Date Of Freezing"
              format="dd/MM/yyyy"
              value={formik.values.details.date}
              onChange={(date) => formik.setFieldValue("details.date", date)}
              sx={{ width: "100%" }}
              slots={TextField}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: formik.touched.details?.date && Boolean(formik.errors.details?.date),
                  helperText: formik.touched.details?.date && formik.errors.details?.date,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CustomTimePicker
              label="Time Of Freezing"
              value={formik.values.details?.time}
              onChange={(date) => formik.setFieldValue("details.time", date)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="IVF"
              fullWidth
              name="details.ivf"
              value={formik.values.details.ivf}
              onChange={formik.handleChange}
              error={formik.touched.details?.ivf && Boolean(formik.errors.details?.ivf)}
              helperText={formik.touched.details?.ivf && formik.errors.details?.ivf}
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
              value={formik.values.details.embryologistA}
              onChange={(newValue) => formik.setFieldValue(`details.embryologistA`, newValue)}
              label="Embryologist 1"
              error={
                formik.touched.details?.embryologistA &&
                Boolean(formik.errors.details?.embryologistA)
              }
              helperText={
                formik.touched.details?.embryologistA && formik.errors.details?.embryologistA
              }
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
              value={formik.values.details.embryologistB}
              onChange={(newValue) => formik.setFieldValue(`details.embryologistB`, newValue)}
              label="Embryologist 2"
              error={
                formik.touched.details?.embryologistB &&
                Boolean(formik.errors.details?.embryologistB)
              }
              helperText={
                formik.touched.details?.embryologistB && formik.errors.details?.embryologistB
              }
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          IVF Cycle Details
        </Typography>

        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Number Of Oocytes collected"
              fullWidth
              type="number"
              name="details.numberOfOocytes"
              value={formik.values.details?.numberOfOocytes}
              onChange={formik.handleChange}
              error={
                formik.touched.details?.numberOfOocytes &&
                Boolean(formik.errors.details?.numberOfOocytes)
              }
              helperText={
                formik.touched.details?.numberOfOocytes && formik.errors.details?.numberOfOocytes
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Sperm Parameters"
              fullWidth
              value={formik.values.details?.spermParameters}
              name="details.spermParameters"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.spermParameters &&
                Boolean(formik.errors.details?.spermParameters)
              }
              helperText={
                formik.touched.details?.spermParameters && formik.errors.details?.spermParameters
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Method Of ART"
              fullWidth
              value={formik.values.details?.methodOfArt}
              name="details.methodOfArt"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.methodOfArt && Boolean(formik.errors.details?.methodOfArt)
              }
              helperText={formik.touched.details?.methodOfArt && formik.errors.details?.methodOfArt}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Number Of Oocytes Fertilized"
              fullWidth
              type="number"
              value={formik.values.details?.numberOfOocyteFertilized}
              name="details.numberOfOocyteFertilized"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.numberOfOocyteFertilized &&
                Boolean(formik.errors.details?.numberOfOocyteFertilized)
              }
              helperText={
                formik.touched.details?.numberOfOocyteFertilized &&
                formik.errors.details?.numberOfOocyteFertilized
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Embryo Transfer Details"
              fullWidth
              value={formik.values.details?.embryoTransferDetails}
              name="details.embryoTransferDetails"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.embryoTransferDetails &&
                Boolean(formik.errors.details?.embryoTransferDetails)
              }
              helperText={
                formik.touched.details?.embryoTransferDetails &&
                formik.errors.details?.embryoTransferDetails
              }
            />
          </Grid>
        </Grid>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Embryo Details
        </Typography>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Total Number Of Embryo Frozen"
              fullWidth
              type="number"
              name="details.totalNumberOfEmbryoFrozen"
              value={formik.values.details?.totalNumberOfEmbryoFrozen}
              onChange={formik.handleChange}
              error={
                formik.touched.details?.totalNumberOfEmbryoFrozen &&
                Boolean(formik.errors.details?.totalNumberOfEmbryoFrozen)
              }
              helperText={
                formik.touched.details?.totalNumberOfEmbryoFrozen &&
                formik.errors.details?.totalNumberOfEmbryoFrozen
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Development Stage at Time of Freezing"
              name="details.developmentStage"
              value={formik.values.details?.developmentStage}
              fullWidth
              onChange={formik.handleChange}
              error={
                formik.touched.details?.developmentStage &&
                Boolean(formik.errors.details?.developmentStage)
              }
              helperText={
                formik.touched.details?.developmentStage && formik.errors.details?.developmentStage
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Fragmentation"
              fullWidth
              name="details.fragmentation"
              value={formik.values.details?.fragmentation}
              onChange={formik.handleChange}
              error={
                formik.touched.details?.fragmentation &&
                Boolean(formik.errors.details?.fragmentation)
              }
              helperText={
                formik.touched.details?.fragmentation && formik.errors.details?.fragmentation
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Vitrification Media"
              fullWidth
              value={formik.values.details?.vitrificationMedia}
              name="details.vitrificationMedia"
              onChange={(e) => formik.handleChange(e)}
              error={
                formik.touched.details?.vitrificationMedia &&
                Boolean(formik.errors.details?.vitrificationMedia)
              }
              helperText={
                formik.touched.details?.vitrificationMedia &&
                formik.errors.details?.vitrificationMedia
              }
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Embryo Grade"
              fullWidth
              value={formik.values.details?.embryoGrade}
              name="details.embryoGrade"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.embryoGrade && Boolean(formik.errors.details?.embryoGrade)
              }
              helperText={formik.touched.details?.embryoGrade && formik.errors.details?.embryoGrade}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Embryo Quality"
              fullWidth
              value={formik.values.details?.embryoQuality}
              name="details.embryoQuality"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.embryoQuality &&
                Boolean(formik.errors.details?.embryoQuality)
              }
              helperText={
                formik.touched.details?.embryoQuality && formik.errors.details?.embryoQuality
              }
            />
          </Grid>
        </Grid>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Pre-Freeze Screening
        </Typography>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="HIV/HbAg/HCV/VDRL"
              fullWidth
              value={formik.values.details?.hivHbag}
              name="details.hivHbag"
              onChange={formik.handleChange}
              error={formik.touched.details?.hivHbag && Boolean(formik.errors.details?.hivHbag)}
              helperText={formik.touched.details?.hivHbag && formik.errors.details?.hivHbag}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Blood Group Of Wife"
              fullWidth
              value={formik.values.details?.bloodGroupOfWife}
              name="details.bloodGroupOfWife"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.bloodGroupOfWife &&
                Boolean(formik.errors.details?.bloodGroupOfWife)
              }
              helperText={
                formik.touched.details?.bloodGroupOfWife && formik.errors.details?.bloodGroupOfWife
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Blood Group Of Husband"
              fullWidth
              value={formik.values.details?.bloodGroupOfHusband}
              name="details.bloodGroupOfHusband"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.bloodGroupOfHusband &&
                Boolean(formik.errors.details?.bloodGroupOfHusband)
              }
              helperText={
                formik.touched.details?.bloodGroupOfHusband &&
                formik.errors.details?.bloodGroupOfHusband
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Months Of Expiry"
              fullWidth
              value={formik.values.details?.expiryOfMonths}
              name="details.expiryOfMonths"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.expiryOfMonths &&
                Boolean(formik.errors.details?.expiryOfMonths)
              }
              helperText={
                formik.touched.details?.expiryOfMonths && formik.errors.details?.expiryOfMonths
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Date Of Expiry"
              format="dd/MM/yyyy"
              value={formik.values.details.dateOfExpiry}
              onChange={(date) => formik.setFieldValue("details.dateOfExpiry", date)}
              sx={{ width: "100%" }}
              slots={TextField}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error:
                    formik.touched.details?.dateOfExpiry &&
                    Boolean(formik.errors.details?.dateOfExpiry),
                  helperText:
                    formik.touched.details?.dateOfExpiry && formik.errors.details?.dateOfExpiry,
                },
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Cryo Can Number"
              fullWidth
              name="details.cryoCanNumber"
              value={formik.values.details?.cryoCanNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.details?.cryoCanNumber &&
                Boolean(formik.errors.details?.cryoCanNumber)
              }
              helperText={
                formik.touched.details?.cryoCanNumber && formik.errors.details?.cryoCanNumber
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Canister Number"
              fullWidth
              value={formik.values.details?.canisterNumber}
              name="details.canisterNumber"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.canisterNumber &&
                Boolean(formik.errors.details?.canisterNumber)
              }
              helperText={
                formik.touched.details?.canisterNumber && formik.errors.details?.canisterNumber
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Goblet Colours"
              fullWidth
              value={formik.values.details?.gobletColours}
              name="details.gobletColours"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.gobletColours &&
                Boolean(formik.errors.details?.gobletColours)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Overall Defects"
              fullWidth
              value={formik.values.details?.overallDefects}
              name="details.overallDefects"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.overallDefects &&
                Boolean(formik.errors.details?.overallDefects)
              }
              helperText={
                formik.touched.details?.overallDefects && formik.errors.details?.overallDefects
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Tank Number"
              fullWidth
              multiline
              name="details.tankNumber"
              value={formik.values.details.tankNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.details?.tankNumber && Boolean(formik.errors.details?.tankNumber)
              }
              helperText={formik.touched.details?.tankNumber && formik.errors.details?.tankNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Container"
              fullWidth
              multiline
              name="details.container"
              value={formik.values.details.container}
              onChange={formik.handleChange}
              error={formik.touched.details?.container && Boolean(formik.errors.details?.container)}
              helperText={formik.touched.details?.container && formik.errors.details?.container}
            />
          </Grid>
          <Grid container pt={2} pl={2}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                label="Notes"
                multiline
                rows="3"
                fullWidth
                value={formik.values.details?.note}
                name="details.note"
                onChange={formik.handleChange}
                error={formik.touched.details?.note && Boolean(formik.errors.details?.note)}
                helperText={formik.touched.details?.note && formik.errors.details?.note}
              />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid container spacing={2} marginBottom={2}> */}

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
                  documentType={EDocumentTypes.CryoPreservation}
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
              value={formik.values.details?.description}
              name="details.description"
              onChange={formik.handleChange}
              error={
                formik.touched.details?.description && Boolean(formik.errors.details?.description)
              }
              helperText={formik.touched.details?.description && formik.errors.details?.description}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Disclaimer
        </Typography>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              label="Disclaimer"
              name="details.disclaimer"
              value={formik.values.details?.disclaimer}
              multiline
              minRows={2}
              fullWidth
              onChange={formik.handleChange}
              error={
                formik.touched.details?.disclaimer && Boolean(formik.errors.details?.disclaimer)
              }
              helperText={formik.touched.details?.disclaimer && formik.errors.details?.disclaimer}
            />
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
          <Button variant="contained" color="primary" type="submit" sx={{ width: "fit-content" }}>
            Save
          </Button>
          <Button onClick={onModalClose} variant="outlined">
            Close
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Embryo;
