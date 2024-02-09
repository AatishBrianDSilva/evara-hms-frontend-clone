// Inside Patients.tsx
import { Route, Routes } from "react-router-dom";
import PatientList from "./PatientsList";
import PatientsDashboardRoutes from "../PatientsDashboard/PatientDashboardRoutes";

const Patients: React.FC = () => {
  return (
    <div>
      {/* Other content of the Patients component */}
      {/* Define routes for patient dashboard */}
      <Routes>
        <Route path="/" element={<PatientList />} />
        <Route path="dashboard/:patientId/*" element={<PatientsDashboardRoutes />} />
      </Routes>
    </div>
  );
};

export default Patients;
