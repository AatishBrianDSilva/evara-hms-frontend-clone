import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import {
  useEditInvestigationMutation,
  useGetInvestigationByIdQuery,
} from '../../../../../services/patientDashboardService/investigationApi';
import {
  IEditInvestigationForm,
  IEditInvestigationpayload,
  ISpermDFIForm,
} from '../../../../../types/patientDashboard/investigation';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../../../../context/ToastContext';
import { RootState } from '../../../../../app/store';
import React from 'react';
import { ETestType } from '../../../../../types/master';
import { useFormik } from 'formik';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../../types/global';
import ReportModalHeader from '../../../../../components/ReportModalHeader/ReportModalHeader';
import _ from 'lodash';
import { closeEditInvestigation } from '../investigationSlice';
import FileList from '../../../../../components/FileList/FileList';

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
      <Box></Box>
    </>
  );
};

const SpermDFI: React.FC = () => {
  const dispatch = useDispatch();
  const { showPromiseToast } = useToast();

  const [editInvestigation, { isLoading: editingInvestigation }] =
    useEditInvestigationMutation();
  const openEditDialog = useSelector(
    (state: RootState) => state.investigation.editInvestigationOpen,
  );
  const patient = useSelector((state: RootState) => state.patients.patient);

  const {
    data: investigationData,
    isLoading: investigationLoading,
    isFetching: investigationFetching,
  } = useGetInvestigationByIdQuery(openEditDialog.id, {
    skip: !openEditDialog || !openEditDialog.id,
  });

  const investigation = investigationData?.data;

  const loading = investigationLoading || investigationFetching;

  const date = new Date(investigation?.date || new Date()).toLocaleDateString();
  const doctor =
    investigation?.doctor?.firstName + ' ' + investigation?.doctor?.lastName;
  const investigationName = investigation?.investigation?.test?.testName;
  const actualProcedureName = investigation?.investigation?.name;

  const investigationDetails =
    (investigation?.result?.details as ISpermDFIForm) || {};

  console.log('Investigation', investigation);
  console.log('Investigation Details', investigationDetails);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    let initialUrl: string[] = [];
    if (investigation?.result?.files) {
      initialUrl = investigation.result.files.flat();
    }
    return initialUrl;
  });

  const handleSubmit = async (
    values: IEditInvestigationForm<ISpermDFIForm>,
  ) => {
    const actualName = actualProcedureName || 'Sperm DFI';

    const payload: IEditInvestigationpayload = {
      status: values.status,
      result: {
        notes: values.notes,
        files: fileUploadedUrl,
        testName: investigationName!,
        details: values.result,
      },
      testType: ETestType.SpermDFI,
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
      formik.resetForm();
      dispatch(closeEditInvestigation());
    } catch (error) {
      console.error('Failed to update investigation', error);
    }
  };

  const initialValues: IEditInvestigationForm<ISpermDFIForm> = {
    result: {
      abstinencePeriod: investigationDetails?.abstinencePeriod || '',
      spermEvaluated: investigationDetails?.spermEvaluated || '',
      normalHalo: investigationDetails?.normalHalo || '',
      noAbnormalHalo: investigationDetails?.noAbnormalHalo || '',
      dfiIndex: investigationDetails?.dfiIndex || '',
      imageDescription: investigationDetails?.imageDescription || '',
    },
    status: investigation?.status || 'Scheduled',
    notes: investigation?.result?.notes || '',
    files: [],
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  if (loading) return renderSkeletonLoader();

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ReportModalHeader
          reportName={investigationName}
          doctor={doctor}
          date={date}
        />
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12}>
            <Typography variant="h6">Sperm Evaluation</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Abstinence Period"
              fullWidth
              name="result.abstinencePeriod"
              value={formik.values.result.abstinencePeriod}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.result?.abstinencePeriod)}
              helperText={formik.errors.result?.abstinencePeriod}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="No of Sperms Evaluated"
              fullWidth
              name="result.spermEvaluated"
              value={formik.values.result.spermEvaluated}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.result?.spermEvaluated)}
              helperText={formik.errors.result?.spermEvaluated}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sperms with Normal HALO"
              fullWidth
              name="result.normalHalo"
              value={formik.values.result.normalHalo}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.result?.normalHalo)}
              helperText={formik.errors.result?.normalHalo}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sperms with NO/ABNORMAL HALO"
              fullWidth
              name="result.noAbnormalHalo"
              value={formik.values.result.noAbnormalHalo}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.result?.noAbnormalHalo)}
              helperText={formik.errors.result?.noAbnormalHalo}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="DNA Fragmentation Index (DFI%)"
              fullWidth
              name="result.dfiIndex"
              value={formik.values.result.dfiIndex}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.result?.dfiIndex)}
              helperText={formik.errors.result?.dfiIndex}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography>DFI%</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={4}>
          <Grid item xs={12}>
            <Typography variant="h6">Upload Images & Description</Typography>
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
            {investigation?.result?.files && (
              <FileList
                files={investigation?.result?.files || []}
                title="Uploaded Files"
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.imageDescription}
              name="result.imageDescription"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.imageDescription &&
                Boolean(formik.errors.result?.imageDescription)
              }
              helperText={
                formik.touched.result?.imageDescription &&
                formik.errors.result?.imageDescription
              }
            />
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

        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={2}
          mb={2}
        >
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
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: 'fit-content' }}
            onClick={() => dispatch(closeEditInvestigation())}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </>
  );
};

export default SpermDFI;
