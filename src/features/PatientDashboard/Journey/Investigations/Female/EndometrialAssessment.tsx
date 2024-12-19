import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../../../../context/ToastContext';
import { RootState } from '../../../../../app/store';
import {
  useEditInvestigationMutation,
  useGetInvestigationByIdQuery,
} from '../../../../../services/patientDashboardService/investigationApi';
import { useGetDoctorsQuery } from '../../../../../services/doctorsApi';
import {
  IEditInvestigationForm,
  IEditInvestigationpayload,
  IEndometrialAssessmentForm,
} from '../../../../../types/patientDashboard/investigation';
import { ETestType } from '../../../../../types/master';
import { FormikErrors, FormikProvider, FormikTouched, useFormik } from 'formik';
import { closeEditInvestigation } from '../investigationSlice';
import ReportModalHeader from '../../../../../components/ReportModalHeader/ReportModalHeader';
import _ from 'lodash';
import FieldAutocomplete from '../../../../../components/FieldAutoComplete/FieldAutoComplete';
import CustomDatePicker from '../../../../../components/CustomDatePicker/CustomDatePicker';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../../types/global';
import { Add, Delete } from '@mui/icons-material';

interface IEndometrialItems {
  date: Date | null;
  day: number | string;
  endometrialThickness: number | string;
  medication: string[];
  remarks: string;
}

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

