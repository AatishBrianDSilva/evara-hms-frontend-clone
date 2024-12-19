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
  // console.log("Investigation details", investigation);

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
    const actualName = actualProcedureName || 'Default Investigation'; // Use a fallback if procedureName is null/undefined

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
      formik.resetForm();
      dispatch(closeEditInvestigation());
    } catch (error) {
      console.error('Failed to update investigation', error);
    }
  };

  const initialValues: IEditInvestigationForm<ISemenAnalysisForm> = {
    result: {
      date: investigationDetails?.date || null,
      spermDfi: investigationDetails?.spermDfi || '',
      timeOfSampleReceivedAtHospital:
        investigationDetails?.timeOfSampleReceivedAtHospital || null,
      placeOfCollection: investigationDetails?.placeOfCollection || '',
      timeOfCollection: investigationDetails?.timeOfCollection || null,
      timeOfEvaluation: investigationDetails?.timeOfEvaluation || null,
      daysOfAbstinence: investigationDetails?.daysOfAbstinence || '',
      volume: investigationDetails?.volume || '',
      spillage: investigationDetails?.spillage || '',
      appearance: investigationDetails?.appearance || '',
      liquefaction: investigationDetails?.liquefaction || '',
      viscosity: investigationDetails?.viscosity || '',
      ph: investigationDetails?.ph || '',
      color: investigationDetails?.color || '',
      spermConcMillionsPerMl:
        investigationDetails?.spermConcMillionsPerMl || '',
      pusCells: investigationDetails?.pusCells || '',
      rbc: investigationDetails?.rbc || '',
      agglutination: investigationDetails?.agglutination || '',
      totalEjaculateMillions:
        investigationDetails?.totalEjaculateMillions || '',
      fructose: investigationDetails?.fructose || '',
      epithelialCells: investigationDetails?.epithelialCells || '',
      live: investigationDetails?.live || '',
      dead: investigationDetails?.dead || '',
      impressionPhysicalAssessment:
        investigationDetails?.impressionPhysicalAssessment || '',
      rapidProgressiveGradeA:
        investigationDetails?.rapidProgressiveGradeA || '',
      slowProgressiveGradeB: investigationDetails?.slowProgressiveGradeB || '',
      nonProgressiveGradeC: investigationDetails?.nonProgressiveGradeC || '',
      immotileGradeD: investigationDetails?.immotileGradeD || '',
      impressionSpermMotility:
        investigationDetails?.impressionSpermMotility || '',
      normalForms: investigationDetails?.normalForms || '',
      headDefects: investigationDetails?.headDefects || '',
      overAllDefects: investigationDetails?.overAllDefects || '',
      midPieceAndNeckDefects:
        investigationDetails?.midPieceAndNeckDefects || '',
      cytoplasmicDroplets: investigationDetails?.cytoplasmicDroplets || '',
      tailDefects: investigationDetails?.tailDefects || '',
      defectsInHeadMidPieceNeckAndTail:
        investigationDetails?.defectsInHeadMidPieceNeckAndTail || '',
      impressionMorphologyAssessment:
        investigationDetails?.impressionMorphologyAssessment || '',
      hos: investigationDetails?.hos || '',
      acrosomeIntactnessAI: investigationDetails?.acrosomeIntactnessAI || '',
      zonaBindingPotentialOfSpermAsPerAITesting:
        investigationDetails?.zonaBindingPotentialOfSpermAsPerAITesting || '',
      analysis: investigationDetails?.analysis || '',
      description: investigationDetails?.description || '',
      disclaimer: '',
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

  if (loading) return renderSkeletonLoader();

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ReportModalHeader
          reportName={investigationName}
          doctor={doctor}
          date={date}
        />

        <Grid container spacing={2} marginBottom={2} mt={2} flex={1}>
          <Grid item xs={12} sm={6} md={3}>
            <CustomDatePicker
              label="Date"
              value={formik.values.result.date}
              onChange={date => formik.setFieldValue('result.date', date)}
              error={
                formik.touched.result?.date &&
                Boolean(formik.errors.result?.date)
              }
              helperText={
                formik.touched.result?.date && formik.errors.result?.date
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Sperm DFI"
              fullWidth
              name="result.spermDfi"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.spermDfi &&
                Boolean(formik.errors.result?.spermDfi)
              }
              helperText={
                formik.touched.result?.spermDfi &&
                formik.errors.result?.spermDfi
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CustomTimePicker
              label="Time of sample received at hospital"
              value={formik.values.result.timeOfSampleReceivedAtHospital}
              onChange={date =>
                formik.setFieldValue(
                  'result.timeOfSampleReceivedAtHospital',
                  date,
                )
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Place of Collection"
              fullWidth
              name="result.placeOfCollection"
              value={formik.values.result.placeOfCollection}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.placeOfCollection &&
                Boolean(formik.errors.result?.placeOfCollection)
              }
              helperText={
                formik.touched.result?.placeOfCollection &&
                formik.errors.result?.placeOfCollection
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CustomTimePicker
              label="Time Of Collection"
              value={formik.values.result.timeOfCollection}
              name="result.timeOfCollection"
              onChange={date =>
                formik.setFieldValue('result.timeOfCollection', date)
              }
              error={
                formik.touched.result?.timeOfCollection &&
                Boolean(formik.errors.result?.timeOfCollection)
              }
              helperText={
                formik.touched.result?.timeOfCollection &&
                formik.errors.result?.timeOfCollection
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CustomTimePicker
              label="Time Of Evaluation"
              value={formik.values.result.timeOfEvaluation}
              onChange={date =>
                formik.setFieldValue('result.timeOfEvaluation', date)
              }
              error={
                formik.touched.result?.timeOfEvaluation &&
                Boolean(formik.errors.result?.timeOfEvaluation)
              }
              helperText={
                formik.touched.result?.timeOfEvaluation &&
                formik.errors.result?.timeOfEvaluation
              }
            />
          </Grid>
        </Grid>
        {/* <Grid container spacing={2} marginBottom={2}> */}
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Days of Abstinence"
              fullWidth
              type="number"
              name="result.daysOfAbstinence"
              value={formik.values.result.daysOfAbstinence}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.daysOfAbstinence &&
                Boolean(formik.errors.result?.daysOfAbstinence)
              }
              helperText={
                formik.touched.result?.daysOfAbstinence &&
                formik.errors.result?.daysOfAbstinence
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Volume"
              fullWidth
              value={formik.values.result.volume}
              name="result.volume"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.volume &&
                Boolean(formik.errors.result?.volume)
              }
              helperText={
                formik.touched.result?.volume && formik.errors.result?.volume
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Spillage"
              fullWidth
              value={formik.values.result.spillage}
              name="result.spillage"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.spillage &&
                Boolean(formik.errors.result?.spillage)
              }
              helperText={
                formik.touched.result?.spillage &&
                formik.errors.result?.spillage
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Appearance"
              fullWidth
              value={formik.values.result.appearance}
              name="result.appearance"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.appearance &&
                Boolean(formik.errors.result?.appearance)
              }
              helperText={
                formik.touched.result?.appearance &&
                formik.errors.result?.appearance
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} marginBottom={2}>
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
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="PH"
              fullWidth
              name="result.ph"
              onChange={formik.handleChange}
              value={formik.values.result.ph}
              error={
                formik.touched.result?.ph && Boolean(formik.errors.result?.ph)
              }
              helperText={formik.touched.result?.ph && formik.errors.result?.ph}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Color"
              fullWidth
              name="result.color"
              value={formik.values.result.color}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.color &&
                Boolean(formik.errors.result?.color)
              }
              helperText={
                formik.touched.result?.color && formik.errors.result?.color
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Pus Cells"
              fullWidth
              value={formik.values.result.pusCells}
              name="result.pusCells"
              onChange={e => formik.handleChange(e)}
              error={
                formik.touched.result?.pusCells &&
                Boolean(formik.errors.result?.pusCells)
              }
              helperText={
                formik.touched.result?.pusCells &&
                formik.errors.result?.pusCells
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="RBC"
              fullWidth
              value={formik.values.result.rbc}
              name="result.rbc"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.rbc && Boolean(formik.errors.result?.rbc)
              }
              helperText={
                formik.touched.result?.rbc && formik.errors.result?.rbc
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Agglutination"
              fullWidth
              name="result.agglutination"
              onChange={formik.handleChange}
              value={formik.values.result.agglutination}
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
              label="Total Ejaculate"
              fullWidth
              value={formik.values.result.totalEjaculateMillions}
              name="result.totalEjaculateMillions"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.totalEjaculateMillions &&
                Boolean(formik.errors.result?.totalEjaculateMillions)
              }
              helperText={
                formik.touched.result?.totalEjaculateMillions &&
                formik.errors.result?.totalEjaculateMillions
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Fructose"
              fullWidth
              value={formik.values.result.fructose}
              name="result.fructose"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.fructose &&
                Boolean(formik.errors.result?.fructose)
              }
              helperText={
                formik.touched.result?.fructose &&
                formik.errors.result?.fructose
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Epithelial Cells"
              fullWidth
              value={formik.values.result.epithelialCells}
              name="result.epithelialCells"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.epithelialCells &&
                Boolean(formik.errors.result?.epithelialCells)
              }
              helperText={
                formik.touched.result?.epithelialCells &&
                formik.errors.result?.epithelialCells
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Live"
              fullWidth
              value={formik.values.result.live}
              name="result.live"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.live &&
                Boolean(formik.errors.result?.live)
              }
              helperText={
                formik.touched.result?.live && formik.errors.result?.live
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Dead"
              fullWidth
              value={formik.values.result.dead}
              name="result.dead"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.dead &&
                Boolean(formik.errors.result?.dead)
              }
              helperText={
                formik.touched.result?.dead && formik.errors.result?.dead
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Physical Impression Assessment"
              fullWidth
              name="result.impressionPhysicalAssessment"
              value={formik.values.result.impressionPhysicalAssessment}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.impressionPhysicalAssessment &&
                Boolean(formik.errors.result?.impressionPhysicalAssessment)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Normal Forms"
              fullWidth
              value={formik.values.result.normalForms}
              name="result.normalForms"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.normalForms &&
                Boolean(formik.errors.result?.normalForms)
              }
              helperText={
                formik.touched.result?.normalForms &&
                formik.errors.result?.normalForms
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Head Defects"
              fullWidth
              value={formik.values.result.headDefects}
              name="result.headDefects"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.headDefects &&
                Boolean(formik.errors.result?.headDefects)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Over All Defects"
              fullWidth
              value={formik.values.result.overAllDefects}
              onChange={formik.handleChange('result.overAllDefects')}
              error={
                formik.touched.result?.overAllDefects &&
                Boolean(formik.errors.result?.overAllDefects)
              }
              helperText={
                formik.touched.result?.overAllDefects &&
                formik.errors.result?.overAllDefects
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Mid Piece and Neck Defects"
              fullWidth
              value={formik.values.result.midPieceAndNeckDefects}
              onChange={formik.handleChange('result.midPieceAndNeckDefects')}
              error={
                formik.touched.result?.midPieceAndNeckDefects &&
                Boolean(formik.errors.result?.midPieceAndNeckDefects)
              }
              helperText={
                formik.touched.result?.midPieceAndNeckDefects &&
                formik.errors.result?.midPieceAndNeckDefects
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Cytoplasmic Droplets"
              fullWidth
              name="result.cytoplasmicDroplets"
              value={formik.values.result.cytoplasmicDroplets}
              onChange={formik.handleChange}
              error={
                formik.touched.result?.cytoplasmicDroplets &&
                Boolean(formik.errors.result?.cytoplasmicDroplets)
              }
              helperText={
                formik.touched.result?.cytoplasmicDroplets &&
                formik.errors.result?.cytoplasmicDroplets
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Tail Defects"
              fullWidth
              value={formik.values.result.tailDefects}
              name="result.tailDefects"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.tailDefects &&
                Boolean(formik.errors.result?.tailDefects)
              }
              helperText={
                formik.touched.result?.tailDefects &&
                formik.errors.result?.tailDefects
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Defects In Head, Mid Piece, Neck & Tail"
              fullWidth
              value={formik.values.result.defectsInHeadMidPieceNeckAndTail}
              name="result.defectsInHeadMidPieceNeckAndTail"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.defectsInHeadMidPieceNeckAndTail &&
                Boolean(formik.errors.result?.defectsInHeadMidPieceNeckAndTail)
              }
              helperText={
                formik.touched.result?.defectsInHeadMidPieceNeckAndTail &&
                formik.errors.result?.defectsInHeadMidPieceNeckAndTail
              }
            />
          </Grid>
        </Grid>
        {/* <Grid container spacing={2} marginBottom={2}> */}
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Morphology Impression Assessment"
              fullWidth
              value={formik.values.result.impressionMorphologyAssessment}
              name="result.impressionMorphologyAssessment"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.impressionMorphologyAssessment &&
                Boolean(formik.errors.result?.impressionMorphologyAssessment)
              }
              helperText={
                formik.touched.result?.impressionMorphologyAssessment &&
                formik.errors.result?.impressionMorphologyAssessment
              }
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Advanced Sperm Fertilization Parameter Assessment
        </Typography>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="HOS (Hypo-Osmotic Swelling)"
              fullWidth
              value={formik.values.result.hos}
              name="result.hos"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.hos && Boolean(formik.errors.result?.hos)
              }
              helperText={
                formik.touched.result?.hos && formik.errors.result?.hos
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Acrosome Intactness (AI)"
              fullWidth
              value={formik.values.result.acrosomeIntactnessAI}
              name="result.acrosomeIntactnessAI"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.acrosomeIntactnessAI &&
                Boolean(formik.errors.result?.acrosomeIntactnessAI)
              }
              helperText={
                formik.touched.result?.acrosomeIntactnessAI &&
                formik.errors.result?.acrosomeIntactnessAI
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Zona Binding Potential Of Sperm As Per AI Testing"
              fullWidth
              value={
                formik.values.result.zonaBindingPotentialOfSpermAsPerAITesting
              }
              name="result.zonaBindingPotentialOfSpermAsPerAITesting"
              onChange={formik.handleChange}
              error={
                formik.touched.result
                  ?.zonaBindingPotentialOfSpermAsPerAITesting &&
                Boolean(
                  formik.errors.result
                    ?.zonaBindingPotentialOfSpermAsPerAITesting,
                )
              }
              helperText={
                formik.touched.result
                  ?.zonaBindingPotentialOfSpermAsPerAITesting &&
                formik.errors.result?.zonaBindingPotentialOfSpermAsPerAITesting
              }
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Final Semen Analysis & Advanced Sperm Assessment
        </Typography>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              label="Analysis"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.result.analysis}
              name="result.analysis"
              onChange={formik.handleChange}
              error={
                formik.touched.result?.analysis &&
                Boolean(formik.errors.result?.analysis)
              }
              helperText={
                formik.touched.result?.analysis &&
                formik.errors.result?.analysis
              }
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Upload Report
        </Typography>
        <Grid container spacing={2} marginBottom={2}>
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
          <Grid item xs={12}>
            <FileList
              files={investigation?.result?.files || []}
              title="Uploaded Files"
            />
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
              error={
                formik.touched.result?.description &&
                Boolean(formik.errors.result?.description)
              }
              helperText={
                formik.touched.result?.description &&
                formik.errors.result?.description
              }
            />
          </Grid>
        </Grid>

        {/* </Grid> */}

        {/* <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>Reference Values For Semen Analysis</Typography>
      <SemenAnalysisTable /> */}

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Disclaimer
        </Typography>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              label="Disclaimer"
              name="result.disclaimer"
              value={formik.values.result.disclaimer}
              multiline
              minRows={2}
              fullWidth
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

export default SemenAnalysis;
