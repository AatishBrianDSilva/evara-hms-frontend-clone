import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { useToast } from '../../../../../context/ToastContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import {
  useEditInvestigationMutation,
  useGetInvestigationByIdQuery,
} from '../../../../../services/patientDashboardService/investigationApi';
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
import _ from 'lodash';
import FileList from '../../../../../components/FileList/FileList';

const renderSkeletonLoader = () => (
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

const BloodTests: React.FC = () => {
  const dispatch = useDispatch();
  const { showPromiseToast } = useToast();

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

  console.log('Investigation Data', investigationData);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    // Initialize with existing files if available
    return investigation?.result?.files || [];
  });

  const loading = investigationLoading || investigationFetching;

  const date = new Date(investigation?.date || new Date()).toLocaleDateString();
  const doctor =
    investigation?.doctor?.firstName + ' ' + investigation?.doctor?.lastName;
  const investigationName = investigation?.investigation?.test?.testName;
  const components = investigation?.investigation?.test?.components;
  const actualProcedureName = investigation?.investigation?.name;

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

    const filteredDetails = details.filter(detail => detail.value == '');
    const actualName = actualProcedureName || 'Default Investigation';

    const payload: IEditInvestigationpayload = {
      status: values.status,
      testType: ETestType.BloodTest,
      result: {
        files: fileUploadedUrl,
        testName: investigationName!,
        details: filteredDetails.length === 0 ? details : undefined,
        notes: values.notes || undefined,
      },
      actualName: actualName,
    };

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
    } catch (error) {
      console.error('Failed to update investigation', error);
    }
  };

  const initialValues: IEditInvestigationForm<any[]> = {
    status: investigation?.status || 'Scheduled',
    result:
      Array.isArray(investigation?.result?.details) &&
      investigation.result.details.length > 0
        ? (investigation.result.details as any[]).map((detail: any) => ({
            _id: detail._id,
            componentName: detail.component,
            referenceRange: detail.refernceRange || '',
            componentType: 'text',
            options: [],
            value: detail.value || '',
            unit: detail.unit || '',
          }))
        : Array.isArray(components)
          ? (components as any[]).map((component: any) => ({
              _id: component._id,
              componentName: component?.componentName,
              referenceRange: component?.referenceRange || '',
              componentType: component?.componentType || 'text',
              options: component?.options || [],
              value: '',
              unit: component?.unit || '',
            }))
          : [],
    notes: investigation?.result?.notes || '',
    files: investigation?.result?.files || [],
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: getEditBloodTestReportValidationSchema(false),
    enableReinitialize: true,
  });

  const onModalClose = () => {
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
              <Box mt={2}>
                <Grid mt={1} container gap={2}>
                  {formik.values.result.map((detail, index) => {
                    const fieldName = `result[${index}].value`;

                    // Suppress TypeScript errors by casting touched and errors as any
                    const touchedResult = formik.touched.result as any;
                    const errorsResult = formik.errors.result as any;

                    const isError = Boolean(
                      touchedResult[index]?.value && errorsResult[index]?.value,
                    );

                    const helperText = isError
                      ? errorsResult[index]?.value
                      : '';

                    if (detail.componentType === 'text') {
                      return (
                        <Grid item lg={3} key={index}>
                          <TextField
                            name={fieldName}
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
                            name={fieldName}
                            label={detail.componentName}
                            value={detail.value}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={isError}
                            helperText={helperText}
                            variant="outlined"
                            fullWidth
                          >
                            {detail?.options?.map(
                              (option: string, index: number) => (
                                <MenuItem key={index} value={option}>
                                  {option}
                                </MenuItem>
                              ),
                            )}
                          </TextField>
                        </Grid>
                      );
                    }
                  })}
                </Grid>
                <Box display={'flex'} mt={2} gap={2}>
                  <TextField
                    name="notes"
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Notes"
                    variant="outlined"
                    multiline
                    fullWidth
                    error={Boolean(formik.touched.notes && formik.errors.notes)}
                    helperText={formik.touched.notes && formik.errors.notes}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12}>
              <Typography variant="h6">Upload Images</Typography>
            </Grid>
            <Grid item xs={12}>
              {patient && (
                <FileUploadButton
                  showSubmitHint={true}
                  acceptTypes="image/*"
                  maxFiles={5}
                  maxFileSizeinMB={15}
                  onUploadFiles={files => {
                    const existingFiles = investigation?.result?.files || [];
                    const updatedFiles = [...existingFiles, ...files];
                    const uniqueFiles = [...new Set(updatedFiles)];
                    setFileUploadedUrl(uniqueFiles);
                  }}
                  bucket={EBuckets.UserReports}
                  documentType={EDocumentTypes.Investigation}
                  user={patient?._id}
                  reportId={openEditDialog.id}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {fileUploadedUrl.length > 0 && (
                <FileList files={fileUploadedUrl} title="Uploaded Files" />
              )}
            </Grid>
          </Grid>

          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={2}
            mb={2}
          >
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.status === 'Completed'}
                    onChange={e =>
                      formik.setFieldValue(
                        'status',
                        e.target.checked ? 'Completed' : 'Scheduled',
                      )
                    }
                    color="primary"
                  />
                }
                label="Status: Completed"
              />
            </Grid>
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
