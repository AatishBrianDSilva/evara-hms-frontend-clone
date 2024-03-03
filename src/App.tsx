import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.css"
import { getUserRole } from "./utils/auth";
import Layout from "./components/Layout/Layout";
import Home from "./features/Home/Home";
import IVFRegistration from "./features/IVFRegistration/IVFRegistration";
import Patients from "./features/Patients/Patients";
import Appointment from "./features/Appointment/Appointment";

type ProtectedRouteType = {
  allowedRoles: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteType> = ({ allowedRoles }) => {
  const userRole = getUserRole(); // Get the current user's role

  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="ivf-registration" element={<IVFRegistration />} />
          <Route path="patients/*" element={<Patients />} />
          <Route path="appointments" element={<Appointment />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App
