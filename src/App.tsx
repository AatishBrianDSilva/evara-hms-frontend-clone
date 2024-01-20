import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.css"
import { getUserRole } from "./utils/auth";
import Layout from "./components/Layout/Layout";
import Console from "./features/Console/Console";
import IVFRegistration from "./features/IVFRegistration/IVFRegistration";
import Patients from "./features/Patients/Patients";
import Appointment from "./features/Appointment/Appointment";
import Sidebar from "./components/SideBar/SideBar";
import { useMediaQuery } from "@mui/material";
import MobileSidebar from "./components/MobileSideBar/MobileSidebar";

type ProtectedRouteType = {
  allowedRoles: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteType> = ({ allowedRoles }) => {
  const userRole = getUserRole(); // Get the current user's role

  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {

  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Console />} />
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="ivf-registration" element={<IVFRegistration />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointment />} />
        </Route>
        {isMobile && (<Route path="more" element={<MobileSidebar />} />)}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* Add more routes as needed */}
    </Routes>
  );
};


export default App
