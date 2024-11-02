import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PatientsDashboard from '../PatientDashboard/PatientDashboard';
import TreatmentCycles from './TreatmentCycles';
import TreatmentAspirationReport from './TreatmentAspirationReport';
import TreatmentDrugs from './TreatmentDrugs';
import TreatmentCyclePregnancyOutcome from './TreatmentCyclePregnancyOutcome';
import AndrologySemenAnalysis from './AndrologySemenAnalysis';
import AndrologySpermDFI from './AndrologySpermDFI';
import MedicalRecords from './MedicalRecords';
import Investigations from './Investigations';
import AndrologySpermFreezing from './AndrologySpermFreezing';
import AndrologySpermPreparation from './AndrologySpermPreparation';
import EmbryologyLabRecords from './EmbryologyLabRecords';
import EmbryologySummary from './EmbryologySummary';
import EmbryologyArtReport from './EmbryologyArtReport';
import EmbryologyCryoPreservation from './EmbryologyCryoPreservation';
import EmbryologyFETDischarge from './EmbryologyFETDischarge';
import EmbryologyDonorEmbryoTransfer from './EmbryologyDonorEmbryoTransfer';
import EmbryologyIVFChecklist from './EmbryologyIVFChecklist';
// import PatientHistory from '../PatientsDashboard/History'

const PatientsDashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientsDashboard />} />
      <Route path="/demographics" element={<div>Patients Demographics</div>} />
      {/* <Route path="/history" element={<PatientHistory />} /> */}
      <Route
        path="/visit-history"
        element={<div>Patients Visit History</div>}
      />
      <Route path="/medical-records" element={<MedicalRecords />} />
      <Route path="/investigations" element={<Investigations />} />
      <Route path="/treatment/treatment-cycle" element={<TreatmentCycles />} />
      <Route
        path="/treatment/oocyte-aspiration-report"
        element={<TreatmentAspirationReport />}
      />
      <Route path="/treatment/treatment-drugs" element={<TreatmentDrugs />} />
      <Route
        path="/treatment/cycle-pregnancy-outcome"
        element={<TreatmentCyclePregnancyOutcome />}
      />
      <Route
        path="/andrology/semen-analysis"
        element={<AndrologySemenAnalysis />}
      />
      <Route path="/andrology/sperm-dfi" element={<AndrologySpermDFI />} />
      <Route
        path="/andrology/sperm-freezing"
        element={<AndrologySpermFreezing />}
      />
      <Route
        path="/andrology/sperm-preparation"
        element={<AndrologySpermPreparation />}
      />
      <Route path="/andrology/iui-h" element={<AndrologySemenAnalysis />} />
      <Route path="/andrology/iui-d" element={<AndrologySemenAnalysis />} />
      <Route path="/andrology/tesa" element={<AndrologySemenAnalysis />} />
      <Route
        path="/andrology/iui-checklist"
        element={<AndrologySemenAnalysis />}
      />
      <Route
        path="/embryology/lab-records"
        element={<EmbryologyLabRecords />}
      />
      <Route path="/embryology/summary" element={<EmbryologySummary />} />
      <Route path="/embryology/art-report" element={<EmbryologyArtReport />} />
      <Route
        path="/embryology/cryo-preservation"
        element={<EmbryologyCryoPreservation />}
      />
      <Route
        path="/embryology/fet-discharge"
        element={<EmbryologyFETDischarge />}
      />
      <Route
        path="/embryology/donor-embryo-transfer"
        element={<EmbryologyDonorEmbryoTransfer />}
      />
      <Route
        path="/embryology/ivf-check-list"
        element={<EmbryologyIVFChecklist />}
      />
    </Routes>
  );
};

export default PatientsDashboardRoutes;
