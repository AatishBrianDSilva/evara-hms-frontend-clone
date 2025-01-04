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
import React from 'react';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
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
  IEditInvestigationForm,
  IEditInvestigationpayload,
  IUltraSoundScanForm,
} from '../../../../../types/patientDashboard/investigation';
import { ETestType } from '../../../../../types/master';
import CustomDatePicker from '../../../../../components/CustomDatePicker/CustomDatePicker';
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

const UltraSoundScan: React.FC = () => {
  const dispatch = useDispatch();
  const { showPromiseToast } = useToast();

  const patient = useSelector((state: RootState) => state.patients.patient);
  const openEditDialog = useSelector(
    (state: RootState) => state.investigation.editInvestigationOpen,
  );
  // const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>([""]);

  const {
    data: investigationData,
    isLoading: investigationLoading,
    isFetching: investigationFetching,
  } = useGetInvestigationByIdQuery(openEditDialog.id, {
    skip: !openEditDialog || !openEditDialog.id,
  });

  const investigation = investigationData?.data;
  const loading = investigationLoading || investigationFetching;

  console.log('Edit ultrasound data fetch', investigation);

  const date = new Date(investigation?.date || new Date()).toLocaleDateString();
  const doctor =
    investigation?.doctor?.firstName + ' ' + investigation?.doctor?.lastName;
  const investigationName = investigation?.investigation?.test?.testName;
  const actualProcedureName = investigation?.investigation?.name;

  const investigationDetails = investigation?.result
    ?.details as IUltraSoundScanForm;
  console.log('Investigation details', investigationDetails);

  const [editInvestigation, { isLoading: editingInvestigation }] =
    useEditInvestigationMutation();

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    // Initialize with an empty array by default
    let initialUrl: string[] = [];

    // Check if the file upload URL is present in the investigation details
    if (investigation?.result?.files) {
      initialUrl = investigation.result.files.flat();
    }

    return initialUrl;
  });

  const handleSubmit = async (
    values: IEditInvestigationForm<IUltraSoundScanForm>,
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
      testType: ETestType.UltrasoundScan,
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

  const initialVaules: IEditInvestigationForm<IUltraSoundScanForm> = {
    status: investigation?.status || '',
    files: investigation?.result?.files || [],
    notes: investigation?.result?.notes || '',
    result: {
      scanType: investigationDetails?.scanType || 'baseline scan',
      lmpDate: investigationDetails?.lmpDate || null,
      requestedDate: investigationDetails?.requestedDate || null,
      dateOfScan: investigationDetails?.dateOfScan || null,
      dayOfCycle: investigationDetails?.dayOfCycle || '',
      transAbdominal: investigationDetails?.transAbdominal || false,
      transVaginalSonography:
        investigationDetails?.transVaginalSonography || false,
      utreusAppeared: investigationDetails?.utreusAppeared || 'a',
      utreusAppearedDesc: investigationDetails?.utreusAppearedDesc || '',
      uterusMeasurement: investigationDetails?.uterusMeasurement || '',
      anteriorWall: investigationDetails?.anteriorWall || '',
      posteriorWall: investigationDetails?.posteriorWall || '',
      uterusVolume: investigationDetails?.uterusVolume || '',
      uterocervicalLength: investigationDetails?.uterocervicalLength || '',
      uterineLength: investigationDetails?.uterineLength || '',
      cervicalLength: investigationDetails?.cervicalLength || '',
      myometrium: investigationDetails?.myometrium || '',
      cavityEchoAppeared: investigationDetails?.cavityEchoAppeared || '',
      endometrialThickness: investigationDetails?.endometrialThickness || '',
      anyOtherPathology: investigationDetails?.anyOtherPathology || '',
      rightOvary: {
        notVisualzed: investigationDetails?.rightOvary?.notVisualzed || false,
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
        notVisualzed: investigationDetails?.leftOvary?.notVisualzed || false,
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
      impression: investigationDetails?.impression || '',
      doctor: investigationDetails?.doctor || null,
      doctorRemarks: investigationDetails?.doctorRemarks || '',
      description: investigationDetails?.description || '',
    },
  };

  const formik = useFormik({
    initialValues: initialVaules,
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
      <Box display={'flex'} flexDirection={'column'} mt={2} flex={1}>
        {/* {JSON.stringify(formik.initialValues, null, 2)} */}
        <Typography variant="subtitle1" mb={2} mt={2}>
          {_.startCase(formik.values.result.scanType)}
        </Typography>
        <Grid container gap={2}>
          <Grid item xs={12} md={6} lg={2}>
            <TextField
              name="result.scanType"
              fullWidth
              select
              label="Scan Type"
              value={formik.values.result.scanType}
              onChange={formik.handleChange}
              error={
                formik?.touched?.result?.scanType &&
                Boolean(formik?.errors?.result?.scanType)
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
          <Grid item xs={12} md={6} lg={2}>
            <CustomDatePicker
              name="result.lmpDate"
              value={formik?.values.result.lmpDate}
              label="LMP Date"
              onChange={date => formik.setFieldValue('result.lmpDate', date)}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <CustomDatePicker
              name="result.requestedDate"
              value={formik?.values.result.requestedDate}
              label="Requested Date"
              onChange={date =>
                formik.setFieldValue('result.requestedDate', date)
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <CustomDatePicker
              name="result.dateOfScan"
              value={formik?.values.result.dateOfScan}
              onChange={date => formik.setFieldValue('result.dateOfScan', date)}
              label="Date Of Scan"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <TextField
              name="result.dayOfCycle"
              value={formik?.values.result.dayOfCycle}
              label="Day Of Cycle"
              fullWidth
              type="number"
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" mt={2}>
          Pelvis
        </Typography>
        <Grid container direction={'column'} mb={2}>
          <Grid item xs={12} md={6} lg={6}>
            <FormControlLabel
              label="TransAbdominal"
              control={
                <Checkbox
                  id="TransAbdominal"
                  name="result.transAbdominal"
                  value={formik?.values.result.transAbdominal}
                  onChange={formik.handleChange}
                />
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <FormControlLabel
              label="Transvaginal Sonography"
              control={
                <Checkbox
                  id="Transvaginal Sonography"
                  name="result.transVaginalSonography"
                  value={formik?.values.result.transVaginalSonography}
                  onChange={formik.handleChange}
                />
              }
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              select
              label="Uterus Appeared"
              value={formik.values.result.utreusAppeared}
              onChange={formik.handleChange}
              name="result.utreusAppeared"
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              name="result.utreusAppearedDesc"
              value={formik.values.result.utreusAppearedDesc}
              onChange={formik.handleChange}
              multiline
              fullWidth
              label="Description"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Uterus Measurement (cm)"
              name="result.uterusMeasurement"
              value={formik.values.result.uterusMeasurement}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Anterior Wall"
              name="result.anteriorWall"
              value={formik.values.result.anteriorWall}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Posterior Wall"
              name="result.posteriorWall"
              value={formik.values.result.posteriorWall}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Uterus Volume"
              name="result.uterusVolume"
              value={formik.values.result.uterusVolume}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Uterocervical length measured (cm)"
              name="result.uterocervicalLength"
              value={formik.values.result.uterocervicalLength}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Uterine length measured (cm)"
              name="result.uterineLength"
              value={formik.values.result.uterineLength}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Cervical length measured (cm)"
              name="result.cervicalLength"
              value={formik.values.result.cervicalLength}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              multiline
              fullWidth
              label="Myometrium"
              name="result.myometrium"
              value={formik.values.result.myometrium}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              multiline
              fullWidth
              label="Cavity echo appeared"
              name="result.cavityEchoAppeared"
              value={formik.values.result.cavityEchoAppeared}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              multiline
              fullWidth
              label="Endometrial thickness measuring"
              name="result.endometrialThickness"
              value={formik.values.result.endometrialThickness}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              multiline
              fullWidth
              label="Any Other Pathology"
              name="result.anyOtherPathology"
              value={formik.values.result.anyOtherPathology}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1">Right ovary</Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={12} lg={12}>
            <FormControlLabel
              label=" Not Visualized"
              control={
                <Checkbox
                  id="rightOvary-notVisualzed"
                  name="result.rightOvary.notVisualzed"
                  value={formik.values.result.rightOvary?.notVisualzed}
                  onChange={formik.handleChange}
                />
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Volume"
              name="result.rightOvary.volume"
              value={formik.values.result.rightOvary?.volume}
              onChange={formik.handleChange}
              disabled={formik.values.result.rightOvary?.notVisualzed}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Right Ovary Measurement (cm)"
              name="result.rightOvary.ovaryMeasurement"
              value={formik.values.result.rightOvary?.ovaryMeasurement}
              onChange={formik.handleChange}
              disabled={formik.values.result.rightOvary?.notVisualzed}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Right Ovary Small Follicles"
              name="result.rightOvary.smallFollicles"
              value={formik.values.result.rightOvary?.smallFollicles}
              onChange={formik.handleChange}
              disabled={formik.values.result.rightOvary?.notVisualzed}
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
              disabled={formik.values.result.rightOvary?.notVisualzed}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Right Dominant follicle/Cyst "
              name="result.rightOvary.dominantFollicleOrCyst"
              value={formik.values.result.rightOvary?.dominantFollicleOrCyst}
              onChange={formik.handleChange}
              disabled={formik.values.result.rightOvary?.notVisualzed}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Accessibility"
              name="result.rightOvary.accessibility"
              value={formik.values.result.rightOvary?.accessibility}
              onChange={formik.handleChange}
              disabled={formik.values.result.rightOvary?.notVisualzed}
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
              disabled={formik.values.result.rightOvary?.notVisualzed}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" mt={2}>
          Left ovary
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={12} lg={12}>
            <FormControlLabel
              label=" Not Visualized"
              control={
                <Checkbox
                  id="leftOvary-notVisualzed"
                  name="result.leftOvary.notVisualzed"
                  value={formik.values.result.leftOvary?.notVisualzed}
                  onChange={formik.handleChange}
                />
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Volume"
              name="result.leftOvary.volume"
              value={formik.values.result.leftOvary?.volume}
              onChange={formik.handleChange}
              disabled={formik.values.result.leftOvary?.notVisualzed}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Left Ovary Measurement (cm)"
              name="result.leftOvary.ovaryMeasurement"
              value={formik.values.result.leftOvary?.ovaryMeasurement}
              onChange={formik.handleChange}
              disabled={formik.values.result.leftOvary?.notVisualzed}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Left Ovary Small Follicles"
              name="result.leftOvary.smallFollicles"
              value={formik.values.result.leftOvary?.smallFollicles}
              onChange={formik.handleChange}
              disabled={formik.values.result.leftOvary?.notVisualzed}
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
              disabled={formik.values.result.leftOvary?.notVisualzed}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Left Dominant follicle/Cyst "
              name="result.leftOvary.dominantFollicleOrCyst"
              value={formik.values.result.leftOvary?.dominantFollicleOrCyst}
              onChange={formik.handleChange}
              disabled={formik.values.result.leftOvary?.notVisualzed}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Accessibility"
              name="result.leftOvary.accessibility"
              value={formik.values.result.leftOvary?.accessibility}
              onChange={formik.handleChange}
              disabled={formik.values.result.leftOvary?.notVisualzed}
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
              disabled={formik.values.result.leftOvary?.notVisualzed}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2} mt={2}>
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              multiline
              fullWidth
              label="Impression"
              name="result.impression"
              value={formik.values.result.impression}
              onChange={formik.handleChange}
            />
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
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              multiline
              fullWidth
              label="Doctor Remarks"
              name="result.doctorRemarks"
              value={formik.values.result.doctorRemarks}
              onChange={formik.handleChange}
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
          <Grid item xs={12} sm={6} md={6}>
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

export default UltraSoundScan;
