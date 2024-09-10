import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback } from "react";
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
import { IPGTDetailsForm } from "../../../../../types/patientDashboard/procedures";
import { FormikErrors, FormikTouched, useFormik } from "formik";
import { EProcedureType } from "../../../../../types/master";
import _ from "lodash";
import { closeEditProcedure } from "../procedureSlice";
import FileUploadButton from "../../../../../components/FileUploadAndPreview/FileUploadButton";
import CustomDatePicker from "../../../../../components/CustomDatePicker/CustomDatePicker";
import { Add, Delete } from "@mui/icons-material";
import { EBuckets, EDocumentTypes } from "../../../../../types/global";

interface IEmbryoBiopsyDetails {
  id: string;
  pcr_tube_id: string;
  embryo_id: string;
  no_of_cells: number;
  cell_stage: number;
  embryo_grade: "Low" | "High";
  nucleus_seen: "Yes" | "No";
  cell_integrity: "Intact" | "Lysed";
  remarks: string;
  isNew?: boolean;
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

interface PGTProps {
  doctors: IDoctor[];
}

const PGT: React.FC<PGTProps> = () => {
  const dispatch = useDispatch();
  const { showPromiseToast } = useToast();

  const openEditDialog = useSelector((state: RootState) => state.procedure.editProcedureOpen);
  const patient = useSelector((state: RootState) => state.patients.patient);

  // const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>([]);

  const {
    data: procedureData,
    isLoading: procedureLoading,
    isFetching: procedureFetching,
  } = useGetProcedureByIdQuery(openEditDialog.id, {
    skip: !openEditDialog || !openEditDialog.id,
  });

  const procedure = procedureData?.data;
  const loading = procedureLoading || procedureFetching;

  console.log("PGT fetch", procedure);

  const procedureDetails = procedure?.result?.details as IPGTDetailsForm;
  console.log("Procedure details", procedureDetails);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    // Initialize with an empty array by default
    let initialUrl: string[] = [];

    // Check if the file upload URL is present in the investigation details
    if (procedure?.result?.files) {
      initialUrl = procedure.result.files.flat();
    }

    return initialUrl;
  });

  const date = new Date(procedure?.date || new Date()).toLocaleDateString();
  const doctor = procedure?.doctor?.firstName + " " + procedure?.doctor?.lastName;
  const procedureName = procedure?.procedure?.procedure?.procedureName;

  const [editProcedure, { isLoading: editingProcedure }] = useEditProcedureMutation();

  const initialVaules: IEditProcedureForm<IPGTDetailsForm> = {
    status: procedure?.status || "",
    files: [],
    notes: procedure?.result?.notes || "",
    result: {
      karyotype: procedure?.result?.details?.karyotype || "",
      clinicalReasons: procedure?.result?.details?.clinicalReasons || [],
      otherReason: procedure?.result?.details?.otherReason || "",
      noOfBiopsies: procedure?.result?.details?.noOfBiopsies || "",
      biopsyMethod: procedure?.result?.details?.biopsyMethod || "",
      biopsyPerformedBy: procedure?.result?.details?.biopsyPerformedBy || "",
      biopsyDate: procedure?.result?.details?.biopsyDate || null,
      plannedDate: procedure?.result?.details?.plannedDate || null,
      embryosCryopreserved: procedure?.result?.details?.embryosCryopreserved || "",
      resultsForTransfer: procedure?.result?.details?.resultsForTransfer || "",
      results: procedure?.result?.details?.results || "",
      description: procedure?.result?.details?.description || " ",
      day3Blastomere: procedure?.result?.details?.day3Blastomere || false,
      day5Trophectoderm: procedure?.result?.details?.day5Trophectoderm || false,
      embryoBiopsyDetails: procedure?.result?.details?.embryoBiopsyDetails || [
        {
          id: "",
          pcr_tube_id: "",
          embryo_id: "",
          no_of_cells: 0,
          cell_stage: 0,
          embryo_grade: "Low",
          nucleus_seen: "No",
          cell_integrity: "Intact",
          remarks: "",
          isNew: true,
        },
      ],
    },
  };

  const handleSubmit = async (values: IEditProcedureForm<IPGTDetailsForm>) => {
    console.log("Formik values", values);

    const payload: IEditProcedurePayload = {
      status: values.status,
      result: {
        notes: values.notes,
        files: fileUploadedUrl,
        procedureName: procedureName!,
        details: values.result,
      },
      testType: EProcedureType.PGT,
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

  const handleAddFields = () => {
    formik.setFieldValue("result.embryoBiopsyDetails", [
      ...formik.values.result.embryoBiopsyDetails,
      {
        id: "",
        pcr_tube_id: "",
        embryo_id: "",
        no_of_cells: 0,
        cell_stage: 0,
        embryo_grade: "Low",
        nucleus_seen: "No",
        cell_integrity: "Intact",
        remarks: "",
        isNew: true,
      },
    ]);
  };

  const handleDeleteField = (index: number) => {
    const newFields = [...formik.values.result.embryoBiopsyDetails];
    newFields.splice(index, 1);
    formik.setFieldValue("result.embryoBiopsyDetails", newFields);
  };

  const getFieldErrorAndTouched = useCallback(
    (
      index: number,
      fieldName:
        | "id"
        | "pcr_tube_id"
        | "embryo_id"
        | "no_of_cells"
        | "cell_stage"
        | "embryo_grade"
        | "nucleus_seen"
        | "cell_integrity"
        | "remarks"
        | "isNew"
    ) => {
      // Ensure that we're working with the correct structure
      const touched = formik?.touched?.result
        ?.embryoBiopsyDetails as FormikTouched<IEmbryoBiopsyDetails>[];
      const error = formik?.errors?.result
        ?.embryoBiopsyDetails as FormikErrors<IEmbryoBiopsyDetails>[];

      const isFieldTouched = touched?.[index]?.[fieldName];
      const fieldError = error?.[index]?.[fieldName];

      return {
        isError: Boolean(isFieldTouched && fieldError),
        errorMessage: typeof fieldError === "string" ? fieldError : undefined,
      };
    },
    [formik.touched.result?.embryoBiopsyDetails, formik.errors.result?.embryoBiopsyDetails]
  );

  const onModalClose = () => {
    formik.resetForm();
    dispatch(closeEditProcedure());
  };

  if (loading) return renderSkeletonLoader();

  return (
    <form onSubmit={formik.handleSubmit}>
      <ReportModalHeader date={date} doctor={doctor} reportName={procedureName} />
      <Grid container spacing={2} direction="column" mt={2}>
        <Grid item>
          <TextField
            id="result.karyotype"
            label="Karyotype"
            name="result.karyotype"
            sx={{ width: 200 }}
            select
            value={formik.values.result.karyotype}
            onChange={formik.handleChange}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
        </Grid>

        <Grid item container>
          <Typography variant="subtitle1" sx={{ wordWrap: "break-word" }}>
            Clinical Reason(S) for Referral: Please Tick the Appropriate Choice(s)
          </Typography>
        </Grid>

        <Grid item container>
          <Grid item xs={12} sm={6} container spacing={1} direction="column">
            {[
              "Screening for Chromosomal Aneuploidies",
              "Organic Azoospermia",
              "Organic Oligospermia",
              "Sperm Donor",
              "Male Infertility,Unspecified",
              "Spem Aneuploidy",
            ].map((label, index) => (
              <Grid item key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={formik.values.result.clinicalReasons.includes(label)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Add the checked clinical reason to the array
                          formik.setFieldValue("result.clinicalReasons", [
                            ...formik.values.result.clinicalReasons,
                            label,
                          ]);
                        } else {
                          // Remove the unchecked clinical reason from the array
                          formik.setFieldValue(
                            "result.clinicalReasons",
                            formik.values.result.clinicalReasons.filter(
                              (reason) => reason !== label
                            )
                          );
                        }
                      }}
                    />
                  }
                  label={label}
                  sx={{ color: "grey.600" }}
                />
              </Grid>
            ))}
          </Grid>

          <Grid item xs={12} sm={6} container spacing={1} direction="column">
            {[
              "Elevated Maternal Age(>35 Years)",
              "Primary Ovarian Failure",
              "Poor Obstetric/Reproductive History,First Trimester",
              "Egg (Oocyte Donor)",
              "Female Infertility,Unspecified",
              "Other",
            ].map((label, index) => (
              <Grid item key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={formik.values.result.clinicalReasons.includes(label)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Add the checked clinical reason to the array
                          formik.setFieldValue("result.clinicalReasons", [
                            ...formik.values.result.clinicalReasons,
                            label,
                          ]);
                        } else {
                          // Remove the unchecked clinical reason from the array
                          formik.setFieldValue(
                            "result.clinicalReasons",
                            formik.values.result.clinicalReasons.filter(
                              (reason) => reason !== label
                            )
                          );
                        }
                      }}
                    />
                  }
                  label={label}
                  sx={{ color: "grey.600" }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            maxRows={2}
            name="result.otherReason"
            minRows={2}
            label="If Others(Then Please Specify)"
            value={formik.values.result.otherReason}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item>
          <Typography variant="h6">Biopsy Information</Typography>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item xs={12} md={4} container spacing={2} direction="column">
            <Grid item>
              <TextField
                id="no-of-biopsies"
                name="result.noOfBiopsies"
                label="No of Biopsies"
                fullWidth
                value={formik.values.result.noOfBiopsies}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                id="biopsy-method"
                label="Biopsy Method"
                name="result.biopsyMethod"
                fullWidth
                select
                value={formik.values.result.biopsyMethod}
                onChange={formik.handleChange}
              >
                <MenuItem value="laser">Laser</MenuItem>
                <MenuItem value="acid">Acid Tyrodes</MenuItem>
                <MenuItem value="mechanical">Mechanical</MenuItem>
              </TextField>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">Day of Biopsy:</Typography>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.result.day3Blastomere}
                    onChange={(e) =>
                      formik.setFieldValue("result.day3Blastomere", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label="Day 3-Blastomere"
              />
            </Grid>

            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.result.day5Trophectoderm}
                    onChange={(e) =>
                      formik.setFieldValue("result.day5Trophectoderm", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label="Day 5-Trophectoderm"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} marginBottom={2} pt={3} pl={2}>
            <Grid item xs={8} sm={4} md={3}>
              <TextField
                id="biopsyPerformedBy"
                label="Biopsy Performed By"
                name="result.biopsyPerformedBy"
                fullWidth
                value={formik.values.result.biopsyPerformedBy}
                onChange={formik.handleChange}
              ></TextField>
            </Grid>
            <Grid item xs={8} sm={4} md={3}>
              <CustomDatePicker
                label="Biopsy Date"
                name="result.biopsyDate"
                value={formik.values.result.biopsyDate}
                onChange={(date) => formik.setFieldValue("result.biopsyDate", date)}
              />
            </Grid>
            <Grid item xs={8} sm={4} md={3}>
              <CustomDatePicker
                label="Planned Date of Embryo Transfer"
                name="result.plannedDate"
                value={formik.values.result.plannedDate}
                onChange={() => formik.setFieldValue("result.plannedDate", date)}
              />
            </Grid>
            <Grid item xs={8} sm={4} md={3}>
              <TextField
                id="embryos-cryopreserved"
                label="All Embryos will be cryopreserved for future use(Y/N)"
                fullWidth
                name="result.embryosCryopreserved"
                select
                value={formik.values.result.embryosCryopreserved}
                onChange={formik.handleChange}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={8} sm={4} md={3}>
              <TextField
                id="results-for-transfer"
                label="Results Needed for Fresh Embryo Transfer (Y/N)"
                fullWidth
                name="result.resultsForTransfer"
                select
                value={formik.values.result.resultsForTransfer}
                onChange={formik.handleChange}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container pl={2}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                fullWidth
                multiline
                maxRows={2}
                name="result.results"
                minRows={2}
                label="Result"
                value={formik.values.result.results}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Typography variant="subtitle1" mt={3} sx={{ textDecorationLine: "underline", pt: "3" }}>
            To Be Filled By Embryologist
          </Typography>
        </Grid>

        <Grid item container>
          <Box pb={2}>
            <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
              Embryo Biopsy Details
            </Typography>
            {formik.values.result.embryoBiopsyDetails.map((item, index) => {
              const isLastItem = index === formik.values.result.embryoBiopsyDetails?.length - 1;
              const onlyOneItem = formik.values.result.embryoBiopsyDetails?.length === 1;

              const { isError: isIdError, errorMessage: idErrorMessage } = getFieldErrorAndTouched(
                index,
                "id"
              );
              const { isError: isTubeIdError, errorMessage: tubeIdErrorMessage } =
                getFieldErrorAndTouched(index, "pcr_tube_id");
              const { isError: isEmbryoIdError, errorMessage: embryoIdErrorMessage } =
                getFieldErrorAndTouched(index, "embryo_id");
              const { isError: isNoOfCellsError, errorMessage: noOfCellsErrorMessage } =
                getFieldErrorAndTouched(index, "no_of_cells");
              const { isError: isCellStageError, errorMessage: cellStageErrorMessage } =
                getFieldErrorAndTouched(index, "cell_stage");
              const { isError: isEmbryoGradeError, errorMessage: embryoGradeErrorMessage } =
                getFieldErrorAndTouched(index, "embryo_grade");
              const { isError: isNucleusSeenError, errorMessage: nucleusSeenErrorMessage } =
                getFieldErrorAndTouched(index, "nucleus_seen");
              const { isError: isCellIntegrityError, errorMessage: cellIntegrityErrorMessage } =
                getFieldErrorAndTouched(index, "cell_integrity");
              const { isError: isRemarksError, errorMessage: remarksErrorMessage } =
                getFieldErrorAndTouched(index, "remarks");
              // Add similar error handling for other fields

              return (
                <Grid container gap={2} mt={3} key={index}>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="ID"
                      name={`result.embryoBiopsyDetails[${index}].id`}
                      value={item.id || ""}
                      onChange={formik.handleChange}
                      error={isIdError}
                      helperText={isIdError && idErrorMessage}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="PCR Tube ID"
                      name={`result.embryoBiopsyDetails[${index}].pcr_tube_id`}
                      value={item.pcr_tube_id || ""}
                      onChange={formik.handleChange}
                      error={isTubeIdError}
                      helperText={isTubeIdError && tubeIdErrorMessage}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="Embryo ID"
                      name={`result.embryoBiopsyDetails[${index}].embryo_id`}
                      value={item.embryo_id || ""}
                      onChange={formik.handleChange}
                      error={isEmbryoIdError}
                      helperText={isEmbryoIdError && embryoIdErrorMessage}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="No. of Cells"
                      name={`result.embryoBiopsyDetails[${index}].no_of_cells`}
                      value={item.no_of_cells || ""}
                      onChange={formik.handleChange}
                      error={isNoOfCellsError}
                      helperText={isNoOfCellsError && noOfCellsErrorMessage}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="Cell Stage"
                      name={`result.embryoBiopsyDetails[${index}].cell_stage`}
                      value={item.cell_stage || ""}
                      onChange={formik.handleChange}
                      error={isCellStageError}
                      helperText={isCellStageError && cellStageErrorMessage}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="Embryo Grade"
                      name={`result.embryoBiopsyDetails[${index}].embryo_grade`}
                      value={item.embryo_grade || ""}
                      onChange={formik.handleChange}
                      error={isEmbryoGradeError}
                      helperText={isEmbryoGradeError && embryoGradeErrorMessage}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="Nucleus Seen"
                      name={`result.embryoBiopsyDetails[${index}].nucleus_seen`}
                      value={item.nucleus_seen || ""}
                      onChange={formik.handleChange}
                      error={isNucleusSeenError}
                      helperText={isNucleusSeenError && nucleusSeenErrorMessage}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="Cell Integrity"
                      name={`result.embryoBiopsyDetails[${index}].cell_integrity`}
                      value={item.cell_integrity || ""}
                      onChange={formik.handleChange}
                      error={isCellIntegrityError}
                      helperText={isCellIntegrityError && cellIntegrityErrorMessage}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="Remarks"
                      name={`result.embryoBiopsyDetails[${index}].remarks`}
                      value={item.remarks || ""}
                      onChange={formik.handleChange}
                      error={isRemarksError}
                      helperText={isRemarksError && remarksErrorMessage}
                    />
                  </Grid>
                  {/* Dynamic Add/Delete Buttons */}
                  <Grid
                    item
                    flex={1}
                    display={"flex"}
                    justifyContent={"flex-start"}
                    alignItems={"flex-start"}
                  >
                    {!onlyOneItem && (
                      <IconButton size="small" onClick={() => handleDeleteField(index)}>
                        <Delete fontSize={"small"} />
                      </IconButton>
                    )}
                    {isLastItem && (
                      <IconButton size="small" color="primary" onClick={handleAddFields}>
                        <Add fontSize={"small"} />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              );
            })}
          </Box>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, pl: 2 }}>
          Upload Images & Description
        </Typography>
        <Grid container spacing={2} marginBottom={2} pl={2}>
          <Grid item xs={12}>
            {/* Upload image button */}
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
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              label="Description"
              multiline
              minRows={2}
              fullWidth
              name="result.description"
              value={formik.values.result.description}
              onChange={formik.handleChange}
            />
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

        <Box display={"flex"} justifyContent={"center"} gap={2} p={2}>
          <Button
            variant="contained"
            disabled={editingProcedure || _.isEqual(formik.values, initialVaules || !formik.dirty)}
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
    </form>
  );
};

export default PGT;
