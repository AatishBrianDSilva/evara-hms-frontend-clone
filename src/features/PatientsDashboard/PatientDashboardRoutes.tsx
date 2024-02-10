import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PatientsDashboard from './PatientsDashboard'
import TreatmentCycles from './TreatmentCycles'
import TreatmentAspirationReport from './TreatmentAspirationReport'
import TreatmentDrugs from './TreatmentDrugs'
import TreatmentCyclePregnancyOutcome from './TreatmentCyclePregnancyOutcome'
import AndrologySemenAnalysis from './AndrologySemenAnalysis'
import AndrologySpermDFI from './AndrologySpermDFI'
import MedicalRecords from './MedicalRecords'
import Investigations from './Investigations'

const PatientsDashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientsDashboard />} />
      <Route path="/demographics" element={<div>Patients Demographics</div>} />
      <Route path="/history" element={<div>Patients History</div>} />
      <Route path="/visit-history" element={<div>Patients Visit History</div>} />
      <Route path="/medical-records" element={<MedicalRecords />} />
      <Route path="/investigations" element={<Investigations />} />
      <Route path="/treatment/treatment-cycle" element={<TreatmentCycles />} />
      <Route path="/treatment/oocyte-aspiration-report" element={<TreatmentAspirationReport />} />
      <Route path="/treatment/treatment-drugs" element={<TreatmentDrugs />} />
      <Route path="/treatment/cycle-pregnancy-outcome" element={<TreatmentCyclePregnancyOutcome />} />
      <Route path="/andrology/semen-analysis" element={<AndrologySemenAnalysis />} />
      <Route path="/andrology/sperm-dfi" element={<AndrologySpermDFI />} />
      <Route path="/andrology/sperm-freezing" element={<AndrologySemenAnalysis />} />
      <Route path="/andrology/sperm-preparation" element={<AndrologySemenAnalysis />} />
      <Route path="/andrology/iui-h" element={<AndrologySemenAnalysis />} />
      <Route path="/andrology/iui-d" element={<AndrologySemenAnalysis />} />
      <Route path="/andrology/tesa" element={<AndrologySemenAnalysis />} />
      <Route path="/andrology/iui-checklist" element={<AndrologySemenAnalysis />} />
    </Routes>
  )
}

export default PatientsDashboardRoutes