import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Skeleton,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useToast } from '../../../../../context/ToastContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import {
  useEditInvestigationMutation,
  useGetInvestigationByIdQuery,
} from '../../../../../services/patientDashboardService/investigationApi';
import Cancel from '@mui/icons-material/Cancel';
import Add from '@mui/icons-material/Add';
import _ from 'lodash';
import { closeEditInvestigation } from '../investigationSlice';
import ReportModalHeader from '../../../../../components/ReportModalHeader/ReportModalHeader';
import {
  IEditInvestigationForm,
  IEditInvestigationpayload,
} from '../../../../../types/patientDashboard/investigation';
import { ETestType, IBloodTestComponent } from '../../../../../types/master';
import { getEditBloodTestReportValidationSchema } from '../../../../../yup/patientDashboard/investigation';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../../types/global';

const renderSkeletonLoader = () => {
  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        borderBottom={1}
        py={2}
      >
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
          <Grid container justifyContent={'space-between'}>
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
    </>
  );
};

const BloodTests: React.FC = () => {
  const dispatch = useDispatch();
  const { showPromiseToast } = useToast();

  // const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>([""]);

  const openEditDialog = useSelector(
    (state: RootState) => state.investigation.editInvestigationOpen,
  );

  const {
    data: investigationData,
    isLoading: investigationLoading,
    isFetching: investigationFetching,
  } = useGetInvestigationByIdQuery(openEditDialog.id, {
    skip: !openEditDialog || !openEditDialog.id,
  });

  const investigation = investigationData?.data;

  // const files = investigation?.result?.files || [];

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    // Initialize with an empty array by default
    let initialUrl: string[] = [];

    // Check if the file upload URL is present in the investigation details
    if (investigation?.result?.files) {
      initialUrl = investigation.result.files.flat();
    }

    return initialUrl;
  });

  const loading = investigationLoading || investigationFetching;

  const date = new Date(investigation?.date || new Date()).toLocaleDateString();
  const doctor =
    investigation?.doctor?.firstName + ' ' + investigation?.doctor?.lastName;
  const investigationName = investigation?.investigation?.test?.testName;
  const components = investigation?.investigation?.test?.components;
  const actualProcedureName = investigation?.investigation?.name;

  const [showReport, setShowReport] = useState(false);
  const [addReport, setAddReport] = useState(false);

  let validationSchema = getEditBloodTestReportValidationSchema(addReport);

  const patient = useSelector((state: RootState) => state.patients.patient);

  const [editInvestigation, { isLoading: editingInvestigation }] =
    useEditInvestigationMutation();

  const handleSubmit = async (
    values: IEditInvestigationForm<IBloodTestComponent[]>,
  ) => {
    const details = values.result.map(detail => ({
      component: detail.componentName,
      value: detail.value,
      unit: detail.unit,
      refernceRange: components?.find(component => component._id === detail._id)
        ?.referenceRange,
    }));

    //if value is empty remove all the details
    const filteredDetails = details.filter(detail => detail.value == '');
    const actualName = actualProcedureName || 'Default Investigation'; // Use a fallback if procedureName is null/undefined

    // const payload: IEditInvestigationpayload = {
    //   status: values.status,
    //   testType: ETestType.BloodTest,
    //   result: {
    //     files: fileUploadedUrl,
    //   },
    // };

    // if (filteredDetails.length == 0) {
    //   payload["result"] = {
    //     testName: investigationName!,
    //     details: details,
    //     notes: values.notes,
    //     files: fileUploadedUrl,
    //   };
    // }

    // const payload: IEditInvestigationpayload = {
    //   status: values.status,
    //   testType: ETestType.BloodTest,
    //   result: {
    //     files: fileUploadedUrl,
    //     ...(filteredDetails.length === 0 && {
    //       testName: investigationName!,
    //       details: details,
    //       notes: values.notes,
    //     }),
    //   },
    // };

    const payload: IEditInvestigationpayload = {
      status: values.status,
      testType: ETestType.BloodTest,
      result: {
        files: fileUploadedUrl,
        testName: investigationName!, // Always include the testName
        details: filteredDetails.length === 0 ? details : undefined, // Conditionally include details
        notes: values.notes || undefined,
      },
      actualName: actualName, // New field added to the payload
    };

    console.log('Payload', payload);

    const promise = editInvestigation({
      _id: openEditDialog.id,
      ...payload,
    }).unwrap();

    showPromiseToast(promise, {
      loading: 'Updating investigation...',
      success: () => 'Investigation updated successfully',
      error: () => 'An error occurred while updating investigation',
    });

    try {
      await promise;
      setAddReport(false);
    } catch (error) {
      console.error('Failed to update investigation', error);
    }
  };

  interface ReportDetailError {
    id?: string;
    name?: string;
    value?: string; // This assumes your validation might set an error on the value field
    unit?: string;
    referenceRange?: string;
    group?: string;
    componentType?: string;
  }

  // Initial values setup
  const initialValues: IEditInvestigationForm<IBloodTestComponent[]> = {
    status: investigation?.status || 'Scheduled',
    result:
      components?.map(component => ({
        _id: component._id,
        componentName: component?.componentName,
        referenceRange: component?.referenceRange || '',
        componentType: component?.componentType,
        options: component?.options || [],
        value: '',
        unit: component?.unit || '',
      })) || [],
    notes: '',
    files: [],
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
  });

  // const handleFileSelection = (selectedFiles: File[]) => {
  //   if (formik.values.files) {
  //     const allFiles = [...formik.values?.files, ...selectedFiles];
  //     formik.setFieldValue('files', allFiles);
  //   }
  // };

  // const handleRemoveFile = (fileToRemove: File) => {
  //   const updatedFiles = formik.values.files.filter(localFile => localFile !== fileToRemove);
  //   formik.setFieldValue('files', updatedFiles);
  // };

  const handleAddReportButton = () => {
    setAddReport(!addReport);
    formik.resetForm();
  };

  const onModalClose = () => {
    setAddReport(false);
    formik.resetForm();
    dispatch(closeEditInvestigation());
  };

  return (
    <>
      {loading ? (
        renderSkeletonLoader()
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <ReportModalHeader
            date={date}
            doctor={doctor}
            reportName={investigationName}
          />
          <Box display={'flex'} flexDirection={'column'} pt={2} mt={2} flex={1}>
            <Box>
              <Grid container justifyContent={'space-between'}>
                <Grid item md={6} lg={3}>
                  <TextField
                    select
                    name="status"
                    value={formik?.values?.status}
                    onChange={formik.handleChange}
                    label="Status"
                    variant="outlined"
                    onBlur={formik.handleBlur} // Add this to track field has been touched
                    error={
                      formik.touched.status && Boolean(formik.errors.status)
                    }
                    helperText={formik.touched.status && formik.errors.status} // Display validation message
                    fullWidth
                  >
                    <MenuItem value="Scheduled">Scheduled</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </TextField>
                </Grid>
                <Grid item>
                  {investigation?.result ? (
                    <FormControlLabel
                      control={
                        <Switch
                          onClick={() => setShowReport(!showReport)}
                          color="secondary"
                        />
                      }
                      label="Show Reports"
                    />
                  ) : (
                    <Button
                      startIcon={addReport ? <Cancel /> : <Add />}
                      variant="text"
                      color="secondary"
                      onClick={handleAddReportButton}
                    >
                      {' '}
                      Report
                    </Button>
                  )}
                </Grid>
              </Grid>

              {showReport && (
                <Box mt={2}>
                  <Typography variant="button" color={'primary'} gutterBottom>
                    Report
                  </Typography>
                  <Grid mt={1} container gap={2}>
                    {_.isArray(investigation?.result?.details) &&
                      investigation?.result?.details?.map((detail, index) => (
                        <Grid item lg={3} key={index}>
                          <TextField
                            name={`result[${index}].value`}
                            label={detail.component}
                            value={detail.value}
                            disabled={true}
                            helperText={detail.referenceRange}
                            InputProps={{
                              endAdornment: detail.unit ? (
                                <InputAdornment position="end">
                                  <Typography fontSize={13}>
                                    {detail.unit}
                                  </Typography>
                                </InputAdornment>
                              ) : null,
                            }}
                            variant="outlined"
                            fullWidth
                          />
                        </Grid>
                      ))}
                  </Grid>

                  <Box display={'flex'} mt={2} gap={2}>
                    <TextField
                      name={`notes`}
                      disabled={true}
                      value={investigation?.result?.notes || ''}
                      label={`Notes`}
                      variant="outlined"
                      multiline
                      fullWidth
                    />
                  </Box>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
                    Upload Report
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
                        documentType={EDocumentTypes.Investigation}
                        user={patient?._id}
                        reportId={openEditDialog.id}
                      />
                    )}
                  </Grid>
                </Box>
              )}

              {addReport && (
                <Box mt={2}>
                  <Typography variant="button" color={'primary'} gutterBottom>
                    Report
                  </Typography>
                  <Grid mt={1} container gap={2}>
                    {formik.values.result.map((detail, index) => {
                      const fieldName = `result[${index}].value`;
                      const isError = Boolean(
                        formik.touched.result?.[index]?.value &&
                          formik.errors.result &&
                          Array.isArray(formik.errors.result) &&
                          (formik.errors.result[index] as ReportDetailError)
                            ?.value,
                      );
                      const helperText = isError
                        ? (formik.errors.result?.[index] as ReportDetailError)
                            ?.value
                        : ''; // Type assertion here

                      if (detail.componentType === 'text') {
                        return (
                          <Grid item lg={3} key={index}>
                            <TextField
                              name={fieldName} // Use corrected field name
                              label={detail.componentName}
                              value={detail.value}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={isError}
                              helperText={helperText}
                              InputProps={{
                                endAdornment: detail.unit ? (
                                  <InputAdornment position="end">
                                    <Typography fontSize={13}>
                                      {detail.unit}
                                    </Typography>
                                  </InputAdornment>
                                ) : null,
                              }}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>
                        );
                      } else if (detail.componentType === 'select') {
                        return (
                          <Grid item lg={3} key={index}>
                            <TextField
                              select
                              name={fieldName} // Use corrected field name
                              label={detail.componentName}
                              value={detail.value}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={isError}
                              helperText={helperText}
                              InputProps={{
                                endAdornment: detail.unit ? (
                                  <InputAdornment position="end">
                                    <Typography fontSize={13}>
                                      {detail.unit}
                                    </Typography>
                                  </InputAdornment>
                                ) : null,
                              }}
                              variant="outlined"
                              fullWidth
                            >
                              {detail?.options?.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                        );
                      }
                    })}
                  </Grid>

                  <Box display={'flex'} mt={2} gap={2}>
                    <Grid container spacing={2} marginBottom={2}>
                      <Grid item xs={12}>
                        <TextField
                          name="notes"
                          value={formik.values.notes}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          label="Notes"
                          variant="outlined"
                          multiline
                          fullWidth
                          error={Boolean(
                            formik.touched.notes && formik.errors.notes,
                          )}
                          helperText={
                            formik.touched.notes && formik.errors.notes
                              ? formik.errors.notes
                              : ''
                          }
                        />
                      </Grid>
                      <Typography
                        variant="subtitle1"
                        sx={{ mt: 2, mb: 2, pl: 2 }}
                      >
                        Upload Images
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
                            documentType={EDocumentTypes.Investigation}
                            user={patient?._id}
                            reportId={openEditDialog.id}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          <Box display={'flex'} justifyContent={'center'} gap={2} p={2}>
            <Button
              variant="contained"
              disabled={
                editingInvestigation ||
                (_.isEqual(formik.values, formik.initialValues) &&
                  fileUploadedUrl.length === 0)
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
        </form>
      )}
    </>
  );
};

export default BloodTests;
