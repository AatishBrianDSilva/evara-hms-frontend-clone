import React, { useContext } from "react";
import { Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { IPatientTreatmentCycleReport } from "../../../../../types/patientDashboard/treatmentCycle";
import { useToast } from "../../../../../context/ToastContext";
import { useSelector } from "react-redux";
import {
  useEditTreatmentCycleMutation,
  useGetTreatmentCyclesQuery,
} from "../../../../../services/patientDashboardService/treatmentCycleApi";
import ModalContext from "../../../../../context/ModalContext";
import { RootState } from "../../../../../app/store";
import FileUploadButton from "../../../../../components/FileUploadAndPreview/FileUploadButton";
import { EBuckets, EDocumentTypes } from "../../../../../types/global";
import _ from "lodash";
import CustomDatePicker from "../../../../../components/CustomDatePicker/CustomDatePicker";

interface IFormValues {
  oocytePickUpDate: Date;
  noOfOocytesRetrieved: string;
  noOfMatureOocytes: string;
  noOfImmatureOocytes: string;
  oocyteQuality: string;
  spermParameters: string;
  oocytesICSI: string;
  fertilizedICSI: string;
  spermProcessingMethod: string;
  spermSelection: string;
  noOfEmbryosTransferred: string;
  noOfEmbryosFrozen: string;
  embryosDiscarded: string;
  medication: string;

  // CHECKLIST FOR IVF
  isFemaleHistorySheetCompleted: string;
  areViralMarkersDoneFemale: string;
  resultViralMarkersFemale: string;
  areViralMarkersDoneMale: string;
  financialTermsAndConditionsForART: string;
  embryologistInformedTimingOfHCG: string;
  mockTransfer: string;
  explainDSProcedureAndConsent: string;
  spermFreezingBackup: string;
  medicationUsed: string;
  discussConsentForms: string;
  discussSuccessRatesOfART: string;
  isMaleHistorySheetCompleted: string;
  laparoscopy: string;
  hysteroscopy: string;
  UCL: string;
  uterus: string;
  discussTreatment: string;
  protocolLongShort: string;
  stimulationRecagonMenopur: string;
  // female factors
  hypoComments: string;
  galactorrhoeaComments: string;
  hyperAndrogenemiaComments: string;
  scan3D: string;
  scan2D: string;
  thinEndometriumIntervention: string;
  tubalFactorComments: string;
  adenomyosisGradeAndComments: string;
  fibroidsFIGOClassification: string;
  fibroidsNumberAndSize: string;
  // summary
  selfOrDonorOocytes: string;

  reasonForART: string;
  maleFactor: string;
  // infections
  stdComments: string;
  tuberculosisComments: string;
  historyOfPelvicInfectionsComments: string;
  // pretreatments
  lmp: Date;
  // previous treatments
  primaryOrSecondaryInfertility: string;
  durationOfInfertility: string;
  // stimulation
  downRegulation: string;
  dateOfStimulation: Date;
  stimulationProtocol: string;
  // surgical history
  hysteroscopyFindings: string;
  laparoscopyFindings: string;
  laparotomyFindings: string;
  // female investigations
  lh: string;
  cd138: string;
  e2: string;
  fshDay2: string;
  afcLeftComments: string;
  afcRightComments: string;
  amh: string;
  // trigger
  postTriggerLH: string;
  postTriggerProgesterone: string;
  triggerDate: Date;
  triggerComments: string;
  trigger: string;
  preTriggerLH: string;
  preTriggerProgesterone: string;
  preTriggerE2: string;
  repeat12HrsTrigger: string;
  triggerTime: string;
  endometrialThicknessOnDayOfTrigger: string;
  e2OnDayOfTrigger: string;
  // male factors
  diabetesComments: string;
  bloodGroup: string;
  bmi: string;
  smokingComments: string;
  alcoholConsumptionComments: string;
  hypertensionComments: string;
  thyroidDisorderComments: string;
  hyperprolactinemiaComments: string;
  androgenemiaComments: string;
  stdDiagnosis: string;
  varicocele: string;
  hypoHypoComments: string;
  traumaComments: string;
  ejaculatoryDysfunctionComments: string;
  // oocyte aspiration
  anaesthetist: string;
  surgeonOPU: string;
  opuDate: Date;
  specificAbnormalitiesInOocytes: string;
  immatureOocytes: string;
  matureOocytes: string;
  differenceBetweenTriggerAndOPU: string;
  selfOrDonor: string;
  noOfFolliclesGreaterThan14mmAtTrigger: string;
  // male investigaiton
  thalassemiaScreeningComments: string;
  geneticTestingComments: string;
  viralMarkers: string;
  postEjaculatoryUrineExamination: string;
  viralMarkersComments: string;
  // male examination
  surgicalHistory: string;
  localExaminationLeft: string;
  localExaminationRight: string;
  // sperm details
  selfOrDonorSperm: string;
  freezing: string;
  spermCollectionRetrievalTechnique: string;
  spermQualityAtOPU: string;
  summary: string;
}

interface IVFCycleSummaryProps {
  contentProps: {
    report: IPatientTreatmentCycleReport;
    treatmentCycleId: string;
  };
}

const IVFCycleSummary: React.FC<IVFCycleSummaryProps> = ({ contentProps }) => {
  const { report, treatmentCycleId } = contentProps;

  const { closeModal } = useContext(ModalContext);
  const { showPromiseToast } = useToast();

  const patient = useSelector((state: RootState) => state.patients.patient);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>([""]);

  const [updateReport, { isLoading }] = useEditTreatmentCycleMutation();

  const { data: treatmentCyclesData } = useGetTreatmentCyclesQuery(
    {
      filters: {
        patientCode: patient?.patientId,
      },
      sort: {
        createdAt: -1,
      },
    },
    {
      skip: !patient?.patientId,
    }
  );

  const patientTreatmentCycles = treatmentCyclesData?.data || [];

  // Find the specific treatment cycle by ID
  const currentTreatmentCycle = patientTreatmentCycles.find(
    (cycle) => cycle._id === treatmentCycleId
  );

  // Find the specific report by category and ID
  const currentReport = currentTreatmentCycle?.reports.find((r) => r._id === report._id);

  const initialValues = {
    oocytePickUpDate: currentReport?.details?.oocytePickUpDate || "",
    noOfOocytesRetrieved: currentReport?.details?.noOfOocytesRetrieved || "",
    noOfMatureOocytes: currentReport?.details?.noOfMatureOocytes || "",
    noOfImmatureOocytes: currentReport?.details?.noOfImmatureOocytes || "",
    oocyteQuality: currentReport?.details?.oocyteQuality || "",
    spermParameters: currentReport?.details?.spermParameters || "",
    oocytesICSI: currentReport?.details?.oocytesICSI || "",
    fertilizedICSI: currentReport?.details?.fertilizedICSI || "",
    spermProcessingMethod: currentReport?.details?.spermProcessingMethod || "",
    spermSelection: currentReport?.details?.spermSelection || "",
    noOfEmbryosTransferred: currentReport?.details?.noOfEmbryosTransferred || "",
    noOfEmbryosFrozen: currentReport?.details?.noOfEmbryosFrozen || "",
    embryosDiscarded: currentReport?.details?.embryosDiscarded || "",
    medication: currentReport?.details?.medication || "",

    isFemaleHistorySheetCompleted: currentReport?.details?.isFemaleHistorySheetCompleted || "",
    areViralMarkersDoneFemale: currentReport?.details?.areViralMarkersDoneFemale || "",
    resultViralMarkersFemale: currentReport?.details?.resultViralMarkersFemale || "",
    areViralMarkersDoneMale: currentReport?.details?.areViralMarkersDoneMale || "",
    financialTermsAndConditionsForART:
      currentReport?.details?.financialTermsAndConditionsForART || "",
    embryologistInformedTimingOfHCG: currentReport?.details?.embryologistInformedTimingOfHCG || "",
    mockTransfer: currentReport?.details?.mockTransfer || "",
    explainDSProcedureAndConsent: currentReport?.details?.explainDSProcedureAndConsent || "",
    spermFreezingBackup: currentReport?.details?.spermFreezingBackup || "",
    medicationUsed: currentReport?.details?.medicationUsed || "",
    discussConsentForms: currentReport?.details?.discussConsentForms || "",
    discussSuccessRatesOfART: currentReport?.details?.discussSuccessRatesOfART || "",
    isMaleHistorySheetCompleted: currentReport?.details?.isMaleHistorySheetCompleted || "",
    laparoscopy: currentReport?.details?.laparoscopy || "",
    hysteroscopy: currentReport?.details?.hysteroscopy || "",
    UCL: currentReport?.details?.UCL || "",
    uterus: currentReport?.details?.uterus || "",
    discussTreatment: currentReport?.details?.discussTreatment || "",
    protocolLongShort: currentReport?.details?.protocolLongShort || "",
    stimulationRecagonMenopur: currentReport?.details?.stimulationRecagonMenopur || "",
    hypoComments: currentReport?.details?.hypoComments || "",
    galactorrhoeaComments: currentReport?.details?.galactorrhoeaComments || "",
    hyperAndrogenemiaComments: currentReport?.details?.hyperAndrogenemiaComments || "",
    scan3D: currentReport?.details?.scan3D || "",
    scan2D: currentReport?.details?.scan2D || "",
    thinEndometriumIntervention: currentReport?.details?.thinEndometriumIntervention || "",
    tubalFactorComments: currentReport?.details?.tubalFactorComments || "",
    adenomyosisGradeAndComments: currentReport?.details?.adenomyosisGradeAndComments || "",
    fibroidsFIGOClassification: currentReport?.details?.fibroidsFIGOClassification || "",
    fibroidsNumberAndSize: currentReport?.details?.fibroidsNumberAndSize || "",
    selfOrDonorOocytes: currentReport?.details?.selfOrDonorOocytes || "",

    reasonForART: currentReport?.details?.reasonForART || "",
    maleFactor: currentReport?.details?.maleFactor || "",
    stdComments: currentReport?.details?.stdComments || "",
    tuberculosisComments: currentReport?.details?.tuberculosisComments || "",
    historyOfPelvicInfectionsComments:
      currentReport?.details?.historyOfPelvicInfectionsComments || "",
    lmp: currentReport?.details?.lmp || null,
    primaryOrSecondaryInfertility: currentReport?.details?.primaryOrSecondaryInfertility || "",
    durationOfInfertility: currentReport?.details?.durationOfInfertility || "",
    downRegulation: currentReport?.details?.downRegulation || "",
    dateOfStimulation: currentReport?.details?.dateOfStimulation || null,
    stimulationProtocol: currentReport?.details?.stimulationProtocol || "",
    hysteroscopyFindings: currentReport?.details?.hysteroscopyFindings || "",
    laparoscopyFindings: currentReport?.details?.laparoscopyFindings || "",
    laparotomyFindings: currentReport?.details?.laparotomyFindings || "",
    lh: currentReport?.details?.lh || "",
    cd138: currentReport?.details?.cd138 || "",
    e2: currentReport?.details?.e2 || "",
    fshDay2: currentReport?.details?.fshDay2 || "",
    afcLeftComments: currentReport?.details?.afcLeftComments || "",
    afcRightComments: currentReport?.details?.afcRightComments || "",
    amh: currentReport?.details?.amh || "",
    postTriggerLH: currentReport?.details?.postTriggerLH || "",
    postTriggerProgesterone: currentReport?.details?.postTriggerProgesterone || "",
    triggerDate: currentReport?.details?.triggerDate || null,
    triggerComments: currentReport?.details?.triggerComments || "",
    trigger: currentReport?.details?.trigger || "",
    preTriggerLH: currentReport?.details?.preTriggerLH || "",
    preTriggerProgesterone: currentReport?.details?.preTriggerProgesterone || "",
    preTriggerE2: currentReport?.details?.preTriggerE2 || "",
    repeat12HrsTrigger: currentReport?.details?.repeat12HrsTrigger || "",
    triggerTime: currentReport?.details?.triggerTime || "",
    endometrialThicknessOnDayOfTrigger:
      currentReport?.details?.endometrialThicknessOnDayOfTrigger || "",
    e2OnDayOfTrigger: currentReport?.details?.e2OnDayOfTrigger || "",
    diabetesComments: currentReport?.details?.diabetesComments || "",
    bloodGroup: currentReport?.details?.bloodGroup || "",
    bmi: currentReport?.details?.bmi || "",
    smokingComments: currentReport?.details?.smokingComments || "",
    alcoholConsumptionComments: currentReport?.details?.alcoholConsumptionComments || "",
    hypertensionComments: currentReport?.details?.hypertensionComments || "",
    thyroidDisorderComments: currentReport?.details?.thyroidDisorderComments || "",
    hyperprolactinemiaComments: currentReport?.details?.hyperprolactinemiaComments || "",
    androgenemiaComments: currentReport?.details?.androgenemiaComments || "",
    stdDiagnosis: currentReport?.details?.stdDiagnosis || "",
    varicocele: currentReport?.details?.varicocele || "",
    hypoHypoComments: currentReport?.details?.hypoHypoComments || "",
    traumaComments: currentReport?.details?.traumaComments || "",
    ejaculatoryDysfunctionComments: currentReport?.details?.ejaculatoryDysfunctionComments || "",
    anaesthetist: currentReport?.details?.anaesthetist || "",
    surgeonOPU: currentReport?.details?.surgeonOPU || "",
    opuDate: currentReport?.details?.opuDate || null,
    specificAbnormalitiesInOocytes: currentReport?.details?.specificAbnormalitiesInOocytes || "",
    immatureOocytes: currentReport?.details?.immatureOocytes || "",
    matureOocytes: currentReport?.details?.matureOocytes || "",
    differenceBetweenTriggerAndOPU: currentReport?.details?.differenceBetweenTriggerAndOPU || "",
    selfOrDonor: currentReport?.details?.selfOrDonor || "",
    noOfFolliclesGreaterThan14mmAtTrigger:
      currentReport?.details?.noOfFolliclesGreaterThan14mmAtTrigger || "",
    thalassemiaScreeningComments: currentReport?.details?.thalassemiaScreeningComments || "",
    geneticTestingComments: currentReport?.details?.geneticTestingComments || "",
    viralMarkers: currentReport?.details?.viralMarkers || "",
    postEjaculatoryUrineExamination: currentReport?.details?.postEjaculatoryUrineExamination || "",
    viralMarkersComments: currentReport?.details?.viralMarkersComments || "",
    surgicalHistory: currentReport?.details?.surgicalHistory || "",
    localExaminationLeft: currentReport?.details?.localExaminationLeft || "",
    localExaminationRight: currentReport?.details?.localExaminationRight || "",
    selfOrDonorSperm: currentReport?.details?.selfOrDonorSperm || "",
    freezing: currentReport?.details?.freezing || "",
    spermCollectionRetrievalTechnique:
      currentReport?.details?.spermCollectionRetrievalTechnique || "",
    spermQualityAtOPU: currentReport?.details?.spermQualityAtOPU || "",
    summary: currentReport?.details?.summary || "",
  };

  const handleFormSubmit = async (values: IFormValues) => {
    const options = {
      conditions: {
        editType: "update",
        category: report.category,
      },
    };

    const payload = {
      id: treatmentCycleId,
      details: {
        ...values,
        files: fileUploadedUrl,
      },
      documentId: report._id,
    };

    const promise = updateReport({ payload, options }).unwrap();

    showPromiseToast(promise, {
      loading: "Saving OPU Report...",
      success: (data) => data.message || "OPU Report Updated Successfully",
      error: (data) => data.message || "Error Updating OPU Report",
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} p={2}>
      <Typography variant="h4" align="center" color="primary">
        IVF Cycle Summary
      </Typography>
      <Typography variant="h6" pb={2}>
        OPU Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CustomDatePicker
            label="Oocyte Pick up Date"
            value={formik.values.oocytePickUpDate}
            onChange={(date) => formik.setFieldValue("oocytePickUpDate", date, true)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="noOfOocytesRetrieved"
            label="No. of Oocytes retrieved"
            type="number"
            fullWidth
            value={formik.values.noOfOocytesRetrieved}
            onChange={formik.handleChange}
            error={
              formik.touched.noOfOocytesRetrieved && Boolean(formik.errors.noOfOocytesRetrieved)
            }
            helperText={formik.touched.noOfOocytesRetrieved && formik.errors.noOfOocytesRetrieved}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="noOfMatureOocytes"
            label="No. of Mature oocytes"
            type="number"
            fullWidth
            value={formik.values.noOfMatureOocytes}
            onChange={formik.handleChange}
            error={formik.touched.noOfMatureOocytes && Boolean(formik.errors.noOfMatureOocytes)}
            helperText={formik.touched.noOfMatureOocytes && formik.errors.noOfMatureOocytes}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="noOfImmatureOocytes"
            label="No. of Immature oocytes"
            type="number"
            fullWidth
            value={formik.values.noOfImmatureOocytes}
            onChange={formik.handleChange}
            error={formik.touched.noOfImmatureOocytes && Boolean(formik.errors.noOfImmatureOocytes)}
            helperText={formik.touched.noOfImmatureOocytes && formik.errors.noOfImmatureOocytes}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="oocyteQuality"
            label="Oocyte Quality"
            fullWidth
            value={formik.values.oocyteQuality}
            onChange={formik.handleChange}
            error={formik.touched.oocyteQuality && Boolean(formik.errors.oocyteQuality)}
            helperText={formik.touched.oocyteQuality && formik.errors.oocyteQuality}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="spermParameters"
            label="Sperm Parameters"
            fullWidth
            value={formik.values.spermParameters}
            onChange={formik.handleChange}
            error={formik.touched.spermParameters && Boolean(formik.errors.spermParameters)}
            helperText={formik.touched.spermParameters && formik.errors.spermParameters}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="oocytesICSI"
            label="Oocytes ICSI"
            fullWidth
            value={formik.values.oocytesICSI}
            onChange={formik.handleChange}
            error={formik.touched.oocytesICSI && Boolean(formik.errors.oocytesICSI)}
            helperText={formik.touched.oocytesICSI && formik.errors.oocytesICSI}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="fertilizedICSI"
            label="Fertilized ICSI"
            fullWidth
            value={formik.values.fertilizedICSI}
            onChange={formik.handleChange}
            error={formik.touched.fertilizedICSI && Boolean(formik.errors.fertilizedICSI)}
            helperText={formik.touched.fertilizedICSI && formik.errors.fertilizedICSI}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="spermProcessingMethod"
            label="Sperm Processing Method"
            fullWidth
            value={formik.values.spermProcessingMethod}
            onChange={formik.handleChange}
            error={
              formik.touched.spermProcessingMethod && Boolean(formik.errors.spermProcessingMethod)
            }
            helperText={formik.touched.spermProcessingMethod && formik.errors.spermProcessingMethod}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="spermSelection"
            label="Sperm Selection"
            fullWidth
            value={formik.values.spermSelection}
            onChange={formik.handleChange}
            error={formik.touched.spermSelection && Boolean(formik.errors.spermSelection)}
            helperText={formik.touched.spermSelection && formik.errors.spermSelection}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="noOfEmbryosTransferred"
            label="No. of Embryos Transferred"
            type="number"
            fullWidth
            value={formik.values.noOfEmbryosTransferred}
            onChange={formik.handleChange}
            error={
              formik.touched.noOfEmbryosTransferred && Boolean(formik.errors.noOfEmbryosTransferred)
            }
            helperText={
              formik.touched.noOfEmbryosTransferred && formik.errors.noOfEmbryosTransferred
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="noOfEmbryosFrozen"
            label="No. of Embryos Frozen"
            type="number"
            fullWidth
            value={formik.values.noOfEmbryosFrozen}
            onChange={formik.handleChange}
            error={formik.touched.noOfEmbryosFrozen && Boolean(formik.errors.noOfEmbryosFrozen)}
            helperText={formik.touched.noOfEmbryosFrozen && formik.errors.noOfEmbryosFrozen}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="embryosDiscarded"
            label="Embryos Discarded"
            type="number"
            fullWidth
            value={formik.values.embryosDiscarded}
            onChange={formik.handleChange}
            error={formik.touched.embryosDiscarded && Boolean(formik.errors.embryosDiscarded)}
            helperText={formik.touched.embryosDiscarded && formik.errors.embryosDiscarded}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="medication"
            label="Medication"
            fullWidth
            value={formik.values.medication}
            onChange={formik.handleChange}
            error={formik.touched.medication && Boolean(formik.errors.medication)}
            helperText={formik.touched.medication && formik.errors.medication}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Checklist For IVF
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="isFemaleHistorySheetCompleted"
            label="Is Female History Sheet Completed"
            fullWidth
            select
            value={formik.values.isFemaleHistorySheetCompleted}
            onChange={formik.handleChange}
            error={
              formik.touched.isFemaleHistorySheetCompleted &&
              Boolean(formik.errors.isFemaleHistorySheetCompleted)
            }
            helperText={
              formik.touched.isFemaleHistorySheetCompleted &&
              formik.errors.isFemaleHistorySheetCompleted
            }
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="areViralMarkersDoneFemale"
            label="Are Viral Markers Done (Female)"
            fullWidth
            select
            value={formik.values.areViralMarkersDoneFemale}
            onChange={formik.handleChange}
            error={
              formik.touched.areViralMarkersDoneFemale &&
              Boolean(formik.errors.areViralMarkersDoneFemale)
            }
            helperText={
              formik.touched.areViralMarkersDoneFemale && formik.errors.areViralMarkersDoneFemale
            }
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="resultViralMarkersFemale"
            label="Result of Viral Markers (Female)"
            fullWidth
            value={formik.values.resultViralMarkersFemale}
            onChange={formik.handleChange}
            error={
              formik.touched.resultViralMarkersFemale &&
              Boolean(formik.errors.resultViralMarkersFemale)
            }
            helperText={
              formik.touched.resultViralMarkersFemale && formik.errors.resultViralMarkersFemale
            }
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="areViralMarkersDoneMale"
            label="Are Viral Markers Done (Male)"
            fullWidth
            select
            value={formik.values.areViralMarkersDoneMale}
            onChange={formik.handleChange}
            error={
              formik.touched.areViralMarkersDoneMale &&
              Boolean(formik.errors.areViralMarkersDoneMale)
            }
            helperText={
              formik.touched.areViralMarkersDoneMale && formik.errors.areViralMarkersDoneMale
            }
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="financialTermsAndConditionsForART"
            label="Financial Terms & Conditions for ART"
            fullWidth
            select
            value={formik.values.financialTermsAndConditionsForART}
            onChange={formik.handleChange}
            error={
              formik.touched.financialTermsAndConditionsForART &&
              Boolean(formik.errors.financialTermsAndConditionsForART)
            }
            helperText={
              formik.touched.financialTermsAndConditionsForART &&
              formik.errors.financialTermsAndConditionsForART
            }
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="embryologistInformedTimingOfHCG"
            label="Embryologist Informed Timing of HCG"
            fullWidth
            select
            value={formik.values.embryologistInformedTimingOfHCG}
            onChange={formik.handleChange}
            error={
              formik.touched.embryologistInformedTimingOfHCG &&
              Boolean(formik.errors.embryologistInformedTimingOfHCG)
            }
            helperText={
              formik.touched.embryologistInformedTimingOfHCG &&
              formik.errors.embryologistInformedTimingOfHCG
            }
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="mockTransfer"
            label="Mock Transfer"
            fullWidth
            select
            value={formik.values.mockTransfer}
            onChange={formik.handleChange}
            error={formik.touched.mockTransfer && Boolean(formik.errors.mockTransfer)}
            helperText={formik.touched.mockTransfer && formik.errors.mockTransfer}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="explainDSProcedureAndConsent"
            label="Explain DS Procedure and Consent"
            fullWidth
            select
            value={formik.values.explainDSProcedureAndConsent}
            onChange={formik.handleChange}
            error={
              formik.touched.explainDSProcedureAndConsent &&
              Boolean(formik.errors.explainDSProcedureAndConsent)
            }
            helperText={
              formik.touched.explainDSProcedureAndConsent &&
              formik.errors.explainDSProcedureAndConsent
            }
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="spermFreezingBackup"
            label="Sperm Freezing Backup"
            fullWidth
            select
            value={formik.values.spermFreezingBackup}
            onChange={formik.handleChange}
            error={formik.touched.spermFreezingBackup && Boolean(formik.errors.spermFreezingBackup)}
            helperText={formik.touched.spermFreezingBackup && formik.errors.spermFreezingBackup}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="medicationUsed"
            label="Medication Used"
            fullWidth
            value={formik.values.medicationUsed}
            onChange={formik.handleChange}
            error={formik.touched.medicationUsed && Boolean(formik.errors.medicationUsed)}
            helperText={formik.touched.medicationUsed && formik.errors.medicationUsed}
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="discussConsentForms"
            label="Discuss Consent Forms"
            fullWidth
            select
            value={formik.values.discussConsentForms}
            onChange={formik.handleChange}
            error={formik.touched.discussConsentForms && Boolean(formik.errors.discussConsentForms)}
            helperText={formik.touched.discussConsentForms && formik.errors.discussConsentForms}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="discussSuccessRatesOfART"
            label="Discuss Success Rates of ART"
            fullWidth
            select
            value={formik.values.discussSuccessRatesOfART}
            onChange={formik.handleChange}
            error={
              formik.touched.discussSuccessRatesOfART &&
              Boolean(formik.errors.discussSuccessRatesOfART)
            }
            helperText={
              formik.touched.discussSuccessRatesOfART && formik.errors.discussSuccessRatesOfART
            }
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="isMaleHistorySheetCompleted"
            label="Is Male History Sheet Completed"
            fullWidth
            select
            value={formik.values.isMaleHistorySheetCompleted}
            onChange={formik.handleChange}
            error={
              formik.touched.isMaleHistorySheetCompleted &&
              Boolean(formik.errors.isMaleHistorySheetCompleted)
            }
            helperText={
              formik.touched.isMaleHistorySheetCompleted &&
              formik.errors.isMaleHistorySheetCompleted
            }
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="laparoscopy"
            label="Laparoscopy"
            fullWidth
            select
            value={formik.values.laparoscopy}
            onChange={formik.handleChange}
            error={formik.touched.laparoscopy && Boolean(formik.errors.laparoscopy)}
            helperText={formik.touched.laparoscopy && formik.errors.laparoscopy}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="hysteroscopy"
            label="Hysteroscopy"
            fullWidth
            select
            value={formik.values.hysteroscopy}
            onChange={formik.handleChange}
            error={formik.touched.hysteroscopy && Boolean(formik.errors.hysteroscopy)}
            helperText={formik.touched.hysteroscopy && formik.errors.hysteroscopy}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="UCL"
            label="UCL"
            fullWidth
            select
            value={formik.values.UCL}
            onChange={formik.handleChange}
            error={formik.touched.UCL && Boolean(formik.errors.UCL)}
            helperText={formik.touched.UCL && formik.errors.UCL}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="uterus"
            label="Uterus"
            fullWidth
            value={formik.values.uterus}
            onChange={formik.handleChange}
            error={formik.touched.uterus && Boolean(formik.errors.uterus)}
            helperText={formik.touched.uterus && formik.errors.uterus}
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="discussTreatment"
            label="Discuss Treatment"
            fullWidth
            select
            value={formik.values.discussTreatment}
            onChange={formik.handleChange}
            error={formik.touched.discussTreatment && Boolean(formik.errors.discussTreatment)}
            helperText={formik.touched.discussTreatment && formik.errors.discussTreatment}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="protocolLongShort"
            label="Protocol (Long/Short)"
            fullWidth
            value={formik.values.protocolLongShort}
            onChange={formik.handleChange}
            error={formik.touched.protocolLongShort && Boolean(formik.errors.protocolLongShort)}
            helperText={formik.touched.protocolLongShort && formik.errors.protocolLongShort}
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="stimulationRecagonMenopur"
            label="Stimulation (Recagon/Menopur)"
            fullWidth
            value={formik.values.stimulationRecagonMenopur}
            onChange={formik.handleChange}
            error={
              formik.touched.stimulationRecagonMenopur &&
              Boolean(formik.errors.stimulationRecagonMenopur)
            }
            helperText={
              formik.touched.stimulationRecagonMenopur && formik.errors.stimulationRecagonMenopur
            }
          ></TextField>
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Female Factors
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="hypoComments"
            label="Hypo Comments"
            fullWidth
            value={formik.values.hypoComments}
            onChange={formik.handleChange}
            error={formik.touched.hypoComments && Boolean(formik.errors.hypoComments)}
            helperText={formik.touched.hypoComments && formik.errors.hypoComments}
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="galactorrhoeaComments"
            label="Galactorrhoea Comments"
            fullWidth
            value={formik.values.galactorrhoeaComments}
            onChange={formik.handleChange}
            error={
              formik.touched.galactorrhoeaComments && Boolean(formik.errors.galactorrhoeaComments)
            }
            helperText={formik.touched.galactorrhoeaComments && formik.errors.galactorrhoeaComments}
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="hyperAndrogenemiaComments"
            label="Hyper Androgenemia Comments"
            fullWidth
            value={formik.values.hyperAndrogenemiaComments}
            onChange={formik.handleChange}
            error={
              formik.touched.hyperAndrogenemiaComments &&
              Boolean(formik.errors.hyperAndrogenemiaComments)
            }
            helperText={
              formik.touched.hyperAndrogenemiaComments && formik.errors.hyperAndrogenemiaComments
            }
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="scan3D"
            label="3D Scan"
            fullWidth
            select
            value={formik.values.scan3D}
            onChange={formik.handleChange}
            error={formik.touched.scan3D && Boolean(formik.errors.scan3D)}
            helperText={formik.touched.scan3D && formik.errors.scan3D}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="scan2D"
            label="2D Scan"
            fullWidth
            select
            value={formik.values.scan2D}
            onChange={formik.handleChange}
            error={formik.touched.scan2D && Boolean(formik.errors.scan2D)}
            helperText={formik.touched.scan2D && formik.errors.scan2D}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="thinEndometriumIntervention"
            label="Thin Endometrium Intervention"
            fullWidth
            select
            value={formik.values.thinEndometriumIntervention}
            onChange={formik.handleChange}
            error={
              formik.touched.thinEndometriumIntervention &&
              Boolean(formik.errors.thinEndometriumIntervention)
            }
            helperText={
              formik.touched.thinEndometriumIntervention &&
              formik.errors.thinEndometriumIntervention
            }
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="tubalFactorComments"
            label="Tubal Factor Comments"
            fullWidth
            value={formik.values.tubalFactorComments}
            onChange={formik.handleChange}
            error={formik.touched.tubalFactorComments && Boolean(formik.errors.tubalFactorComments)}
            helperText={formik.touched.tubalFactorComments && formik.errors.tubalFactorComments}
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="adenomyosisGradeAndComments"
            label="Adenomyosis Grade and Comments"
            fullWidth
            value={formik.values.adenomyosisGradeAndComments}
            onChange={formik.handleChange}
            error={
              formik.touched.adenomyosisGradeAndComments &&
              Boolean(formik.errors.adenomyosisGradeAndComments)
            }
            helperText={
              formik.touched.adenomyosisGradeAndComments &&
              formik.errors.adenomyosisGradeAndComments
            }
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="fibroidsFIGOClassification"
            label="Fibroids FIGO Classification"
            fullWidth
            value={formik.values.fibroidsFIGOClassification}
            onChange={formik.handleChange}
            error={
              formik.touched.fibroidsFIGOClassification &&
              Boolean(formik.errors.fibroidsFIGOClassification)
            }
            helperText={
              formik.touched.fibroidsFIGOClassification && formik.errors.fibroidsFIGOClassification
            }
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="fibroidsNumberAndSize"
            label="Fibroids Number and Size"
            fullWidth
            value={formik.values.fibroidsNumberAndSize}
            onChange={formik.handleChange}
            error={
              formik.touched.fibroidsNumberAndSize && Boolean(formik.errors.fibroidsNumberAndSize)
            }
            helperText={formik.touched.fibroidsNumberAndSize && formik.errors.fibroidsNumberAndSize}
          ></TextField>
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="selfOrDonorOocytes"
            label="Self or Donor Oocytes"
            fullWidth
            value={formik.values.selfOrDonorOocytes}
            onChange={formik.handleChange}
            error={formik.touched.selfOrDonorOocytes && Boolean(formik.errors.selfOrDonorOocytes)}
            helperText={formik.touched.selfOrDonorOocytes && formik.errors.selfOrDonorOocytes}
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="reasonForART"
            label="Reason for ART"
            fullWidth
            value={formik.values.reasonForART}
            onChange={formik.handleChange}
            error={formik.touched.reasonForART && Boolean(formik.errors.reasonForART)}
            helperText={formik.touched.reasonForART && formik.errors.reasonForART}
          ></TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="maleFactor"
            label="Male Factor"
            fullWidth
            value={formik.values.maleFactor}
            onChange={formik.handleChange}
            error={formik.touched.maleFactor && Boolean(formik.errors.maleFactor)}
            helperText={formik.touched.maleFactor && formik.errors.maleFactor}
          ></TextField>
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Infections
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="stdComments"
            label="STD Comments"
            fullWidth
            value={formik.values.stdComments}
            onChange={formik.handleChange}
            error={formik.touched.stdComments && Boolean(formik.errors.stdComments)}
            helperText={formik.touched.stdComments && formik.errors.stdComments}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="tuberculosisComments"
            label="Tuberculosis Comments"
            fullWidth
            value={formik.values.tuberculosisComments}
            onChange={formik.handleChange}
            error={
              formik.touched.tuberculosisComments && Boolean(formik.errors.tuberculosisComments)
            }
            helperText={formik.touched.tuberculosisComments && formik.errors.tuberculosisComments}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="historyOfPelvicInfectionsComments"
            label="History of Pelvic Infections Comments"
            fullWidth
            value={formik.values.historyOfPelvicInfectionsComments}
            onChange={formik.handleChange}
            error={
              formik.touched.historyOfPelvicInfectionsComments &&
              Boolean(formik.errors.historyOfPelvicInfectionsComments)
            }
            helperText={
              formik.touched.historyOfPelvicInfectionsComments &&
              formik.errors.historyOfPelvicInfectionsComments
            }
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Pre-Treatments
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CustomDatePicker
            label="LMP"
            value={formik.values.lmp}
            onChange={(date) => formik.setFieldValue("lmp", date, true)}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Previous Treatments
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="primaryOrSecondaryInfertility"
            label="Primary or Secondary Infertility"
            fullWidth
            value={formik.values.primaryOrSecondaryInfertility}
            onChange={formik.handleChange}
            error={
              formik.touched.primaryOrSecondaryInfertility &&
              Boolean(formik.errors.primaryOrSecondaryInfertility)
            }
            helperText={
              formik.touched.primaryOrSecondaryInfertility &&
              formik.errors.primaryOrSecondaryInfertility
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="durationOfInfertility"
            label="Duration of Infertility"
            fullWidth
            value={formik.values.durationOfInfertility}
            onChange={formik.handleChange}
            error={
              formik.touched.durationOfInfertility && Boolean(formik.errors.durationOfInfertility)
            }
            helperText={formik.touched.durationOfInfertility && formik.errors.durationOfInfertility}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Stimulation
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="downRegulation"
            label="Down Regulation"
            fullWidth
            value={formik.values.downRegulation}
            onChange={formik.handleChange}
            error={formik.touched.downRegulation && Boolean(formik.errors.downRegulation)}
            helperText={formik.touched.downRegulation && formik.errors.downRegulation}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CustomDatePicker
            label="Date Of Stimulation"
            value={formik.values.dateOfStimulation}
            onChange={(date) => formik.setFieldValue("dateOfStimulation", date, true)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="stimulationProtocol"
            label="Stimulation Protocol"
            fullWidth
            value={formik.values.stimulationProtocol}
            onChange={formik.handleChange}
            error={formik.touched.stimulationProtocol && Boolean(formik.errors.stimulationProtocol)}
            helperText={formik.touched.stimulationProtocol && formik.errors.stimulationProtocol}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Surgical History
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="hysteroscopyFindings"
            label="Hysteroscopy Findings"
            fullWidth
            value={formik.values.hysteroscopyFindings}
            onChange={formik.handleChange}
            error={
              formik.touched.hysteroscopyFindings && Boolean(formik.errors.hysteroscopyFindings)
            }
            helperText={formik.touched.hysteroscopyFindings && formik.errors.hysteroscopyFindings}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="laparoscopyFindings"
            label="Laparoscopy Findings"
            fullWidth
            value={formik.values.laparoscopyFindings}
            onChange={formik.handleChange}
            error={formik.touched.laparoscopyFindings && Boolean(formik.errors.laparoscopyFindings)}
            helperText={formik.touched.laparoscopyFindings && formik.errors.laparoscopyFindings}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="laparotomyFindings"
            label="Laparotomy Findings"
            fullWidth
            value={formik.values.laparotomyFindings}
            onChange={formik.handleChange}
            error={formik.touched.laparotomyFindings && Boolean(formik.errors.laparotomyFindings)}
            helperText={formik.touched.laparotomyFindings && formik.errors.laparotomyFindings}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Female Investigations
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="lh"
            label="LH"
            fullWidth
            value={formik.values.lh}
            onChange={formik.handleChange}
            error={formik.touched.lh && Boolean(formik.errors.lh)}
            helperText={formik.touched.lh && formik.errors.lh}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="cd138"
            label="CD138"
            fullWidth
            value={formik.values.cd138}
            onChange={formik.handleChange}
            error={formik.touched.cd138 && Boolean(formik.errors.cd138)}
            helperText={formik.touched.cd138 && formik.errors.cd138}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="e2"
            label="E2"
            fullWidth
            value={formik.values.e2}
            onChange={formik.handleChange}
            error={formik.touched.e2 && Boolean(formik.errors.e2)}
            helperText={formik.touched.e2 && formik.errors.e2}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="fshDay2"
            label="FSH Day 2"
            fullWidth
            value={formik.values.fshDay2}
            onChange={formik.handleChange}
            error={formik.touched.fshDay2 && Boolean(formik.errors.fshDay2)}
            helperText={formik.touched.fshDay2 && formik.errors.fshDay2}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="afcLeftComments"
            label="AFC Left Comments"
            fullWidth
            value={formik.values.afcLeftComments}
            onChange={formik.handleChange}
            error={formik.touched.afcLeftComments && Boolean(formik.errors.afcLeftComments)}
            helperText={formik.touched.afcLeftComments && formik.errors.afcLeftComments}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="afcRightComments"
            label="AFC Right Comments"
            fullWidth
            value={formik.values.afcRightComments}
            onChange={formik.handleChange}
            error={formik.touched.afcRightComments && Boolean(formik.errors.afcRightComments)}
            helperText={formik.touched.afcRightComments && formik.errors.afcRightComments}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="amh"
            label="AMH"
            fullWidth
            value={formik.values.amh}
            onChange={formik.handleChange}
            error={formik.touched.amh && Boolean(formik.errors.amh)}
            helperText={formik.touched.amh && formik.errors.amh}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Trigger
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="postTriggerLH"
            label="Post Trigger LH"
            fullWidth
            value={formik.values.postTriggerLH}
            onChange={formik.handleChange}
            error={formik.touched.postTriggerLH && Boolean(formik.errors.postTriggerLH)}
            helperText={formik.touched.postTriggerLH && formik.errors.postTriggerLH}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="postTriggerProgesterone"
            label="Post Trigger Progesterone"
            fullWidth
            value={formik.values.postTriggerProgesterone}
            onChange={formik.handleChange}
            error={
              formik.touched.postTriggerProgesterone &&
              Boolean(formik.errors.postTriggerProgesterone)
            }
            helperText={
              formik.touched.postTriggerProgesterone && formik.errors.postTriggerProgesterone
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CustomDatePicker
            label="Trigger Date"
            value={formik.values.triggerDate}
            onChange={(date) => formik.setFieldValue("triggerDate", date, true)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="triggerComments"
            label="Trigger Comments"
            fullWidth
            value={formik.values.triggerComments}
            onChange={formik.handleChange}
            error={formik.touched.triggerComments && Boolean(formik.errors.triggerComments)}
            helperText={formik.touched.triggerComments && formik.errors.triggerComments}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="trigger"
            label="Trigger"
            fullWidth
            value={formik.values.trigger}
            onChange={formik.handleChange}
            error={formik.touched.trigger && Boolean(formik.errors.trigger)}
            helperText={formik.touched.trigger && formik.errors.trigger}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="preTriggerLH"
            label="Pre Trigger LH"
            fullWidth
            value={formik.values.preTriggerLH}
            onChange={formik.handleChange}
            error={formik.touched.preTriggerLH && Boolean(formik.errors.preTriggerLH)}
            helperText={formik.touched.preTriggerLH && formik.errors.preTriggerLH}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="preTriggerProgesterone"
            label="Pre Trigger Progesterone"
            fullWidth
            value={formik.values.preTriggerProgesterone}
            onChange={formik.handleChange}
            error={
              formik.touched.preTriggerProgesterone && Boolean(formik.errors.preTriggerProgesterone)
            }
            helperText={
              formik.touched.preTriggerProgesterone && formik.errors.preTriggerProgesterone
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="preTriggerE2"
            label="Pre Trigger E2"
            fullWidth
            value={formik.values.preTriggerE2}
            onChange={formik.handleChange}
            error={formik.touched.preTriggerE2 && Boolean(formik.errors.preTriggerE2)}
            helperText={formik.touched.preTriggerE2 && formik.errors.preTriggerE2}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="repeat12HrsTrigger"
            label="Repeat 12 Hrs Trigger"
            fullWidth
            value={formik.values.repeat12HrsTrigger}
            onChange={formik.handleChange}
            error={formik.touched.repeat12HrsTrigger && Boolean(formik.errors.repeat12HrsTrigger)}
            helperText={formik.touched.repeat12HrsTrigger && formik.errors.repeat12HrsTrigger}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="triggerTime"
            label="Trigger Time"
            fullWidth
            value={formik.values.triggerTime}
            onChange={formik.handleChange}
            error={formik.touched.triggerTime && Boolean(formik.errors.triggerTime)}
            helperText={formik.touched.triggerTime && formik.errors.triggerTime}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="endometrialThicknessOnDayOfTrigger"
            label="Endometrial Thickness on Day of Trigger"
            fullWidth
            value={formik.values.endometrialThicknessOnDayOfTrigger}
            onChange={formik.handleChange}
            error={
              formik.touched.endometrialThicknessOnDayOfTrigger &&
              Boolean(formik.errors.endometrialThicknessOnDayOfTrigger)
            }
            helperText={
              formik.touched.endometrialThicknessOnDayOfTrigger &&
              formik.errors.endometrialThicknessOnDayOfTrigger
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="e2OnDayOfTrigger"
            label="E2 on Day of Trigger"
            fullWidth
            value={formik.values.e2OnDayOfTrigger}
            onChange={formik.handleChange}
            error={formik.touched.e2OnDayOfTrigger && Boolean(formik.errors.e2OnDayOfTrigger)}
            helperText={formik.touched.e2OnDayOfTrigger && formik.errors.e2OnDayOfTrigger}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Male Factors
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="diabetesComments"
            label="Diabetes Comments"
            fullWidth
            value={formik.values.diabetesComments}
            onChange={formik.handleChange}
            error={formik.touched.diabetesComments && Boolean(formik.errors.diabetesComments)}
            helperText={formik.touched.diabetesComments && formik.errors.diabetesComments}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="bloodGroup"
            label="Blood Group"
            fullWidth
            value={formik.values.bloodGroup}
            onChange={formik.handleChange}
            error={formik.touched.bloodGroup && Boolean(formik.errors.bloodGroup)}
            helperText={formik.touched.bloodGroup && formik.errors.bloodGroup}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="bmi"
            label="BMI"
            fullWidth
            value={formik.values.bmi}
            onChange={formik.handleChange}
            error={formik.touched.bmi && Boolean(formik.errors.bmi)}
            helperText={formik.touched.bmi && formik.errors.bmi}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="smokingComments"
            label="Smoking Comments"
            fullWidth
            value={formik.values.smokingComments}
            onChange={formik.handleChange}
            error={formik.touched.smokingComments && Boolean(formik.errors.smokingComments)}
            helperText={formik.touched.smokingComments && formik.errors.smokingComments}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="alcoholConsumptionComments"
            label="Alcohol Consumption Comments"
            fullWidth
            value={formik.values.alcoholConsumptionComments}
            onChange={formik.handleChange}
            error={
              formik.touched.alcoholConsumptionComments &&
              Boolean(formik.errors.alcoholConsumptionComments)
            }
            helperText={
              formik.touched.alcoholConsumptionComments && formik.errors.alcoholConsumptionComments
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="hypertensionComments"
            label="Hypertension Comments"
            fullWidth
            value={formik.values.hypertensionComments}
            onChange={formik.handleChange}
            error={
              formik.touched.hypertensionComments && Boolean(formik.errors.hypertensionComments)
            }
            helperText={formik.touched.hypertensionComments && formik.errors.hypertensionComments}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="thyroidDisorderComments"
            label="Thyroid Disorder Comments"
            fullWidth
            value={formik.values.thyroidDisorderComments}
            onChange={formik.handleChange}
            error={
              formik.touched.thyroidDisorderComments &&
              Boolean(formik.errors.thyroidDisorderComments)
            }
            helperText={
              formik.touched.thyroidDisorderComments && formik.errors.thyroidDisorderComments
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="hyperprolactinemiaComments"
            label="Hyperprolactinemia Comments"
            fullWidth
            value={formik.values.hyperprolactinemiaComments}
            onChange={formik.handleChange}
            error={
              formik.touched.hyperprolactinemiaComments &&
              Boolean(formik.errors.hyperprolactinemiaComments)
            }
            helperText={
              formik.touched.hyperprolactinemiaComments && formik.errors.hyperprolactinemiaComments
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="androgenemiaComments"
            label="Androgenemia Comments"
            fullWidth
            value={formik.values.androgenemiaComments}
            onChange={formik.handleChange}
            error={
              formik.touched.androgenemiaComments && Boolean(formik.errors.androgenemiaComments)
            }
            helperText={formik.touched.androgenemiaComments && formik.errors.androgenemiaComments}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="stdDiagnosis"
            label="STD Diagnosis"
            fullWidth
            value={formik.values.stdDiagnosis}
            onChange={formik.handleChange}
            error={formik.touched.stdDiagnosis && Boolean(formik.errors.stdDiagnosis)}
            helperText={formik.touched.stdDiagnosis && formik.errors.stdDiagnosis}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="varicocele"
            label="Varicocele"
            fullWidth
            value={formik.values.varicocele}
            onChange={formik.handleChange}
            error={formik.touched.varicocele && Boolean(formik.errors.varicocele)}
            helperText={formik.touched.varicocele && formik.errors.varicocele}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="hypoHypoComments"
            label="Hypo-Hypo Comments"
            fullWidth
            value={formik.values.hypoHypoComments}
            onChange={formik.handleChange}
            error={formik.touched.hypoHypoComments && Boolean(formik.errors.hypoHypoComments)}
            helperText={formik.touched.hypoHypoComments && formik.errors.hypoHypoComments}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="traumaComments"
            label="Trauma Comments"
            fullWidth
            value={formik.values.traumaComments}
            onChange={formik.handleChange}
            error={formik.touched.traumaComments && Boolean(formik.errors.traumaComments)}
            helperText={formik.touched.traumaComments && formik.errors.traumaComments}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="ejaculatoryDysfunctionComments"
            label="Ejaculatory Dysfunction Comments"
            fullWidth
            value={formik.values.ejaculatoryDysfunctionComments}
            onChange={formik.handleChange}
            error={
              formik.touched.ejaculatoryDysfunctionComments &&
              Boolean(formik.errors.ejaculatoryDysfunctionComments)
            }
            helperText={
              formik.touched.ejaculatoryDysfunctionComments &&
              formik.errors.ejaculatoryDysfunctionComments
            }
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Oocyte Aspiration
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="anaesthetist"
            label="Anaesthetist"
            fullWidth
            value={formik.values.anaesthetist}
            onChange={formik.handleChange}
            error={formik.touched.anaesthetist && Boolean(formik.errors.anaesthetist)}
            helperText={formik.touched.anaesthetist && formik.errors.anaesthetist}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="surgeonOPU"
            label="Surgeon OPU"
            fullWidth
            value={formik.values.surgeonOPU}
            onChange={formik.handleChange}
            error={formik.touched.surgeonOPU && Boolean(formik.errors.surgeonOPU)}
            helperText={formik.touched.surgeonOPU && formik.errors.surgeonOPU}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CustomDatePicker
            label="OPU Date"
            value={formik.values.opuDate}
            onChange={(date) => formik.setFieldValue("opuDate", date, true)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="specificAbnormalitiesInOocytes"
            label="Specific Abnormalities in Oocytes"
            fullWidth
            value={formik.values.specificAbnormalitiesInOocytes}
            onChange={formik.handleChange}
            error={
              formik.touched.specificAbnormalitiesInOocytes &&
              Boolean(formik.errors.specificAbnormalitiesInOocytes)
            }
            helperText={
              formik.touched.specificAbnormalitiesInOocytes &&
              formik.errors.specificAbnormalitiesInOocytes
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="immatureOocytes"
            label="Immature Oocytes"
            fullWidth
            value={formik.values.immatureOocytes}
            onChange={formik.handleChange}
            error={formik.touched.immatureOocytes && Boolean(formik.errors.immatureOocytes)}
            helperText={formik.touched.immatureOocytes && formik.errors.immatureOocytes}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="matureOocytes"
            label="Mature Oocytes"
            fullWidth
            value={formik.values.matureOocytes}
            onChange={formik.handleChange}
            error={formik.touched.matureOocytes && Boolean(formik.errors.matureOocytes)}
            helperText={formik.touched.matureOocytes && formik.errors.matureOocytes}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="differenceBetweenTriggerAndOPU"
            label="Difference Between Trigger and OPU"
            fullWidth
            value={formik.values.differenceBetweenTriggerAndOPU}
            onChange={formik.handleChange}
            error={
              formik.touched.differenceBetweenTriggerAndOPU &&
              Boolean(formik.errors.differenceBetweenTriggerAndOPU)
            }
            helperText={
              formik.touched.differenceBetweenTriggerAndOPU &&
              formik.errors.differenceBetweenTriggerAndOPU
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="selfOrDonor"
            label="Self or Donor"
            fullWidth
            value={formik.values.selfOrDonor}
            onChange={formik.handleChange}
            error={formik.touched.selfOrDonor && Boolean(formik.errors.selfOrDonor)}
            helperText={formik.touched.selfOrDonor && formik.errors.selfOrDonor}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="noOfFolliclesGreaterThan14mmAtTrigger"
            label="No. of Follicles > 14mm at Trigger"
            fullWidth
            value={formik.values.noOfFolliclesGreaterThan14mmAtTrigger}
            onChange={formik.handleChange}
            error={
              formik.touched.noOfFolliclesGreaterThan14mmAtTrigger &&
              Boolean(formik.errors.noOfFolliclesGreaterThan14mmAtTrigger)
            }
            helperText={
              formik.touched.noOfFolliclesGreaterThan14mmAtTrigger &&
              formik.errors.noOfFolliclesGreaterThan14mmAtTrigger
            }
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Male Investigations
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="thalassemiaScreeningComments"
            label="Thalassemia Screening Comments"
            fullWidth
            value={formik.values.thalassemiaScreeningComments}
            onChange={formik.handleChange}
            error={
              formik.touched.thalassemiaScreeningComments &&
              Boolean(formik.errors.thalassemiaScreeningComments)
            }
            helperText={
              formik.touched.thalassemiaScreeningComments &&
              formik.errors.thalassemiaScreeningComments
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="geneticTestingComments"
            label="Genetic Testing Comments"
            fullWidth
            value={formik.values.geneticTestingComments}
            onChange={formik.handleChange}
            error={
              formik.touched.geneticTestingComments && Boolean(formik.errors.geneticTestingComments)
            }
            helperText={
              formik.touched.geneticTestingComments && formik.errors.geneticTestingComments
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="viralMarkers"
            label="Viral Markers"
            fullWidth
            value={formik.values.viralMarkers}
            onChange={formik.handleChange}
            error={formik.touched.viralMarkers && Boolean(formik.errors.viralMarkers)}
            helperText={formik.touched.viralMarkers && formik.errors.viralMarkers}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="postEjaculatoryUrineExamination"
            label="Post Ejaculatory Urine Examination"
            fullWidth
            value={formik.values.postEjaculatoryUrineExamination}
            onChange={formik.handleChange}
            error={
              formik.touched.postEjaculatoryUrineExamination &&
              Boolean(formik.errors.postEjaculatoryUrineExamination)
            }
            helperText={
              formik.touched.postEjaculatoryUrineExamination &&
              formik.errors.postEjaculatoryUrineExamination
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="viralMarkersComments"
            label="Viral Markers Comments"
            fullWidth
            value={formik.values.viralMarkersComments}
            onChange={formik.handleChange}
            error={
              formik.touched.viralMarkersComments && Boolean(formik.errors.viralMarkersComments)
            }
            helperText={formik.touched.viralMarkersComments && formik.errors.viralMarkersComments}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Male Examination
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="surgicalHistory"
            label="Surgical History"
            fullWidth
            value={formik.values.surgicalHistory}
            onChange={formik.handleChange}
            error={formik.touched.surgicalHistory && Boolean(formik.errors.surgicalHistory)}
            helperText={formik.touched.surgicalHistory && formik.errors.surgicalHistory}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="localExaminationLeft"
            label="Local Examination Left"
            fullWidth
            value={formik.values.localExaminationLeft}
            onChange={formik.handleChange}
            error={
              formik.touched.localExaminationLeft && Boolean(formik.errors.localExaminationLeft)
            }
            helperText={formik.touched.localExaminationLeft && formik.errors.localExaminationLeft}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="localExaminationRight"
            label="Local Examination Right"
            fullWidth
            value={formik.values.localExaminationRight}
            onChange={formik.handleChange}
            error={
              formik.touched.localExaminationRight && Boolean(formik.errors.localExaminationRight)
            }
            helperText={formik.touched.localExaminationRight && formik.errors.localExaminationRight}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Sperm Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="selfOrDonorSperm"
            label="Self or Donor Sperm"
            fullWidth
            value={formik.values.selfOrDonorSperm}
            onChange={formik.handleChange}
            error={formik.touched.selfOrDonorSperm && Boolean(formik.errors.selfOrDonorSperm)}
            helperText={formik.touched.selfOrDonorSperm && formik.errors.selfOrDonorSperm}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="freezing"
            label="Freezing"
            fullWidth
            value={formik.values.freezing}
            onChange={formik.handleChange}
            error={formik.touched.freezing && Boolean(formik.errors.freezing)}
            helperText={formik.touched.freezing && formik.errors.freezing}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="spermCollectionRetrievalTechnique"
            label="Sperm Collection/Retrieval Technique"
            fullWidth
            value={formik.values.spermCollectionRetrievalTechnique}
            onChange={formik.handleChange}
            error={
              formik.touched.spermCollectionRetrievalTechnique &&
              Boolean(formik.errors.spermCollectionRetrievalTechnique)
            }
            helperText={
              formik.touched.spermCollectionRetrievalTechnique &&
              formik.errors.spermCollectionRetrievalTechnique
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="spermQualityAtOPU"
            label="Sperm Quality At OPU"
            fullWidth
            value={formik.values.spermQualityAtOPU}
            onChange={formik.handleChange}
            error={formik.touched.spermQualityAtOPU && Boolean(formik.errors.spermQualityAtOPU)}
            helperText={formik.touched.spermQualityAtOPU && formik.errors.spermQualityAtOPU}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" pt={2} pb={2}>
        Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="summary"
            label="Summary"
            fullWidth
            value={formik.values.summary}
            onChange={formik.handleChange}
            error={formik.touched.summary && Boolean(formik.errors.summary)}
            helperText={formik.touched.summary && formik.errors.summary}
          />
        </Grid>
      </Grid>

      {/* Sperm Details */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Upload Images & Description
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
              documentType={EDocumentTypes.TreatmentCycle}
              user={patient?._id}
              reportId={treatmentCycleId}
            />
          )}
        </Grid>
      </Grid>

      <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={
            isLoading ||
            (_.isEqual(formik.values, formik.initialValues) && fileUploadedUrl.length === 0)
          }
          sx={{ width: "fit-content" }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "fit-content" }}
          onClick={closeModal}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default IVFCycleSummary;
