import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.tsx';
import Sidebar from '../SideBar/SideBar.tsx';
import "./layoutStyle.css"

const Layout: React.FC = () => {
    return (
        <div className="layout-container">
            <Header />
            <div className="content-area">
                <Sidebar />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};


export default Layout;