const EndometrialAssessment: React.FC = () => {
  const dispatch = useDispatch();
  const { showPromiseToast } = useToast();

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

  // Get doctors
  const {
    data: DoctorsData,
    isLoading: DoctorsLoading,
    isFetching: DoctorFetching,
  } = useGetDoctorsQuery({});
  const doctors = DoctorsData?.data?.records || [];

  const investigation = investigationData?.data;
  const loading = investigationLoading || investigationFetching;

  console.log('Endometrial Investigations fetch', investigation);

  const date = new Date(investigation?.date || new Date()).toLocaleDateString();
  const doctor =
    investigation?.doctor?.firstName + ' ' + investigation?.doctor?.lastName;
  const investigationName = investigation?.investigation?.test?.testName;
  const actualProcedureName = investigation?.investigation?.name;

  const investigationDetails = investigation?.result
    ?.details as IEndometrialAssessmentForm;
  console.log('Investigation details', investigationDetails);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    // Initialize with an empty array by default
    let initialUrl: string[] = [];
    if (investigation?.result?.files) {
      initialUrl = investigation.result.files.flat();
    }

    return initialUrl;
  });

  const [editInvestigation, { isLoading: editingInvestigation }] =
    useEditInvestigationMutation();

  const handleSubmit = async (
    values: IEditInvestigationForm<IEndometrialAssessmentForm>,
  ) => {
    console.log('Formik values', values);
    const actualName = actualProcedureName || 'Default Investigation'; // Use a fallback if procedureName is null/undefined

    const payload: IEditInvestigationpayload = {
      status: values.status,
      result: {
        notes: values.notes,
        files: fileUploadedUrl,
        testName: investigationName!,
        details: {
          indication: values.result.indication || '',
          lmpDate: values.result.lmpDate || null,
          endometrialAssessments: values.result.endometrialAssessments.map(
            item => {
              return {
                date: item.date || null,
                day: item.day || '',
                endometrialThickness: item.endometrialThickness || '',
                medication: item.medication || '',
                remarks: item.remarks || '',
              };
            },
          ),
        },
      },
      testType: ETestType.EndometrialAssessment,
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
    } catch (error) {
      console.error('Failed to update investigation', error);
    }
  };

  const initialVaules: IEditInvestigationForm<IEndometrialAssessmentForm> = {
    status: investigation?.status || '',
    files: [],
    notes: investigation?.result?.notes || '',
    result: {
      indication: investigationDetails?.indication || '',
      lmpDate: investigationDetails?.lmpDate || null,
      endometrialAssessments: investigationDetails?.endometrialAssessments || [
        {
          date: null,
          day: '',
          endometrialThickness: '',
          medication: [],
          remarks: '',
        },
      ],
      impression: investigationDetails?.impression || '',
      doctor: investigationDetails?.doctor || null,
      doctorRemarks: investigationDetails?.doctorRemarks || '',
    },
  };

  // const formik = useFormik({
  const formik = useFormik<IEditInvestigationForm<IEndometrialAssessmentForm>>({
    initialValues: initialVaules,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const handleAddFields = () => {
    formik.setFieldValue('result.endometrialAssessments', [
      ...formik.values.result.endometrialAssessments,
      {
        date: null,
        day: '',
        endometrialThickness: '',
        medication: [],
        remarks: '',
      },
    ]);
  };

  const handleDeleteField = (index: number) => {
    const newFields = formik.values.result.endometrialAssessments.filter(
      (_, i) => i !== index,
    );
    formik.setFieldValue('result.endometrialAssessments', newFields);
  };

  const getFieldErrorAndTouched = useCallback(
    (
      index: number,
      fieldName:
        | 'date'
        | 'day'
        | 'endometrialThickness'
        | 'medication'
        | 'remarks',
    ) => {
      // Ensure that we're working with the correct structure
      const touched = formik?.touched?.result
        ?.endometrialAssessments as FormikTouched<IEndometrialItems>[];
      const error = formik?.errors?.result
        ?.endometrialAssessments as FormikErrors<IEndometrialItems>[];

      const isFieldTouched = touched?.[index]?.[fieldName];
      const fieldError = error?.[index]?.[fieldName];

      return {
        isError: Boolean(isFieldTouched && fieldError),
        errorMessage: typeof fieldError === 'string' ? fieldError : undefined,
      };
    },
    [
      formik.touched.result?.endometrialAssessments,
      formik.errors.result?.endometrialAssessments,
    ],
  );

  const onModalClose = () => {
    formik.resetForm();
    dispatch(closeEditInvestigation());
  };

  if (loading) return renderSkeletonLoader();

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormikProvider value={formik}>
        <ReportModalHeader
          date={date}
          doctor={doctor}
          reportName={investigationName}
        />
        <Box display={'flex'} flexDirection={'column'} mt={2} flex={1}>
          <Grid container gap={2}>
            <Grid item xs={12} md={6} lg={2}>
              <TextField
                name="result.indication"
                fullWidth
                label="Scan Type"
                value={formik.values.result.indication}
                onChange={formik.handleChange}
                error={
                  formik?.touched?.result?.indication &&
                  Boolean(formik?.errors?.result?.indication)
                }
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <CustomDatePicker
                name="result.lmpDate"
                value={formik?.values.result.lmpDate}
                label="LMP Date"
                onChange={date => formik.setFieldValue('result.lmpDate', date)}
                error={
                  formik?.touched?.result?.lmpDate &&
                  Boolean(formik?.errors?.result?.lmpDate)
                }
                helperText={
                  formik?.touched?.result?.lmpDate &&
                  formik?.errors?.result?.lmpDate
                }
              />
            </Grid>
          </Grid>
          <Box mt={2} pb={4}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
              Endometrial Assessment
            </Typography>
            {formik.values.result.endometrialAssessments.map((item, index) => {
              const isLastItem =
                index ===
                formik.values.result.endometrialAssessments?.length - 1;
              const onlyOneItem =
                formik.values.result.endometrialAssessments?.length === 1;

              const { isError: isDateError, errorMessage: dateErrorMessage } =
                getFieldErrorAndTouched(index, 'date');

              return (
                <Grid container gap={2} mt={3} key={index}>
                  <Grid item flex={1}>
                    <CustomDatePicker
                      label="Select Date"
                      name={`result.endometrialAssessments[${index}].date`}
                      value={item.date}
                      onChange={date =>
                        formik.setFieldValue(`items[${index}].date`, date)
                      }
                      error={isDateError}
                      helperText={isDateError && dateErrorMessage}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      multiline
                      label="Day"
                      name={`result.endometrialAssessments[${index}].day`}
                      value={item.day || ''}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="Medication"
                      name={`result.endometrialAssessments[${index}].medication`}
                      value={item.medication.join(', ') || ''}
                      onChange={e =>
                        formik.setFieldValue(
                          `result.endometrialAssessments[${index}].medication`,
                          e.target.value.split(', '),
                        )
                      }
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="Endometrial Thickness"
                      name={`result.endometrialAssessments[${index}].endometrialThickness`}
                      value={item.endometrialThickness || ''}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <TextField
                      fullWidth
                      label="Remarks"
                      name={`result.endometrialAssessments[${index}].remarks`}
                      value={item.remarks || ''}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  {/* Dynamic Add/Delete Buttons */}
                  <Grid
                    item
                    flex={1}
                    display={'flex'}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                  >
                    {!onlyOneItem && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteField(index)}
                      >
                        <Delete fontSize={'small'} />
                      </IconButton>
                    )}
                    {isLastItem && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={handleAddFields}
                      >
                        <Add fontSize={'small'} />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              );
            })}
          </Box>
          <Grid container gap={2} mt={2}>
            <Grid item xs={12} md={6} lg={2}>
              <TextField
                name="result.impression"
                fullWidth
                label="Impression"
                value={formik.values.result.impression}
                onChange={formik.handleChange}
                error={
                  formik?.touched?.result?.impression &&
                  Boolean(formik?.errors?.result?.impression)
                }
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <FieldAutocomplete
                options={doctors}
                getOptionLabel={option =>
                  `${option.firstName} ${option.lastName}`
                }
                isOptionEqualToValue={(option, value) => {
                  return option._id === value._id;
                }}
                value={formik.values.result.doctor}
                onChange={newValue =>
                  formik.setFieldValue('result.doctor', newValue)
                }
                label="Doctor"
                loading={DoctorFetching || DoctorsLoading}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <TextField
                name="result.doctorRemarks"
                fullWidth
                label="Doctor Remarks"
                value={formik.values.result.doctorRemarks}
                onChange={formik.handleChange}
                error={
                  formik?.touched?.result?.doctorRemarks &&
                  Boolean(formik?.errors?.result?.doctorRemarks)
                }
              />
            </Grid>
          </Grid>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
            Upload Report
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
                  documentType={EDocumentTypes.Investigation}
                  user={patient?._id}
                  reportId={openEditDialog.id}
                />
              )}
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
      </FormikProvider>
    </form>
  );
};

export default EndometrialAssessment;
