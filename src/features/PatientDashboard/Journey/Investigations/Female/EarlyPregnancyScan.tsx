import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import {
  useEditInvestigationMutation,
  useGetInvestigationByIdQuery,
} from '../../../../../services/patientDashboardService/investigationApi';
import { useToast } from '../../../../../context/ToastContext';
import ReportModalHeader from '../../../../../components/ReportModalHeader/ReportModalHeader';
import { closeEditInvestigation } from '../investigationSlice';
import { useFormik } from 'formik';
import _ from 'lodash';
import {
  IEarlyPregnancyForm,
  IEditInvestigationForm,
  IEditInvestigationpayload,
} from '../../../../../types/patientDashboard/investigation';
import { ETestType } from '../../../../../types/master';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../../types/global';
import DoctorPicker from '../../../../../components/DoctorPicker/DoctorPicker';

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

const EarlyPregnancyScan: React.FC = () => {
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
  const loading = investigationLoading || investigationFetching;

  console.log('Investigaiton at early pregnency', investigation);

  const patient = useSelector((state: RootState) => state.patients.patient);

  const date = new Date(investigation?.date || new Date()).toLocaleDateString();
  const doctor =
    investigation?.doctor?.firstName + ' ' + investigation?.doctor?.lastName;
  const investigationName = investigation?.investigation?.test?.testName;
  const actualProcedureName = investigation?.investigation?.name;

  const investigationDetails = investigation?.result
    ?.details as IEarlyPregnancyForm;
  console.log('Investigation details', investigation);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    // Initialize with an empty array by default
    let initialUrl: string[] = [];

    // Check if the file upload URL is present in the investigation details
    if (investigation?.result?.files) {
      initialUrl = investigation.result.files.flat();
    }
    return initialUrl;
  });

  const [editInvestigation, { isLoading: editingInvestigation }] =
    useEditInvestigationMutation();

  const handleSubmit = async (
    values: IEditInvestigationForm<IEarlyPregnancyForm>,
  ) => {
    console.log('Formik values', values);
    const actualName = actualProcedureName || 'Default Investigation'; // Use a fallback if procedureName is null/undefined

    const payload: IEditInvestigationpayload = {
      status: values.status,
      result: {
        notes: values.notes,
        files: fileUploadedUrl,
        testName: investigationName!,
        details: values.result,
      },
      testType: ETestType.EarlyPregnancyScan,
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

  const initialVaules: IEditInvestigationForm<IEarlyPregnancyForm> = {
    status: investigation?.status || '',
    result: {
      scanType: investigationDetails?.scanType || '',
      lmpDate: investigationDetails?.lmpDate || null,
      embryoTransferDate: investigationDetails?.embryoTransferDate || null,
      requestedDate: investigationDetails?.requestedDate || null,
      dateOfScan: investigationDetails?.dateOfScan || null,
      lmpGA: investigationDetails?.lmpGA || '',
      EDDbyDoc: investigationDetails?.EDDbyDoc || '',
      EDDbyLmp: investigationDetails?.EDDbyLmp || '',
      dateOfConception: investigationDetails?.dateOfConception || null,
      modeOfConception: investigationDetails?.modeOfConception || '',
      menstrualCycle: investigationDetails?.menstrualCycle || '',
      bloodGroup: investigationDetails?.bloodGroup || '',
      bmi: investigationDetails?.bmi || '',
      obstetricHistory: investigationDetails?.obstetricHistory || '',
      routeOfScan: investigationDetails?.routeOfScan || '',
      machineModel: investigationDetails?.machineModel || '',
      view: investigationDetails?.view || '',
      pregnancySite: investigationDetails?.pregnancySite || '',
      gestationalSAC: investigationDetails?.gestationalSAC || '',
      yolkSAC: investigationDetails?.yolkSAC || '',
      fetalPole: investigationDetails?.fetalPole || '',
      crl: investigationDetails?.crl || '',
      cardiacActivity: investigationDetails?.cardiacActivity || '',
      cervicalLength: investigationDetails?.cervicalLength || '',
      rightOvary: {
        notVisualized: investigationDetails?.rightOvary?.notVisualized || false,
        volume: investigationDetails?.rightOvary?.volume || '',
        ovaryMeasurement:
          investigationDetails?.rightOvary?.ovaryMeasurement || '',
        smallFollicles: investigationDetails?.rightOvary?.smallFollicles || '',
        ovaryAFC: investigationDetails?.rightOvary?.ovaryAFC || '',
        dominantFollicleOrCyst:
          investigationDetails?.rightOvary?.dominantFollicleOrCyst || '',
        accessibility: investigationDetails?.rightOvary?.accessibility || '',
        adnexa: investigationDetails?.rightOvary?.adnexa || '',
      },
      leftOvary: {
        notVisualized: investigationDetails?.leftOvary?.notVisualized || false,
        volume: investigationDetails?.leftOvary?.volume || '',
        ovaryMeasurement:
          investigationDetails?.leftOvary?.ovaryMeasurement || '',
        smallFollicles: investigationDetails?.leftOvary?.smallFollicles || '',
        ovaryAFC: investigationDetails?.leftOvary?.ovaryAFC || '',
        dominantFollicleOrCyst:
          investigationDetails?.leftOvary?.dominantFollicleOrCyst || '',
        accessibility: investigationDetails?.leftOvary?.accessibility || '',
        adnexa: investigationDetails?.leftOvary?.adnexa || '',
      },
      earlyOutcome: investigationDetails?.earlyOutcome || '',
      impression: investigationDetails?.impression || '',
      disclaimer: investigationDetails?.disclaimer || '',
      doctor: investigationDetails?.doctor || '',
      description: investigationDetails?.description || '',
    },
    files: [],

    notes: investigation?.result?.notes || '',
  };

  const formik = useFormik({
    initialValues: initialVaules,
    // validationSchema: EarlyPregnancyValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const onModalClose = () => {
    formik.resetForm();
    dispatch(closeEditInvestigation());
  };

  if (loading) return renderSkeletonLoader();

  return (
    <form onSubmit={formik.handleSubmit}>
      <ReportModalHeader
        date={date}
        doctor={doctor}
        reportName={investigationName}
      />
      <Box display="flex" flexDirection="column" mt={2} flex={1}>
        <Typography variant="subtitle1" mb={2} mt={2}>
          {_.startCase(formik.values.result.scanType)}
        </Typography>
        <Grid container spacing={2} mb={2}>
          {' '}
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              name="result.scanType"
              fullWidth
              select
              label="Scan Type"
              value={formik.values.result.scanType}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.scanType &&
                Boolean(formik.errors.result?.scanType)
              }
              helperText={
                formik.touched.result?.scanType &&
                formik.errors.result?.scanType
              }
            >
              <MenuItem value="baseline scan">Baseline Scan</MenuItem>
              <MenuItem value="sono hysterogram">Sono Hysterogram</MenuItem>
              <MenuItem value="baseline scan and sono hysterogram">
                Baseline Scan and Sono Hysterogram
              </MenuItem>
              <MenuItem value="pelvic organ scan">Pelvic Organ Scan</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <DatePicker
              name="result.lmpDate"
              value={formik.values.result.lmpDate}
              format="dd/MM/yyyy"
              label="LMP Date"
              onChange={date => formik.setFieldValue('result.lmpDate', date)}
              slots={TextField}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <DatePicker
              name="result.requestedDate"
              value={formik.values.result.requestedDate}
              format="dd/MM/yyyy"
              label="Requested Date"
              onChange={date =>
                formik.setFieldValue('result.requestedDate', date)
              }
              slots={TextField}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <DatePicker
              name="result.dateOfScan"
              value={formik.values.result.dateOfScan}
              onChange={date => formik.setFieldValue('result.dateOfScan', date)}
              format="dd/MM/yyyy"
              label="Date Of Scan"
              slots={TextField}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <DatePicker
              name="result.embryoTransferDate"
              value={formik.values.result.embryoTransferDate}
              onChange={date =>
                formik.setFieldValue('result.embryoTransferDate', date)
              }
              format="dd/MM/yyyy"
              label="Embryo Transfer Date"
              slots={TextField}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <DatePicker
              name="result.dateOfConception"
              value={formik.values.result.dateOfConception}
              onChange={date =>
                formik.setFieldValue('result.dateOfConception', date)
              }
              format="dd/MM/yyyy"
              label="Date Of Conception"
              slots={TextField}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              name="result.menstrualCycle"
              value={formik.values.result.menstrualCycle}
              label="Menstrual Cycle"
              fullWidth
              type="number"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.menstrualCycle &&
                Boolean(formik.errors.result?.menstrualCycle)
              }
              helperText={
                formik.touched.result?.menstrualCycle &&
                formik.errors.result?.menstrualCycle
              }
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" mt={3} mb={2}>
          USG Pelvis Early Scan Report
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              name="result.modeOfConception"
              value={formik.values.result.modeOfConception}
              label="Mode Of Conception"
              fullWidth
              type="text"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.modeOfConception &&
                Boolean(formik.errors.result?.modeOfConception)
              }
              helperText={
                formik.touched.result?.modeOfConception &&
                formik.errors.result?.modeOfConception
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Blood Group"
              value={formik.values.result.bloodGroup}
              onChange={formik.handleChange}
              name="result.bloodGroup"
              error={
                formik.touched.result?.bloodGroup &&
                Boolean(formik.errors.result?.bloodGroup)
              }
              helperText={
                formik.touched.result?.bloodGroup &&
                formik.errors.result?.bloodGroup
              }
            ></TextField>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              name="result.bmi"
              value={formik.values.result.bmi}
              onChange={formik.handleChange}
              fullWidth
              label="BMI"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Obstetric History"
              name="result.obstetricHistory"
              value={formik.values.result.obstetricHistory}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.obstetricHistory &&
                Boolean(formik.errors.result?.obstetricHistory)
              }
              helperText={
                formik.touched.result?.obstetricHistory &&
                formik.errors.result?.obstetricHistory
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Route Of Scan"
              name="result.routeOfScan"
              value={formik.values.result.routeOfScan}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.routeOfScan &&
                Boolean(formik.errors.result?.routeOfScan)
              }
              helperText={
                formik.touched.result?.routeOfScan &&
                formik.errors.result?.routeOfScan
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Machine Model"
              name="result.machineModel"
              value={formik.values.result.machineModel}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.machineModel &&
                Boolean(formik.errors.result?.machineModel)
              }
              helperText={
                formik.touched.result?.machineModel &&
                formik.errors.result?.machineModel
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="View"
              name="result.view"
              value={formik.values.result.view}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.view &&
                Boolean(formik.errors.result?.view)
              }
              helperText={
                formik.touched.result?.view && formik.errors.result?.view
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Pregnancy Site"
              name="result.pregnancySite"
              value={formik.values.result.pregnancySite}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.pregnancySite &&
                Boolean(formik.errors.result?.pregnancySite)
              }
              helperText={
                formik.touched.result?.pregnancySite &&
                formik.errors.result?.pregnancySite
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Gestational SAC"
              name="result.gestationalSAC"
              value={formik.values.result.gestationalSAC}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.gestationalSAC &&
                Boolean(formik.errors.result?.gestationalSAC)
              }
              helperText={
                formik.touched.result?.gestationalSAC &&
                formik.errors.result?.gestationalSAC
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Yolk SAC"
              name="result.yolkSAC"
              value={formik.values.result.yolkSAC}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.yolkSAC &&
                Boolean(formik.errors.result?.yolkSAC)
              }
              helperText={
                formik.touched.result?.yolkSAC && formik.errors.result?.yolkSAC
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Fetal Pole"
              name="result.fetalPole"
              value={formik.values.result.fetalPole}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.fetalPole &&
                Boolean(formik.errors.result?.fetalPole)
              }
              helperText={
                formik.touched.result?.fetalPole &&
                formik.errors.result?.fetalPole
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="CRL"
              name="result.crl"
              value={formik.values.result.crl}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.crl && Boolean(formik.errors.result?.crl)
              }
              helperText={
                formik.touched.result?.crl && formik.errors.result?.crl
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Cardiac Activity"
              name="result.cardiacActivity"
              value={formik.values.result.cardiacActivity}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.cardiacActivity &&
                Boolean(formik.errors.result?.cardiacActivity)
              }
              helperText={
                formik.touched.result?.cardiacActivity &&
                formik.errors.result?.cardiacActivity
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Cervical Length"
              name="result.cervicalLength"
              value={formik.values.result.cervicalLength}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.cervicalLength &&
                Boolean(formik.errors.result?.cervicalLength)
              }
              helperText={
                formik.touched.result?.cervicalLength &&
                formik.errors.result?.cervicalLength
              }
            />
          </Grid>
          <Grid pl={2} pt={4} mb={2}>
            <Typography variant="subtitle1" mb={2}>
              Right ovary
            </Typography>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  label="Volume"
                  name="result.rightOvary.volume"
                  value={formik.values.result.rightOvary?.volume}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  label="Right Ovary Measurement (cm)"
                  name="result.rightOvary.ovaryMeasurement"
                  value={formik.values.result.rightOvary?.ovaryMeasurement}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  label="Right Ovary Small Follicles"
                  name="result.rightOvary.smallFollicles"
                  value={formik.values.result.rightOvary?.smallFollicles}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  multiline
                  fullWidth
                  label="Right Ovary AFC"
                  name="result.rightOvary.ovaryAFC"
                  value={formik.values.result.rightOvary?.ovaryAFC}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  label="Right Dominant follicle/Cyst "
                  name="result.rightOvary.dominantFollicleOrCyst"
                  value={
                    formik.values.result.rightOvary?.dominantFollicleOrCyst
                  }
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  label="Accessibility"
                  name="result.rightOvary.accessibility"
                  value={formik.values.result.rightOvary?.accessibility}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  multiline
                  fullWidth
                  label="Right Adnexa"
                  name="result.rightOvary.adnexa"
                  value={formik.values.result.rightOvary?.adnexa}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" mt={4} mb={2}>
              Left ovary
            </Typography>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  label="Volume"
                  name="result.leftOvary.volume"
                  value={formik.values.result.leftOvary?.volume}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  label="Left Ovary Measurement (cm)"
                  name="result.leftOvary.ovaryMeasurement"
                  value={formik.values.result.leftOvary?.ovaryMeasurement}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  label="Left Ovary Small Follicles"
                  name="result.leftOvary.smallFollicles"
                  value={formik.values.result.leftOvary?.smallFollicles}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  multiline
                  fullWidth
                  label="Left Ovary AFC"
                  name="result.leftOvary.ovaryAFC"
                  value={formik.values.result.leftOvary?.ovaryAFC}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  label="Left Dominant follicle/Cyst "
                  name="result.leftOvary.dominantFollicleOrCyst"
                  value={formik.values.result.leftOvary?.dominantFollicleOrCyst}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  label="Accessibility"
                  name="result.leftOvary.accessibility"
                  value={formik.values.result.leftOvary?.accessibility}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  multiline
                  fullWidth
                  label="Left Adnexa"
                  name="result.leftOvary.adnexa"
                  value={formik.values.result.leftOvary?.adnexa}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container pl={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Early Outcome"
                name="result.earlyOutcome"
                value={formik.values.result.earlyOutcome}
                onChange={formik.handleChange}
                error={
                  formik.touched.result?.earlyOutcome &&
                  Boolean(formik.errors.result?.earlyOutcome)
                }
                helperText={
                  formik.touched.result?.earlyOutcome &&
                  formik.errors.result?.earlyOutcome
                }
              />
            </Grid>
          </Grid>
          <Grid container pl={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Impression"
                name="result.impression"
                value={formik.values.result.impression}
                onChange={formik.handleChange}
                error={
                  formik.touched.result?.impression &&
                  Boolean(formik.errors.result?.impression)
                }
                helperText={
                  formik.touched.result?.impression &&
                  formik.errors.result?.impression
                }
              />
            </Grid>
          </Grid>
          <Grid container pl={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Disclaimer"
                name="result.disclaimer"
                value={formik.values.result.disclaimer}
                onChange={formik.handleChange}
                error={
                  formik.touched.result?.disclaimer &&
                  Boolean(formik.errors.result?.disclaimer)
                }
                helperText={
                  formik.touched.result?.disclaimer &&
                  formik.errors.result?.disclaimer
                }
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <DoctorPicker
              formState={formik}
              formIndex={0}
              fieldName={`result.doctor`}
              label="Doctor"
              error={
                formik.touched.result?.doctor &&
                Boolean(formik.errors.result?.doctor)
              }
              helperText={
                formik.touched.result?.doctor
                  ? formik.errors.result?.doctor
                  : undefined
              }
              autoSelectIfDoctor={true}
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
          <Grid item xs={12}>
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
  );
};

export default EarlyPregnancyScan;
