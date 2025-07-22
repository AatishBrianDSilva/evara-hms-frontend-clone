import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import ReportModalHeader from '../../../../../components/ReportModalHeader/ReportModalHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../../../../context/ToastContext';
import { RootState } from '../../../../../app/store';
import {
  useEditProcedureMutation,
  useGetProcedureByIdQuery,
} from '../../../../../services/patientDashboardService/procedureApi';
import {
  IEditProcedureForm,
  IEditProcedurePayload,
} from '../../../../../types/patientDashboard/procedures';
import { ILaparoscopyForm } from '../../../../../types/patientDashboard/investigation';
import { useFormik } from 'formik';
import { EProcedureType } from '../../../../../types/master';
import _ from 'lodash';
import { closeEditProcedure } from '../procedureSlice';
import CustomDatePicker from '../../../../../components/CustomDatePicker/CustomDatePicker';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../../types/global';
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

const Laparoscopy: React.FC = () => {
  const dispatch = useDispatch();
  const { showPromiseToast } = useToast();

  const openEditDialog = useSelector(
    (state: RootState) => state.procedure.editProcedureOpen,
  );

  const {
    data: procedureData,
    isLoading: procedureLoading,
    isFetching: procedureFetching,
  } = useGetProcedureByIdQuery(openEditDialog.id, {
    skip: !openEditDialog || !openEditDialog.id,
  });

  const procedure = procedureData?.data;
  const loading = procedureLoading || procedureFetching;

  // console.log("Laparoscopy fetch", procedure);

  const patient = useSelector((state: RootState) => state.patients.patient);

  // const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(['']);

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
  const doctor =
    procedure?.doctor?.firstName + ' ' + procedure?.doctor?.lastName;
  const procedureName = procedure?.procedure?.procedure?.procedureName;
  const actualProcedureName = procedure?.procedure?.name;

  const [editProcedure, { isLoading: editingProcedure }] =
    useEditProcedureMutation();

  const initialVaules: IEditProcedureForm<ILaparoscopyForm> = {
    status: procedure?.status || '',
    result: {
      dateOfAdmission: procedure?.result?.details?.dateOfAdmission || null,
      dateOfOperation: procedure?.result?.details?.dateOfOperation || null,
      dateOfDischarge: procedure?.result?.details?.dateOfDischarge || null,
      complaintHistory: procedure?.result?.details?.complaintHistory || '',
      indication: procedure?.result?.details?.indication || '',
      operationDetails: procedure?.result?.details?.operationDetails || '',
      findings: procedure?.result?.details?.findings || '',
      impressionSummary: procedure?.result?.details?.impressionSummary || '',
      postOP: procedure?.result?.details?.postOP || '',
      investigationsSent: procedure?.result?.details?.investigationsSent || '',
      reviewDate: procedure?.result?.details?.reviewDate || null,
      description: procedure?.result?.details?.description || '',
    },
    files: [],
    notes: procedure?.result?.notes || '',
  };

  const handleSubmit = async (values: IEditProcedureForm<ILaparoscopyForm>) => {
    console.log('Formik values', values);

    const actualName = actualProcedureName || 'Default Procedure Name'; // Use a fallback if procedureName is null/undefined

    const payload: IEditProcedurePayload = {
      status: values.status,
      result: {
        notes: values.notes,
        files: fileUploadedUrl,
        procedureName: procedureName!,
        details: values.result,
      },
      testType: EProcedureType.Laparoscopy,
      actualName: actualName, // New field added to the payload
    };

    console.log('Payload', payload);

    const promise = editProcedure({
      _id: openEditDialog.id,
      ...payload,
    }).unwrap();

    showPromiseToast(promise, {
      loading: 'Updating procedure...',
      success: () => 'Procedure updated successfully',
      error: () => 'An error occurred while updating procedure',
    });

    try {
      await promise;
    } catch (error) {
      console.error('Failed to update procedure', error);
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
      <ReportModalHeader
        date={date}
        doctor={doctor}
        reportName={procedureName}
      />
      {/* <Grid container spacing={2} direction="column" mt={2}> */}
      <Grid container spacing={2} marginBottom={2} mt={2} flex={1}>
        {/* dateOfAdmission */}
        <Grid item xs={12} md={6} lg={4}>
          <CustomDatePicker
            label="Date Of Admission"
            value={formik.values.result.dateOfAdmission}
            onChange={date =>
              formik.setFieldValue('result.dateOfAdmission', date)
            }
          />
        </Grid>

        {/* Date of Operation */}
        <Grid item xs={12} md={6} lg={4}>
          <CustomDatePicker
            label="Date of Operation"
            value={formik.values.result.dateOfOperation}
            onChange={date =>
              formik.setFieldValue('result.dateOfOperation', date)
            }
          />
        </Grid>

        {/* Date of Discharge */}
        <Grid item xs={12} md={6} lg={4}>
          <CustomDatePicker
            label="Date of Discharge"
            value={formik.values.result.dateOfDischarge}
            onChange={date =>
              formik.setFieldValue('result.dateOfDischarge', date)
            }
          />
        </Grid>

        {/* complaintHistory */}
        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              name="result.complaintHistory"
              label="Complaint / History"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.complaintHistory}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>

        {/* indication */}
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

        {/* Hospital */}
        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              name="result.operationDetails"
              label="Operation Details"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.operationDetails}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>

        {/* impressionSummary */}
        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              name="result.impressionSummary"
              label="Impression Summary"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.impressionSummary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>

        {/* findings */}
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

        {/* investigationsSent */}
        <Grid item xs={12} md={6} lg={4}>
          <TextField
            name="result.investigationsSent"
            label="Investigations Sent"
            fullWidth
            value={formik.values.result.investigationsSent}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Grid>

        {/* Review Date */}
        <Grid item xs={12} md={6} lg={4}>
          <CustomDatePicker
            label="Review Date"
            value={formik.values.result.reviewDate}
            onChange={date => formik.setFieldValue('result.reviewDate', date)}
          />
        </Grid>

        <Grid container pl={2}>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
            Upload Report
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
              <Grid item xs={12}>
                {fileUploadedUrl.length > 0 && (
                  <FileList
                    files={fileUploadedUrl}
                    title="Uploaded Files"
                    bucket={EBuckets.UserReports}
                    documentType={EDocumentTypes.Procedure}
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

        <Grid container pl={2} justifyContent={'center'} alignItems={'center'}>
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={2}
            mb={2}
          >
            <Grid item xs={12} pl={2}>
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
        </Grid>

        {/* Action Buttons */}
        <Grid container spacing={2} direction="column" mt={2}>
          <Box display={'flex'} justifyContent={'center'} gap={2} p={2}>
            <Button
              variant="contained"
              disabled={
                editingProcedure ||
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
        </Grid>
      </Grid>
    </form>
  );
};

export default Laparoscopy;
