// Inside Patients.tsx
import { Route, Routes } from "react-router-dom";
import PatientsList from "./PatientsList";
import PatientsDashboard from "../PatientsDashboard/PatientsDashboard";
import PatientHistory from "../PatientsDashboard/PatientHistory";

const Patients: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientsList />} />
      <Route path="/:patientId" element={<PatientsDashboard />} />
      <Route path="/:patientId/history" element={<PatientHistory />} />
    </Routes>
  );
};

export default Patients;
