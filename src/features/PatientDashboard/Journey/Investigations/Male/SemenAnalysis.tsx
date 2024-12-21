import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Skeleton,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeEditInvestigation } from '../investigationSlice';
import { RootState } from '../../../../../app/store';
import {
  useEditInvestigationMutation,
  useGetInvestigationByIdQuery,
} from '../../../../../services/patientDashboardService/investigationApi';
import { useFormik } from 'formik';
import {
  IEditInvestigationForm,
  IEditInvestigationpayload,
  ISemenAnalysisForm,
} from '../../../../../types/patientDashboard/investigation';
import { ETestType } from '../../../../../types/master';
import { useToast } from '../../../../../context/ToastContext';
import ReportModalHeader from '../../../../../components/ReportModalHeader/ReportModalHeader';
import CustomDatePicker from '../../../../../components/CustomDatePicker/CustomDatePicker';
import CustomTimePicker from '../../../../../components/CustomDatePicker/CustomTimePicker';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../../types/global';
import _ from 'lodash';
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

const SemenAnalysis: React.FC = () => {
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

  const investigationDetails = investigation?.result
    ?.details as ISemenAnalysisForm;

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
    values: IEditInvestigationForm<ISemenAnalysisForm>,
  ) => {
    const actualName = actualProcedureName || 'Semen Analysis'; // Use a fallback if procedureName is null/undefined

    const payload: IEditInvestigationpayload = {
      status: values.status,
      result: {
        notes: values.notes,
        files: fileUploadedUrl,
        testName: investigationName!,
        details: values.result,
      },
      testType: ETestType.SemenAnalysis,
      actualName: actualName, // New field added to the payload
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

  const initialValues: IEditInvestigationForm<ISemenAnalysisForm> = {
    result: {
      sampleCollectionDate: investigationDetails?.sampleCollectionDate
        ? new Date(investigationDetails.sampleCollectionDate)
        : null,
      sampleCollectionTime: investigationDetails?.sampleCollectionTime
        ? new Date(investigationDetails.sampleCollectionTime)
        : null,
      sampleReceivingDate: investigationDetails?.sampleReceivingDate
        ? new Date(investigationDetails.sampleReceivingDate)
        : null,
      sampleReceivingTime: investigationDetails?.sampleReceivingTime
        ? new Date(investigationDetails.sampleReceivingTime)
        : null,
      sampleTested: investigationDetails?.sampleTested || '',
      sampleCollectionLocation:
        investigationDetails?.sampleCollectionLocation || '',
      spillageReport: investigationDetails?.spillageReport || '',
      liquefaction: investigationDetails?.liquefaction || '',
      liquefactionTime: investigationDetails?.liquefactionTime
        ? new Date(investigationDetails.liquefactionTime)
        : null,
      viscosity: investigationDetails?.viscosity || '',
      abstinence: investigationDetails?.abstinence || '',
      volume: investigationDetails?.volume || '',
      ph: investigationDetails?.ph || '',
      visualAppearance: investigationDetails?.visualAppearance || '',
      spermConcentration: investigationDetails?.spermConcentration || '',
      spermMotilityTotal: investigationDetails?.spermMotilityTotal || '',
      progressivePR: investigationDetails?.progressivePR || '',
      slowProgressive: investigationDetails?.slowProgressive || '',
      nonProgressive: investigationDetails?.nonProgressive || '',
      immotile: investigationDetails?.immotile || '',
      normalForms: investigationDetails?.normalForms || '',
      headDefects: investigationDetails?.headDefects || '',
      midPieceDefects: investigationDetails?.midPieceDefects || '',
      tailDefects: investigationDetails?.tailDefects || '',
      totalSpermCount: investigationDetails?.totalSpermCount || '',
      motileSperm: investigationDetails?.motileSperm || '',
      morphologicallyNormalSperm:
        investigationDetails?.morphologicallyNormalSperm || '',
      debris: investigationDetails?.debris || '',
      roundCells: investigationDetails?.roundCells || '',
      agglutination: investigationDetails?.agglutination || '',
      aggregration: investigationDetails?.aggregration || '',
      fructose: investigationDetails?.fructose || '',
      proxidosePositiveCellConcentration:
        investigationDetails?.proxidosePositiveCellConcentration || '',
      impression: investigationDetails?.impression || '',
      remarks: investigationDetails?.remarks || '',
      advice: investigationDetails?.advice || '',
      imageDescription: investigationDetails?.imageDescription || '',
    },
    status: investigation?.status || 'Scheduled',
    notes: investigation?.result?.notes || '',
    files: [],
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: semenvalidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const { setFieldValue, values } = formik;

  // Calculate total sperm count
  useEffect(() => {
    const { spermConcentration, volume } = values.result;

    // Parse the values as floats. Use 0 if parsing fails.
    const concentration = parseFloat(spermConcentration || '0');
    const vol = parseFloat(volume || '0');

    // Check if both values are valid numbers
    if (!isNaN(concentration) && !isNaN(vol)) {
      const total = (concentration / 100) * vol;
      // Format the total to two decimal places
      const formattedTotal = total.toFixed(2);

      // Avoid unnecessary updates
      if (values.result.totalSpermCount !== formattedTotal) {
        setFieldValue('result.totalSpermCount', formattedTotal);
      }
    } else {
      // If either value is invalid, set totalSpermCount to empty string
      if (values.result.totalSpermCount !== '') {
        setFieldValue('result.totalSpermCount', '');
      }
    }
  }, [values.result.spermConcentration, values.result.volume, setFieldValue]);

  // Calculate sperm motility count
  useEffect(() => {
    const { spermConcentration, spermMotilityTotal, volume } = values.result;

    // Parse the values as floats. Use 0 if parsing fails.
    const concentration = parseFloat(spermConcentration || '0');
    const motility = parseFloat(spermMotilityTotal || '0');
    const vol = parseFloat(volume || '0');

    // Check if both values are valid numbers
    if (!isNaN(concentration) && !isNaN(motility) && !isNaN(vol)) {
      const total = (concentration / 100) * vol * (motility / 100);

      // Format the total to two decimal places
      const formattedTotal = total.toFixed(2);

      // Avoid unnecessary updates
      if (values.result.motileSperm !== formattedTotal) {
        setFieldValue('result.motileSperm', formattedTotal);
      }
    } else {
      // If either value is invalid, set motileSperm to empty string
      if (values.result.motileSperm !== '') {
        setFieldValue('result.motileSperm', '');
      }
    }
  }, [
    values.result.spermConcentration,
    values.result.spermMotilityTotal,
    values.result.volume,
    setFieldValue,
  ]);

  // Calculate morphologically normal sperm count
  useEffect(() => {
    const { spermConcentration, volume, normalForms } = values.result;
    const concentration = parseFloat(spermConcentration || '0');
    const vol = parseFloat(volume || '0');
    const normal = parseFloat(normalForms || '0');

    // Check if both values are valid numbers
    if (!isNaN(concentration) && !isNaN(normal) && !isNaN(vol)) {
      const total = (concentration / 100) * vol * (normal / 100);

      // Format the total to two decimal places
      const formattedTotal = total.toFixed(2);

      // Avoid unnecessary updates
      if (values.result.morphologicallyNormalSperm !== formattedTotal) {
        setFieldValue('result.morphologicallyNormalSperm', formattedTotal);
      }
    } else {
      // If either value is invalid, set morphologicallyNormalSperm to empty string
      if (values.result.morphologicallyNormalSperm !== '') {
        setFieldValue('result.morphologicallyNormalSperm', '');
      }
    }
  }, [
    values.result.spermConcentration,
    values.result.volume,
    values.result.normalForms,
    setFieldValue,
  ]);

  if (loading) return renderSkeletonLoader();

  return (
    <form onSubmit={formik.handleSubmit}>
      <ReportModalHeader
        reportName={investigationName}
        doctor={doctor}
        date={date}
      />
      {/* Sample Information */}
      <Grid container spacing={2} marginBottom={4} mt={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Sample Information</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomDatePicker
            label="Sample Collection Date"
            value={formik.values.result.sampleCollectionDate}
            onChange={date =>
              formik.setFieldValue('result.sampleCollectionDate', date)
            }
            error={
              formik.touched.result?.sampleCollectionDate &&
              Boolean(formik.errors.result?.sampleCollectionDate)
            }
            helperText={
              formik.touched.result?.sampleCollectionDate &&
              formik.errors.result?.sampleCollectionDate
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTimePicker
            label="Sample Collection Time"
            value={formik.values.result.sampleCollectionTime}
            onChange={date =>
              formik.setFieldValue('result.sampleCollectionTime', date)
            }
            error={
              formik.touched.result?.sampleCollectionTime &&
              Boolean(formik.errors.result?.sampleCollectionTime)
            }
            helperText={
              formik.touched.result?.sampleCollectionTime &&
              formik.errors.result?.sampleCollectionTime
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomDatePicker
            label="Sample Receiving Date"
            value={formik.values.result.sampleReceivingDate}
            onChange={date =>
              formik.setFieldValue('result.sampleReceivingDate', date)
            }
            error={
              formik.touched.result?.sampleReceivingDate &&
              Boolean(formik.errors.result?.sampleReceivingDate)
            }
            helperText={
              formik.touched.result?.sampleReceivingDate &&
              formik.errors.result?.sampleReceivingDate
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTimePicker
            label="Sample Receiving Time"
            value={formik.values.result.sampleReceivingTime}
            onChange={date =>
              formik.setFieldValue('result.sampleReceivingTime', date)
            }
            error={
              formik.touched.result?.sampleReceivingTime &&
              Boolean(formik.errors.result?.sampleReceivingTime)
            }
            helperText={
              formik.touched.result?.sampleReceivingTime &&
              formik.errors.result?.sampleReceivingTime
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Sample Tested"
            fullWidth
            name="result.sampleTested"
            onChange={formik.handleChange}
            value={formik.values.result.sampleTested}
            error={
              formik.touched.result?.sampleTested &&
              Boolean(formik.errors.result?.sampleTested)
            }
            helperText={
              formik.touched.result?.sampleTested &&
              formik.errors.result?.sampleTested
            }
            select
          >
            <MenuItem value="Retrograte">Retrograte</MenuItem>
            <MenuItem value="Intorgrate">Intorgrate</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Sample Collection Location"
            fullWidth
            value={formik.values.result.sampleCollectionLocation}
            name="result.sampleCollectionLocation"
            onChange={formik.handleChange}
            error={
              formik.touched.result?.sampleCollectionLocation &&
              Boolean(formik.errors.result?.sampleCollectionLocation)
            }
            helperText={
              formik.touched.result?.sampleCollectionLocation &&
              formik.errors.result?.sampleCollectionLocation
            }
            select
          >
            <MenuItem value="On-Site">On-Site</MenuItem>
            <MenuItem value="Off-Site">Off-Site</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Spillage Report"
            fullWidth
            value={formik.values.result.spillageReport}
            name="result.spillageReport"
            onChange={formik.handleChange}
            error={
              formik.touched.result?.spillageReport &&
              Boolean(formik.errors.result?.spillageReport)
            }
            helperText={
              formik.touched.result?.spillageReport &&
              formik.errors.result?.spillageReport
            }
            select
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Liquefaction"
            fullWidth
            value={formik.values.result.liquefaction}
            name="result.liquefaction"
            onChange={formik.handleChange}
            error={
              formik.touched.result?.liquefaction &&
              Boolean(formik.errors.result?.liquefaction)
            }
            helperText={
              formik.touched.result?.liquefaction &&
              formik.errors.result?.liquefaction
            }
            select
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CustomTimePicker
            label="Liquefaction Time"
            value={formik.values.result.liquefactionTime}
            onChange={date =>
              formik.setFieldValue('result.liquefactionTime', date)
            }
            error={
              formik.touched.result?.liquefactionTime &&
              Boolean(formik.errors.result?.liquefactionTime)
            }
            helperText={
              formik.touched.result?.liquefactionTime &&
              formik.errors.result?.liquefactionTime
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Viscosity"
            fullWidth
            name="result.viscosity"
            value={formik.values.result.viscosity}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.viscosity &&
              Boolean(formik.errors.result?.viscosity)
            }
            helperText={
              formik.touched.result?.viscosity &&
              formik.errors.result?.viscosity
            }
            select
          >
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Abstinence"
            fullWidth
            name="result.abstinence"
            value={formik.values.result.abstinence}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.abstinence &&
              Boolean(formik.errors.result?.abstinence)
            }
            helperText={
              formik.touched.result?.abstinence &&
              formik.errors.result?.abstinence
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Volume"
            fullWidth
            name="result.volume"
            value={formik.values.result.volume}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.volume &&
              Boolean(formik.errors.result?.volume)
            }
            helperText={
              formik.touched.result?.volume && formik.errors.result?.volume
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>ml</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="PH"
            fullWidth
            name="result.ph"
            value={formik.values.result.ph}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.ph && Boolean(formik.errors.result?.ph)
            }
            helperText={formik.touched.result?.ph && formik.errors.result?.ph}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>pH</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Visual Appearance"
            fullWidth
            name="result.visualAppearance"
            value={formik.values.result.visualAppearance}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.visualAppearance &&
              Boolean(formik.errors.result?.visualAppearance)
            }
            helperText={
              formik.touched.result?.visualAppearance &&
              formik.errors.result?.visualAppearance
            }
          />
        </Grid>
      </Grid>

      {/* Parameter */}
      <Grid container spacing={2} marginBottom={4}>
        <Grid item xs={12}>
          <Typography variant="h6">Parameter</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            label="Sperm Concentration"
            fullWidth
            name="result.spermConcentration"
            value={formik.values.result.spermConcentration}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.spermConcentration &&
              Boolean(formik.errors.result?.spermConcentration)
            }
            helperText={
              formik.touched.result?.spermConcentration &&
              formik.errors.result?.spermConcentration
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>millions/ml</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Motility */}
      <Grid container spacing={2} marginBottom={4}>
        <Grid item xs={12}>
          <Typography variant="h6">Motility</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Sperm Motility Total"
            fullWidth
            name="result.spermMotilityTotal"
            value={formik.values.result.spermMotilityTotal}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.spermMotilityTotal &&
              Boolean(formik.errors.result?.spermMotilityTotal)
            }
            helperText={
              formik.touched.result?.spermMotilityTotal &&
              formik.errors.result?.spermMotilityTotal
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>%</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Progressive PR"
            fullWidth
            name="result.progressivePR"
            value={formik.values.result.progressivePR}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.progressivePR &&
              Boolean(formik.errors.result?.progressivePR)
            }
            helperText={
              formik.touched.result?.progressivePR &&
              formik.errors.result?.progressivePR
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>%</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Rapid Progressive"
            fullWidth
            name="result.rapidProgressive"
            value={formik.values.result.rapidProgressive}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.rapidProgressive &&
              Boolean(formik.errors.result?.rapidProgressive)
            }
            helperText={
              formik.touched.result?.rapidProgressive &&
              formik.errors.result?.rapidProgressive
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>%</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Slow Progressive"
            fullWidth
            name="result.slowProgressive"
            value={formik.values.result.slowProgressive}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.slowProgressive &&
              Boolean(formik.errors.result?.slowProgressive)
            }
            helperText={
              formik.touched.result?.slowProgressive &&
              formik.errors.result?.slowProgressive
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>%</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Non Progressive"
            fullWidth
            name="result.nonProgressive"
            value={formik.values.result.nonProgressive}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.nonProgressive &&
              Boolean(formik.errors.result?.nonProgressive)
            }
            helperText={
              formik.touched.result?.nonProgressive &&
              formik.errors.result?.nonProgressive
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>%</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Immotile IM"
            fullWidth
            name="result.immotile"
            value={formik.values.result.immotile}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.immotile &&
              Boolean(formik.errors.result?.immotile)
            }
            helperText={
              formik.touched.result?.immotile && formik.errors.result?.immotile
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>%</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Morphology */}
      <Grid container spacing={2} marginBottom={4}>
        <Grid item xs={12}>
          <Typography variant="h6">Morphology</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Normal Forms"
            fullWidth
            name="result.normalForms"
            value={formik.values.result.normalForms}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.normalForms &&
              Boolean(formik.errors.result?.normalForms)
            }
            helperText={
              formik.touched.result?.normalForms &&
              formik.errors.result?.normalForms
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>%</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Head Defects"
            fullWidth
            name="result.headDefects"
            value={formik.values.result.headDefects}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.headDefects &&
              Boolean(formik.errors.result?.headDefects)
            }
            helperText={
              formik.touched.result?.headDefects &&
              formik.errors.result?.headDefects
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>%</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Mid Piece Defects"
            fullWidth
            name="result.midPieceDefects"
            value={formik.values.result.midPieceDefects}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.midPieceDefects &&
              Boolean(formik.errors.result?.midPieceDefects)
            }
            helperText={
              formik.touched.result?.midPieceDefects &&
              formik.errors.result?.midPieceDefects
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>%</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Tail Defects"
            fullWidth
            name="result.tailDefects"
            value={formik.values.result.tailDefects}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.tailDefects &&
              Boolean(formik.errors.result?.tailDefects)
            }
            helperText={
              formik.touched.result?.tailDefects &&
              formik.errors.result?.tailDefects
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>%</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Total Ejaculation */}
      <Grid container spacing={2} marginBottom={4}>
        <Grid item xs={12}>
          <Typography variant="h6">Total Ejaculation</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Total Sperm Count"
            fullWidth
            name="result.totalSpermCount"
            value={formik.values.result.totalSpermCount}
            onChange={formik.handleChange}
            disabled={true}
            error={
              formik.touched.result?.totalSpermCount &&
              Boolean(formik.errors.result?.totalSpermCount)
            }
            helperText={
              formik.touched.result?.totalSpermCount &&
              formik.errors.result?.totalSpermCount
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>
                    millions/ejaculate
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Motile Sperm"
            fullWidth
            name="result.motileSperm"
            value={formik.values.result.motileSperm}
            onChange={formik.handleChange}
            disabled={true}
            error={
              formik.touched.result?.motileSperm &&
              Boolean(formik.errors.result?.motileSperm)
            }
            helperText={
              formik.touched.result?.motileSperm &&
              formik.errors.result?.motileSperm
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>
                    millions/ejaculate
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Morphologically Normal Sperm"
            fullWidth
            name="result.morphologicallyNormalSperm"
            value={formik.values.result.morphologicallyNormalSperm}
            onChange={formik.handleChange}
            disabled={true}
            error={
              formik.touched.result?.morphologicallyNormalSperm &&
              Boolean(formik.errors.result?.morphologicallyNormalSperm)
            }
            helperText={
              formik.touched.result?.morphologicallyNormalSperm &&
              formik.errors.result?.morphologicallyNormalSperm
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>
                    millions/ejaculate
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Additional Information */}
      <Grid container spacing={2} marginBottom={4}>
        <Grid item xs={12}>
          <Typography variant="h6">Additional Information</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Debris"
            fullWidth
            name="result.debris"
            value={formik.values.result.debris}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.debris &&
              Boolean(formik.errors.result?.debris)
            }
            helperText={
              formik.touched.result?.debris && formik.errors.result?.debris
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Round Cells"
            fullWidth
            name="result.roundCells"
            value={formik.values.result.roundCells}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.roundCells &&
              Boolean(formik.errors.result?.roundCells)
            }
            helperText={
              formik.touched.result?.roundCells &&
              formik.errors.result?.roundCells
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>millions/ml</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Agglutination"
            fullWidth
            name="result.agglutination"
            value={formik.values.result.agglutination}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.agglutination &&
              Boolean(formik.errors.result?.agglutination)
            }
            helperText={
              formik.touched.result?.agglutination &&
              formik.errors.result?.agglutination
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Aggregration"
            fullWidth
            name="result.aggregration"
            value={formik.values.result.aggregration}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.aggregration &&
              Boolean(formik.errors.result?.aggregration)
            }
            helperText={
              formik.touched.result?.aggregration &&
              formik.errors.result?.aggregration
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Fructose"
            fullWidth
            name="result.fructose"
            value={formik.values.result.fructose}
            onChange={formik.handleChange}
            error={
              formik.touched.result?.fructose &&
              Boolean(formik.errors.result?.fructose)
            }
            helperText={
              formik.touched.result?.fructose && formik.errors.result?.fructose
            }
            select
          >
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Proxidose - Positive cell concentration"
            fullWidth
            name="result.proxidosePositiveCellConcentration"
            value={formik.values.result.proxidosePositiveCellConcentration}
            onChange={formik.handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: '12px' }}>millions/ml</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Impression */}
      <Grid container spacing={2} marginBottom={4}>
        <Grid item xs={12}>
          <Typography variant="h6">Impression</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Impression"
            fullWidth
            multiline
            minRows={2}
            name="result.impression"
            value={formik.values.result.impression}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>

      {/* Remarks */}
      <Grid container spacing={2} marginBottom={4}>
        <Grid item xs={12}>
          <Typography variant="h6">Remarks</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Remarks"
            fullWidth
            multiline
            minRows={2}
            name="result.remarks"
            value={formik.values.result.remarks}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Advice"
            fullWidth
            multiline
            minRows={2}
            name="result.advice"
            value={formik.values.result.advice}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>

      {/* Upload Images & Description */}
      <Grid container spacing={2} marginBottom={4}>
        <Grid item xs={12}>
          <Typography variant="h6">Upload Images & Description</Typography>
        </Grid>
        <Grid item xs={12}>
          {patient && (
            <FileUploadButton
              showSubmitHint={true}
              acceptTypes="image/*, application/pdf"
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

      {/* Status */}
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

      {/* Buttons */}
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
  );
};

export default SemenAnalysis;
