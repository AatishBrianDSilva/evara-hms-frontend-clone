import { useContext } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useToast } from '../../../../../context/ToastContext';
import { useSelector } from 'react-redux';
import { useEditTreatmentCycleMutation } from '../../../../../services/patientDashboardService/treatmentCycleApi';
import ModalContext from '../../../../../context/ModalContext';
import { RootState } from '../../../../../app/store';
import _ from 'lodash';

// Form Components
import IvfSummaryForm from './IVFCycleSummary/IVFSummaryForm';
import FemaleFactorsForm from './IVFCycleSummary/FemaleFactorsForm';
import PreviousTreatmentsForm from './IVFCycleSummary/PreviousTreatmentsForm';
import OPUSummaryForm from './IVFCycleSummary/OPUSummaryForm';
import ChecklistForIVFForm from './IVFCycleSummary/ChecklistForIVFForm';
import SummaryForm from './IVFCycleSummary/SummaryForm';
import InfectionsForm from './IVFCycleSummary/InfectionsForm';
import PretreatmentsForm from './IVFCycleSummary/PretreatmentsForm';
import SurgicalHistoryForm from './IVFCycleSummary/SurgicalHistoryForm';
import StimulationForm from './IVFCycleSummary/StimulationForm';
import FemaleInvestigationsForm from './IVFCycleSummary/FemaleInvestigationsForm';
import TriggerForm from './IVFCycleSummary/TriggerForm';
import MaleFactorsForm from './IVFCycleSummary/MaleFactorsForm';
import OocyteAspirationForm from './IVFCycleSummary/OocyteAspirationForm';
import SpermDetailsForm from './IVFCycleSummary/SpermDetailsForm';
import MaleInvestigationForm from './IVFCycleSummary/MaleInvestigationsForm';

// IFormValues Interface Definition
interface IFormValues {
  // OPU Summary
  oocytePickUpDate: string | null;
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

  // Checklist for IVF
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

  // Female Factors
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

  // Summary
  selfOrDonorOocytes: string;
  reasonForART: string;
  maleFactor: string;

  // Infections
  stdComments: string;
  tuberculosisComments: string;
  historyOfPelvicInfectionsComments: string;

  // Pre-treatments
  lmp: string | null;

  // Previous Treatments
  primaryOrSecondaryInfertility: string;
  durationOfInfertility: string;

  // Stimulation
  downRegulation: string;
  dateOfStimulation: string | null;
  stimulationProtocol: string;

  // Surgical History
  hysteroscopyFindings: string;
  laparoscopyFindings: string;
  laparotomyFindings: string;

  // Female Investigations
  lh: string;
  cd138: string;
  e2: string;
  fshDay2: string;
  afcLeftComments: string;
  afcRightComments: string;
  amh: string;

  // Trigger
  postTriggerLH: string;
  postTriggerProgesterone: string;
  triggerDate: string | null;
  triggerComments: string;
  trigger: string;
  preTriggerLH: string;
  preTriggerProgesterone: string;
  preTriggerE2: string;
  repeat12HrsTrigger: string;
  triggerTime: string;
  endometrialThicknessOnDayOfTrigger: string;
  e2OnDayOfTrigger: string;

  // Male Factors
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

  // Oocyte Aspiration
  anaesthetist: string;
  surgeonOPU: string;
  opuDate: string | null;
  specificAbnormalitiesInOocytes: string;
  immatureOocytes: string;
  matureOocytes: string;
  differenceBetweenTriggerAndOPU: string;
  selfOrDonor: string;
  noOfFolliclesGreaterThan14mmAtTrigger: string;

  // Male Investigations
  thalassemiaScreeningComments: string;
  geneticTestingComments: string;
  viralMarkers: string;
  postEjaculatoryUrineExamination: string;
  viralMarkersComments: string;

  // Sperm Details
  selfOrDonorSperm: string;
  freezing: string;
  spermCollectionRetrievalTechnique: string;
  spermQualityAtOPU: string;

  // Summary
  summary: string;
}

