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
import { IDoctor } from '../../../../../types/doctor';
import {
  IEditProcedureForm,
  IEditProcedurePayload,
} from '../../../../../types/patientDashboard/procedures';
import { ITesaForm } from '../../../../../types/patientDashboard/procedures';
import { useFormik } from 'formik';
import { EProcedureType } from '../../../../../types/master';
import _ from 'lodash';
import { closeEditProcedure } from '../procedureSlice';
import FieldAutocomplete from '../../../../../components/FieldAutoComplete/FieldAutoComplete';
import CustomDatePicker from '../../../../../components/CustomDatePicker/CustomDatePicker';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../../types/global';
import { DoctorSpeciality } from '../../../../../types/masterDashboard/global';

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

interface TesaProps {
  doctors: IDoctor[];
}

const Tesa: React.FC<TesaProps> = ({ doctors }) => {
  const dispatch = useDispatch();
  const { showPromiseToast } = useToast();

  const openEditDialog = useSelector(
    (state: RootState) => state.procedure.editProcedureOpen,
  );
  const patient = useSelector((state: RootState) => state.patients.patient);

  const {
    data: procedureData,
    isLoading: procedureLoading,
    isFetching: procedureFetching,
  } = useGetProcedureByIdQuery(openEditDialog.id, {
    skip: !openEditDialog || !openEditDialog.id,
  });

  const procedure = procedureData?.data;
  const loading = procedureLoading || procedureFetching;

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(['']);

  const date = new Date(procedure?.date || new Date()).toLocaleDateString();
  const doctor =
    procedure?.doctor?.firstName + ' ' + procedure?.doctor?.lastName;
  const procedureName = procedure?.procedure?.procedure?.procedureName;
  const actualProcedureName = procedure?.procedure?.name;

  console.log('Procedure at Tesa', procedure);

  const [editProcedure, { isLoading: editingProcedure }] =
    useEditProcedureMutation();

  const initialVaules: IEditProcedureForm<ITesaForm> = {
    status: procedure?.status || 'Scheduled',
    files: [],
    notes: procedure?.result?.notes || '',
    result: {
      dateOfAdmission: procedure?.result?.details?.dateOfAdmission || '',
      dateOfOperation: procedure?.result?.details?.dateOfOperation || '',
      dateOfDischarge: procedure?.result?.details?.dateOfDischarge || '',
      indication: procedure?.result?.details?.indication || '',
      operationDetails: procedure?.result?.details?.operationDetails || '',
      complaintHistory: procedure?.result?.details?.complaintHistory || '',
      surgeon: procedure?.result?.details?.surgeon || null,
      anaesthetist: procedure?.result?.details?.anaesthetist || null,
      typeOfAnaesthesia: procedure?.result?.details?.typeOfAnaesthesia || '',
      procedureDetails: procedure?.result?.details?.procedureDetails || '',
      findings: procedure?.result?.details?.findings || '',
      summary: procedure?.result?.details?.summary || '',
      investigationsSent: procedure?.result?.details?.investigationsSent || '',
      postOperativeInstructions:
        procedure?.result?.details?.postOperativeInstructions || '',
      embryologist: procedure?.result?.details?.embryologist || null,
      remarks: procedure?.result?.details?.remarks || '',
      description: procedure?.result?.details?.description || '',
    },
  };

  const handleSubmit = async (values: IEditProcedureForm<ITesaForm>) => {
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
      testType: EProcedureType.TESA,
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
      <Box display={'flex'} flexDirection={'column'} mt={2} flex={1}>
        {/* {JSON.stringify(formik.initialValues, null, 2)} */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6} lg={4}>
            <CustomDatePicker
              name="result.dateOfAdmission"
              value={formik?.values.result.dateOfAdmission}
              label="Date Of Admission"
              onChange={date =>
                formik.setFieldValue('result.dateOfAdmission', date)
              }
              error={
                formik.touched.result?.dateOfAdmission &&
                Boolean(formik.errors.result?.dateOfAdmission)
              }
              helperText={
                formik.touched.result?.dateOfAdmission &&
                formik.errors.result?.dateOfAdmission
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <CustomDatePicker
              name="result.dateOfOperation"
              value={formik?.values.result.dateOfOperation}
              label="Date Of Operation"
              onChange={date =>
                formik.setFieldValue('result.dateOfOperation', date)
              }
              error={
                formik.touched.result?.dateOfOperation &&
                Boolean(formik.errors.result?.dateOfOperation)
              }
              helperText={
                formik.touched.result?.dateOfOperation &&
                formik.errors.result?.dateOfOperation
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <CustomDatePicker
              name="result.dateOfDischarge"
              value={formik?.values.result.dateOfDischarge}
              onChange={date =>
                formik.setFieldValue('result.dateOfDischarge', date)
              }
              label="Date Of Discharge"
              error={
                formik.touched.result?.dateOfDischarge &&
                Boolean(formik.errors.result?.dateOfDischarge)
              }
              helperText={
                formik.touched.result?.dateOfDischarge &&
                formik.errors.result?.dateOfDischarge
              }
            />
          </Grid>
          <Grid container pl={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                name="result.indication"
                value={formik?.values.result.indication}
                multiline
                minRows={2}
                label="Indication"
                fullWidth
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          <Grid container pl={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                name="result.operationDetails"
                value={formik.values.result.operationDetails}
                onChange={formik.handleChange}
                multiline
                minRows={2}
                fullWidth
                label="Operation Details"
              />
            </Grid>
          </Grid>

          <Grid container pl={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                name="result.complaintHistory"
                value={formik.values.result.complaintHistory}
                onChange={formik.handleChange}
                multiline
                minRows={2}
                fullWidth
                label="Complaint/History"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6} lg={4}>
            <FieldAutocomplete
              options={doctors}
              getOptionLabel={option =>
                `${option.firstName} ${option.lastName}`
              }
              isOptionEqualToValue={(option, value) => {
                return option._id === value._id;
              }}
              value={formik.values.result.surgeon}
              onChange={newValue =>
                formik.setFieldValue('result.surgeon', newValue)
              }
              label="Surgeon"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <FieldAutocomplete
              options={doctors}
              getOptionLabel={option =>
                `${option.firstName} ${option.lastName}`
              }
              isOptionEqualToValue={(option, value) => {
                return option._id === value._id;
              }}
              filterOptions={(options, _state) => {
                return options.filter(
                  option => option.speciality === DoctorSpeciality.Embryologist,
                );
              }}
              value={formik.values.result.embryologist}
              onChange={newValue =>
                formik.setFieldValue('result.embryologist', newValue)
              }
              label="Embryologist"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <FieldAutocomplete
              options={doctors}
              getOptionLabel={option =>
                `${option.firstName || ''} ${option.lastName || ''}`
              }
              filterOptions={(options, _state) => {
                return options.filter(
                  option => option.speciality === DoctorSpeciality.Anaesthetist,
                );
              }}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={formik.values.result.anaesthetist}
              onChange={newValue =>
                formik.setFieldValue(`details.anaesthetist`, newValue)
              }
              label="Anaesthetist"
              error={
                formik.touched.result?.anaesthetist &&
                Boolean(formik.errors.result?.anaesthetist)
              }
              helperText={
                formik.touched.result?.anaesthetist &&
                formik.errors.result?.anaesthetist
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Type Of Anaesthesia"
              name="result.typeOfAnaesthesia"
              value={formik.values.result.typeOfAnaesthesia}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid container pl={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Procedure"
                multiline
                minRows={2}
                name="result.procedureDetails"
                value={formik.values.result.procedureDetails}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          <Grid container pl={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Findings"
                name="result.findings"
                multiline
                minRows={2}
                value={formik.values.result.findings}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          <Grid container pl={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                multiline
                minRows={2}
                fullWidth
                label="Summary"
                name="result.summary"
                value={formik.values.result.summary}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          <Grid container pl={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                multiline
                minRows={2}
                fullWidth
                label="Investigations Sent"
                name="result.investigationsSent"
                value={formik.values.result.investigationsSent}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          <Grid container pl={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                multiline
                minRows={2}
                fullWidth
                label="Post Operative Instructions"
                name="result.postOperativeInstructions"
                value={formik.values.result.postOperativeInstructions}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <TextField
              multiline
              minRows={2}
              fullWidth
              label="Remarks"
              name="result.remarks"
              value={formik.values.result.remarks}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Upload Images & Description
        </Typography>
        <Grid container spacing={2} marginBottom={2}>
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
      </Box>
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
    </form>
  );
};

export default Tesa;
