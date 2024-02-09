import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header.tsx';
import Sidebar from '../SideBar/SideBar.tsx';
import PatientSidebar from '../SideBar/PatientSidebar.tsx';
import "./layoutStyle.css"
import BottomTabNavigator from '../BottomTabNavigator/BottomTabNavigator.tsx';
import { useMediaQuery } from '@mui/material';

const Layout: React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const location = useLocation();

    let sidebar;

    if (location.pathname.startsWith("/patients/dashboard")) {
        sidebar = <PatientSidebar />;
    } else {
        sidebar = <Sidebar />;
    }

    return (
        <div className="layout-container">
            <Header />
            <div className={`content-area`}>
                {!isMobile && sidebar}
                <main>
                    <Outlet />
                </main>
            </div>
            <BottomTabNavigator />
        </div>
    );
};

export default Layout;

