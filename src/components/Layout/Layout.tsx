import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.tsx';
import Sidebar from '../SideBar/SideBar.tsx';
import "./layoutStyle.css"
import BottomTabNavigator from '../BottomTabNavigator/BottomTabNavigator.tsx';
import { useMediaQuery } from '@mui/material';

const Layout: React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    return (
        <div className="layout-container">
            <Header />
            <div className={`content-area`}>
                {!isMobile && (<Sidebar />)}
                <main>
                    <Outlet />
                </main>
            </div>
            <BottomTabNavigator />
        </div>
    );
};


export default Layout;