const IVFCycleSummary = ({ contentProps }: { contentProps: any }) => {
  const { report, treatmentCycleId } = contentProps;
  const { closeModal } = useContext(ModalContext);
  const { showPromiseToast } = useToast();
  const patient = useSelector((state: RootState) => state.patients.patient);

  console.log('Patient data', patient);

  const [
    updateReport,
    //  { isLoading }
  ] = useEditTreatmentCycleMutation();

  const initialValues = {
    // opu summary
    oocytePickUpDate: report.details?.oocytePickUpDate || '',
    noOfOocytesRetrieved: report.details?.noOfOocytesRetrieved || '',
    noOfMatureOocytes: report.details?.noOfMatureOocytes || '',
    noOfImmatureOocytes: report.details?.noOfImmatureOocytes || '',
    oocyteQuality: report.details?.oocyteQuality || '',
    spermParameters: report.details?.spermParameters || '',
    oocytesICSI: report.details?.oocytesICSI || '',
    fertilizedICSI: report.details?.fertilizedICSI || '',
    spermProcessingMethod: report.details?.spermProcessingMethod || '',
    spermSelection: report.details?.spermSelection || '',
    noOfEmbryosTransferred: report.details?.noOfEmbryosTransferred || '',
    noOfEmbryosFrozen: report.details?.noOfEmbryosFrozen || '',
    embryosDiscarded: report.details?.embryosDiscarded || '',
    medication: report.details?.medication || '',

    // checklist for ivf
    isFemaleHistorySheetCompleted:
      report.details?.isFemaleHistorySheetCompleted || '',
    areViralMarkersDoneFemale: report.details?.areViralMarkersDoneFemale || '',
    resultViralMarkersFemale: report.details?.resultViralMarkersFemale || '',
    areViralMarkersDoneMale: report.details?.areViralMarkersDoneMale || '',
    financialTermsAndConditionsForART:
      report.details?.financialTermsAndConditionsForART || '',
    embryologistInformedTimingOfHCG:
      report.details?.embryologistInformedTimingOfHCG || '',
    mockTransfer: report.details?.mockTransfer || '',
    explainDSProcedureAndConsent:
      report.details?.explainDSProcedureAndConsent || '',
    spermFreezingBackup: report.details?.spermFreezingBackup || '',
    medicationUsed: report.details?.medicationUsed || '',
    discussConsentForms: report.details?.discussConsentForms || '',
    discussSuccessRatesOfART: report.details?.discussSuccessRatesOfART || '',

    // female factors
    hypoComments: report.details?.hypoComments || '',
    galactorrhoeaComments: report.details?.galactorrhoeaComments || '',
    hyperAndrogenemiaComments: report.details?.hyperAndrogenemiaComments || '',
    scan3D: report.details?.scan3D || '',
    scan2D: report.details?.scan2D || '',
    thinEndometriumIntervention:
      report.details?.thinEndometriumIntervention || '',
    tubalFactorComments: report.details?.tubalFactorComments || '',
    adenomyosisGradeAndComments:
      report.details?.adenomyosisGradeAndComments || '',
    fibroidsFIGOClassification:
      report.details?.fibroidsFIGOClassification || '',
    fibroidsNumberAndSize: report.details?.fibroidsNumberAndSize || '',

    // summary
    selfOrDonorOocytes: report.details?.selfOrDonorOocytes || '',
    reasonForART: report.details?.reasonForART || '',
    maleFactor: report.details?.maleFactor || '',

    // infections
    stdComments: report.details?.stdComments || '',
    tuberculosisComments: report.details?.tuberculosisComments || '',
    historyOfPelvicInfectionsComments:
      report.details?.historyOfPelvicInfectionsComments || '',

    // pre treatments
    lmp: report.details?.lmp || null,

    // previous treatments
    primaryOrSecondaryInfertility:
      report.details?.primaryOrSecondaryInfertility || '',
    durationOfInfertility: report.details?.durationOfInfertility || '',

    // stimulation
    downRegulation: report.details?.downRegulation || '',
    dateOfStimulation: report.details?.dateOfStimulation || null,
    stimulationProtocol: report.details?.stimulationProtocol || '',

    // surgical history
    hysteroscopyFindings: report.details?.hysteroscopyFindings || '',
    laparoscopyFindings: report.details?.laparoscopyFindings || '',
    laparotomyFindings: report.details?.laparotomyFindings || '',

    // female investigations
    lh: report.details?.lh || '',
    cd138: report.details?.cd138 || '',
    e2: report.details?.e2 || '',
    fshDay2: report.details?.fshDay2 || '',
    afcLeftComments: report.details?.afcLeftComments || '',
    afcRightComments: report.details?.afcRightComments || '',
    amh: report.details?.amh || '',

    // trigger
    postTriggerLH: report.details?.postTriggerLH || '',
    postTriggerProgesterone: report.details?.postTriggerProgesterone || '',
    triggerDate: report.details?.triggerDate || null,
    triggerComments: report.details?.triggerComments || '',
    trigger: report.details?.trigger || '',
    preTriggerLH: report.details?.preTriggerLH || '',
    preTriggerProgesterone: report.details?.preTriggerProgesterone || '',
    preTriggerE2: report.details?.preTriggerE2 || '',
    repeat12HrsTrigger: report.details?.repeat12HrsTrigger || '',
    triggerTime: report.details?.triggerTime || '',
    endometrialThicknessOnDayOfTrigger:
      report.details?.endometrialThicknessOnDayOfTrigger || '',
    e2OnDayOfTrigger: report.details?.e2OnDayOfTrigger || '',

    // male factors
    diabetesComments: report.details?.diabetesComments || '',
    bloodGroup: report.details?.bloodGroup || '',
    bmi: report.details?.bmi || '',
    smokingComments: report.details?.smokingComments || '',
    alcoholConsumptionComments:
      report.details?.alcoholConsumptionComments || '',
    hypertensionComments: report.details?.hypertensionComments || '',
    thyroidDisorderComments: report.details?.thyroidDisorderComments || '',
    hyperprolactinemiaComments:
      report.details?.hyperprolactinemiaComments || '',
    androgenemiaComments: report.details?.androgenemiaComments || '',
    stdDiagnosis: report.details?.stdDiagnosis || '',
    varicocele: report.details?.varicocele || '',
    hypoHypoComments: report.details?.hypoHypoComments || '',
    traumaComments: report.details?.traumaComments || '',
    ejaculatoryDysfunctionComments:
      report.details?.ejaculatoryDysfunctionComments || '',

    // oocyte aspiration
    anaesthetist: report.details?.anaesthetist || '',
    surgeonOPU: report.details?.surgeonOPU || '',
    opuDate: report.details?.opuDate || null,
    specificAbnormalitiesInOocytes:
      report.details?.specificAbnormalitiesInOocytes || '',
    immatureOocytes: report.details?.immatureOocytes || '',
    matureOocytes: report.details?.matureOocytes || '',
    differenceBetweenTriggerAndOPU:
      report.details?.differenceBetweenTriggerAndOPU || '',
    selfOrDonor: report.details?.selfOrDonor || '',
    noOfFolliclesGreaterThan14mmAtTrigger:
      report.details?.noOfFolliclesGreaterThan14mmAtTrigger || '',

    // male investigations
    thalassemiaScreeningComments:
      report.details?.thalassemiaScreeningComments || '',
    geneticTestingComments: report.details?.geneticTestingComments || '',
    viralMarkers: report.details?.viralMarkers || '',
    postEjaculatoryUrineExamination:
      report.details?.postEjaculatoryUrineExamination || '',
    viralMarkersComments: report.details?.viralMarkersComments || '',

    // male examination
    surgicalHistory: report.details?.surgicalHistory || '',
    localExaminationLeft: report.details?.localExaminationLeft || '',
    localExaminationRight: report.details?.localExaminationRight || '',

    // sperm details
    selfOrDonorSperm: report.details?.selfOrDonorSperm || '',
    freezing: report.details?.freezing || '',
    spermCollectionRetrievalTechnique:
      report.details?.spermCollectionRetrievalTechnique || '',
    spermQualityAtOPU: report.details?.spermQualityAtOPU || '',

    // summary
    summary: report.details?.summary || '',
  };

  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      id: treatmentCycleId,
      details: { ...values },
      documentId: report._id,
    };

    const options = {
      sort: { createdAt: -1 },
    };

    const promise = updateReport({ payload, options }).unwrap();

    showPromiseToast(promise, {
      loading: 'Saving OPU Report...',
      success: data => data.message || 'OPU Report Updated Successfully',
      error: data => data.message || 'Error Updating OPU Report',
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik<IFormValues>({
    initialValues,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} p={2}>
      <Typography variant="h4" align="center" color="primary">
        IVF Cycle Summary
      </Typography>
      <OPUSummaryForm formik={formik as any} />
      <ChecklistForIVFForm formik={formik as any} />
      <FemaleFactorsForm formik={formik as any} />
      <SummaryForm formik={formik as any} />
      <InfectionsForm formik={formik as any} />
      <PretreatmentsForm formik={formik as any} />
      <PreviousTreatmentsForm formik={formik as any} />
      <StimulationForm formik={formik as any} />
      <SurgicalHistoryForm formik={formik as any} />
      <FemaleInvestigationsForm formik={formik as any} />
      <TriggerForm formik={formik as any} />
      <MaleFactorsForm formik={formik as any} />
      <OocyteAspirationForm formik={formik as any} />
      <MaleInvestigationForm formik={formik as any} />
      <SpermDetailsForm formik={formik as any} />
      <IvfSummaryForm formik={formik as any} />
      <Box
        display={'flex'}
        justifyContent={'flex-end'}
        alignItems={'center'}
        gap={2}
        mb={2}
      >
        <Button
          variant="contained"
          color="primary"
          type="submit"
          // disabled={isLoading || _.isEqual(formik.values, formik.initialValues)}
          disabled={true} // Disable the button
        >
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={closeModal}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default IVFCycleSummary;
