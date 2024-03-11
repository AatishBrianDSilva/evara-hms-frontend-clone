import React from 'react';
import './sidebarStyle.css';
import clinicLogo from '../../assets/clinic-logo.png';
import SideBarNavTab from '../SideBarNavTab/SideBarNavTab';
import { navList } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {

    const navigate = useNavigate();

    for (const navItem of navList) {
        navItem.onSelect = () => navigate(navItem.path);
    }

    return (
        <aside className="sidebar">
            {/* Sidebar content */}
            <div className='clinic-logo'>
                <img src={clinicLogo} alt="logo" />
            </div>
            <div className='sidebar-nav-list'>
                {navList.map((navItem, index) => (
                    <SideBarNavTab
                        isAccordion={navItem.isAccordion || false}
                        accordionItems={navItem.accordionItems || []}
                        key={index}
                        logoSrc={navItem.icon}
                        title={navItem.title}
                        path={navItem.path}
                        onSelect={navItem.onSelect}
                    />
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;

